import { ethers } from 'ethers';
import contractsInfo from './contracts.json';
import deploymentInfo from './deployment.json';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class Web3Service {
  private provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null = null;
  private signer: ethers.Signer | null = null;
  private marketplaceContract: ethers.Contract | null = null;
  private reputationContract: ethers.Contract | null = null;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }

  async connectWallet(): Promise<string> {
    if (!this.provider) {
      throw new Error('No Web3 provider found');
    }

    await this.provider.send('eth_requestAccounts', []);
    this.signer = this.provider.getSigner();
    
    // Connect contracts with signer
    await this.connectContracts();
    
    return await this.signer.getAddress();
  }

  private async connectContracts() {
    if (!this.provider && typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
    
    if (!this.provider) {
      // Fallback to JSON RPC provider for read operations
      this.provider = new ethers.JsonRpcProvider("https://api.calibration.node.glif.io/rpc/v1");
    }

    const signer = this.signer || this.provider;
    
    // Connect to deployed contracts
    this.marketplaceContract = new ethers.Contract(
      contractsInfo.KnowledgeMarketplace.address,
      contractsInfo.KnowledgeMarketplace.abi,
      signer
    );

    this.reputationContract = new ethers.Contract(
      contractsInfo.ReputationSystem.address,
      contractsInfo.ReputationSystem.abi,
      signer
    );
  }

  // Marketplace Functions
  async registerDataset(
    ipfsHash: string,
    metadata: {
      name: string;
      description: string;
      tags: string[];
      format: string;
      size: number;
      license: string;
    },
    priceInWei: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.marketplaceContract || !this.signer) {
      throw new Error('Contract not connected');
    }

    const metadataHash = "QmMetadata" + Math.random().toString(36).substring(2, 48); // Mock metadata hash
    const datasetId = "dataset_" + Date.now(); // Generate unique ID
    
    return await this.marketplaceContract.submitDataset(
      datasetId,
      ipfsHash,
      metadataHash,
      priceInWei,
      { gasLimit: 25000000 } // Proper gas limit
    );
  }

  async purchaseDataset(datasetId: string, priceInWei: string): Promise<ethers.ContractTransactionResponse> {
    // Ensure wallet and contracts are connected
    if (!this.signer || !this.marketplaceContract) {
      // Try to reconnect
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await this.connectWallet();
        }
      }
      
      if (!this.marketplaceContract || !this.signer) {
        throw new Error('Contract not connected. Please connect your wallet first.');
      }
    }


    // Let MetaMask estimate gas first
    try {
      const gasEstimate = await this.marketplaceContract.estimateGas.purchaseDataset(datasetId, {
        value: priceInWei
      });
      console.log('Gas estimate:', gasEstimate.toString());
      
      return await this.marketplaceContract.purchaseDataset(datasetId, {
        value: priceInWei,
        gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
      });
    } catch (gasError) {
      console.log('Gas estimation failed, using fixed limit');
      return await this.marketplaceContract.purchaseDataset(datasetId, {
        value: priceInWei,
        gasLimit: 30000000 // Fallback gas limit
      });
    }
  }

  async getDataset(datasetId: string): Promise<any> {
    if (!this.marketplaceContract) {
      // Try to connect contracts without wallet for read-only operations
      try {
        await this.connectContracts();
      } catch (error) {
        console.warn('Failed to connect contracts for getDataset:', error);
        return null; // Return null instead of throwing for graceful fallback
      }
    }
    
    if (!this.marketplaceContract) {
      console.warn('Contract still not connected after attempt, returning null for getDataset');
      return null; // Return null instead of throwing for graceful fallback
    }

    try {
      return await this.marketplaceContract.datasets(datasetId);
    } catch (error) {
      console.warn('getDataset contract call failed:', error);
      return null; // Return null instead of throwing for graceful fallback
    }
  }

  async getTotalDatasets(): Promise<number> {
    if (!this.marketplaceContract) {
      throw new Error('Contract not connected');
    }

    const total = await this.marketplaceContract.getTotalDatasets();
    return Number(total);
  }

  async getDatasetsByContributor(contributor: string): Promise<string[]> {
    if (!this.marketplaceContract) {
      throw new Error('Contract not connected');
    }

    return await this.marketplaceContract.getDatasetsByContributor(contributor);
  }

  async hasAccess(datasetId: string, user: string): Promise<boolean> {
    if (!this.marketplaceContract) {
      // Try to connect contracts for server-side usage
      try {
        await this.connectContracts();
        if (!this.marketplaceContract) {
          console.warn('Contract still not connected after attempt, returning false for hasAccess');
          return false; // For demo purposes, return false instead of throwing
        }
      } catch (error) {
        console.warn('Failed to connect contracts for hasAccess check:', error);
        return false; // For demo purposes, return false instead of throwing
      }
    }

    try {
      return await this.marketplaceContract.hasAccess(datasetId, user);
    } catch (error) {
      console.warn('hasAccess contract call failed:', error);
      return false; // For demo purposes, return false instead of throwing
    }
  }

  // Reputation Functions
  async getUserReputation(user: string): Promise<any> {
    if (!this.reputationContract) {
      throw new Error('Reputation contract not connected');
    }

    return await this.reputationContract.getUserReputation(user);
  }

  async getUserBadges(user: string): Promise<string[]> {
    if (!this.reputationContract) {
      throw new Error('Reputation contract not connected');
    }

    return await this.reputationContract.getUserBadges(user);
  }

  async validateDataset(
    datasetId: string,
    qualityScore: number,
    comments: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.reputationContract || !this.signer) {
      throw new Error('Contract not connected');
    }

    return await this.reputationContract.validateDataset(
      datasetId,
      qualityScore,
      comments,
      { value: ethers.utils.parseEther('0.1') } // Stake amount
    );
  }

  // Utility Functions
  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not connected');
    }

    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  formatPrice(priceInWei: string): string {
    return ethers.utils.formatEther(priceInWei);
  }

  parsePrice(priceInFIL: string): string {
    return ethers.utils.parseEther(priceInFIL).toString();
  }

  // Event Listeners
  onDatasetRegistered(callback: (datasetId: string, contributor: string) => void) {
    if (!this.marketplaceContract) return;

    this.marketplaceContract.on('DatasetRegistered', callback);
  }

  onDatasetPurchased(callback: (datasetId: string, buyer: string, price: string) => void) {
    if (!this.marketplaceContract) return;

    this.marketplaceContract.on('DatasetPurchased', callback);
  }

  onValidationSubmitted(callback: (datasetId: string, validator: string, score: number) => void) {
    if (!this.reputationContract) return;

    this.reputationContract.on('ValidationSubmitted', callback);
  }

  // Network Info
  getNetworkInfo() {
    return {
      network: deploymentInfo.network,
      deployer: deploymentInfo.deployer,
      contracts: deploymentInfo.contracts,
      timestamp: deploymentInfo.timestamp
    };
  }
}

// Export singleton instance
export const web3Service = new Web3Service();