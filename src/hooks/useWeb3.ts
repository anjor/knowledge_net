import { useState, useEffect, useCallback } from 'react';
import { web3Service } from '../utils/web3';

export interface Dataset {
  id: string;
  ipfsHash: string;
  metadata: {
    name: string;
    description: string;
    tags: string[];
    format: string;
    size: number;
    license: string;
  };
  contributor: string;
  price: string;
  downloadCount: number;
  qualityScore: number;
  verified: boolean;
  timestamp: number;
}

export const useWeb3 = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const address = await web3Service.connectWallet();
      setAccount(address);
      setIsConnected(true);
      
      const userBalance = await web3Service.getBalance(address);
      setBalance(userBalance);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!account) return;
    
    try {
      const userBalance = await web3Service.getBalance(account);
      setBalance(userBalance);
    } catch (err: any) {
      console.error('Balance refresh error:', err);
    }
  }, [account]);

  const registerDataset = useCallback(async (
    ipfsHash: string,
    metadata: Dataset['metadata'],
    priceInFIL: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const priceInWei = web3Service.parsePrice(priceInFIL);
      const tx = await web3Service.registerDataset(ipfsHash, metadata, priceInWei);
      
      await tx.wait(); // Wait for transaction confirmation
      await refreshBalance();
      
      return tx.hash;
    } catch (err: any) {
      setError(err.message || 'Failed to register dataset');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshBalance]);

  const purchaseDataset = useCallback(async (datasetId: string, priceInWei: string) => {
    try {
      setLoading(true);
      setError(null);

      const tx = await web3Service.purchaseDataset(datasetId, priceInWei);
      
      await tx.wait(); // Wait for transaction confirmation
      await refreshBalance();
      
      return tx.hash;
    } catch (err: any) {
      setError(err.message || 'Failed to purchase dataset');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshBalance]);

  const validateDataset = useCallback(async (
    datasetId: string,
    qualityScore: number,
    comments: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const tx = await web3Service.validateDataset(datasetId, qualityScore, comments);
      
      await tx.wait(); // Wait for transaction confirmation
      await refreshBalance();
      
      return tx.hash;
    } catch (err: any) {
      setError(err.message || 'Failed to validate dataset');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshBalance]);

  const getDataset = useCallback(async (datasetId: string): Promise<Dataset | null> => {
    try {
      const contractData = await web3Service.getDataset(datasetId);
      
      if (!contractData || !contractData.ipfsHash) {
        return null;
      }

      // Parse metadata from contract
      const metadata = JSON.parse(contractData.metadata);
      
      return {
        id: datasetId,
        ipfsHash: contractData.ipfsHash,
        metadata,
        contributor: contractData.contributor,
        price: web3Service.formatPrice(contractData.price),
        downloadCount: contractData.downloadCount.toNumber(),
        qualityScore: contractData.qualityScore,
        verified: contractData.verified,
        timestamp: contractData.timestamp.toNumber()
      };
    } catch (err: any) {
      console.error('Get dataset error:', err);
      return null;
    }
  }, []);

  const getUserDatasets = useCallback(async (userAddress?: string): Promise<Dataset[]> => {
    try {
      const address = userAddress || account;
      if (!address) return [];

      const datasetIds = await web3Service.getDatasetsByContributor(address);
      const datasets: Dataset[] = [];

      for (const id of datasetIds) {
        const dataset = await getDataset(id);
        if (dataset) {
          datasets.push(dataset);
        }
      }

      return datasets;
    } catch (err: any) {
      console.error('Get user datasets error:', err);
      return [];
    }
  }, [account, getDataset]);

  const checkAccess = useCallback(async (datasetId: string, userAddress?: string): Promise<boolean> => {
    try {
      const address = userAddress || account;
      if (!address) return false;

      return await web3Service.hasAccess(datasetId, address);
    } catch (err: any) {
      console.error('Check access error:', err);
      return false;
    }
  }, [account]);

  const getUserReputation = useCallback(async (userAddress?: string) => {
    try {
      const address = userAddress || account;
      if (!address) return null;

      const reputation = await web3Service.getUserReputation(address);
      const badges = await web3Service.getUserBadges(address);
      
      return {
        score: reputation.score.toNumber(),
        validationsCount: reputation.validationsCount.toNumber(),
        totalEarnings: web3Service.formatPrice(reputation.totalEarnings),
        badges
      };
    } catch (err: any) {
      console.error('Get reputation error:', err);
      return null;
    }
  }, [account]);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            
            const userBalance = await web3Service.getBalance(accounts[0]);
            setBalance(userBalance);
          }
        } catch (err) {
          console.error('Auto-connection check failed:', err);
        }
      }
    };

    checkConnection();
  }, []);

  return {
    // State
    isConnected,
    account,
    balance,
    loading,
    error,
    
    // Actions
    connectWallet,
    refreshBalance,
    registerDataset,
    purchaseDataset,
    validateDataset,
    
    // Queries
    getDataset,
    getUserDatasets,
    checkAccess,
    getUserReputation,
    
    // Utilities
    formatPrice: web3Service.formatPrice,
    parsePrice: web3Service.parsePrice,
    getNetworkInfo: web3Service.getNetworkInfo
  };
};