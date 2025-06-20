import { ipfsService, DatasetMetadata, StorageResult } from './ipfs';
import { filecoinService, FilecoinDeal } from './filecoin';

export interface Dataset {
  id: string;
  metadata: DatasetMetadata;
  ipfsHash: string;
  filecoinDeal?: FilecoinDeal;
  verified: boolean;
  qualityScore: number;
  downloadCount: number;
  earnings: string;
}

export interface UploadOptions {
  enableFilecoinStorage: boolean;
  storageDuration: number; // in epochs
  maxStoragePrice: string; // in FIL
}

class StorageService {
  /**
   * Upload dataset with automatic IPFS + Filecoin storage
   */
  async uploadDataset(
    data: File | Buffer,
    metadata: DatasetMetadata,
    options: UploadOptions = {
      enableFilecoinStorage: true,
      storageDuration: 525600, // ~1 year in epochs
      maxStoragePrice: '1.0'
    }
  ): Promise<Dataset> {
    try {
      // Step 1: Upload to IPFS
      console.log('Uploading to IPFS...');
      const ipfsResult = await ipfsService.uploadDataset(data, metadata);
      
      // Step 2: Create dataset record
      const dataset: Dataset = {
        id: `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metadata,
        ipfsHash: ipfsResult.ipfsHash,
        verified: false,
        qualityScore: 0,
        downloadCount: 0,
        earnings: '0'
      };

      // Step 3: Optional Filecoin storage
      if (options.enableFilecoinStorage) {
        console.log('Creating Filecoin storage deal...');
        
        // Get storage offers
        const offers = await filecoinService.getStorageOffers(
          ipfsResult.size,
          options.storageDuration
        );

        // Select best offer within price range
        const bestOffer = offers
          .filter(offer => parseFloat(offer.price) <= parseFloat(options.maxStoragePrice))
          .sort((a, b) => b.reputation - a.reputation)[0];

        if (bestOffer) {
          const deal = await filecoinService.createStorageDeal(
            ipfsResult.ipfsHash,
            ipfsResult.size,
            options.storageDuration,
            bestOffer.price
          );
          
          dataset.filecoinDeal = deal;
          console.log('Filecoin storage deal created:', deal.dealId);
        } else {
          console.warn('No suitable storage providers found within price range');
        }
      }

      // Step 4: Pin to IPFS for immediate availability
      await ipfsService.pinDataset(ipfsResult.ipfsHash);

      console.log('Dataset uploaded successfully:', dataset.id);
      return dataset;

    } catch (error) {
      console.error('Dataset upload failed:', error);
      throw new Error('Failed to upload dataset');
    }
  }

  /**
   * Retrieve dataset by ID or IPFS hash
   */
  async getDataset(identifier: string): Promise<any> {
    try {
      // Try to get from IPFS first (fastest)
      return await ipfsService.getDataset(identifier);
    } catch (error) {
      console.error('Dataset retrieval failed:', error);
      throw new Error('Dataset not found or unavailable');
    }
  }

  /**
   * Search datasets by criteria
   */
  async searchDatasets(query: {
    tags?: string[];
    format?: string;
    minQualityScore?: number;
    verified?: boolean;
  }): Promise<Dataset[]> {
    try {
      // This would integrate with a decentralized search index
      // For MVP, return simulated results
      return [];
    } catch (error) {
      console.error('Dataset search failed:', error);
      return [];
    }
  }

  /**
   * Verify dataset integrity and authenticity
   */
  async verifyDataset(dataset: Dataset): Promise<boolean> {
    try {
      // Verify IPFS content integrity
      const ipfsValid = await ipfsService.validateDataset(
        dataset.ipfsHash,
        dataset.metadata.checksum
      );

      // Verify Filecoin storage if deal exists
      let filecoinValid = true;
      if (dataset.filecoinDeal) {
        filecoinValid = await filecoinService.verifyStorage(
          dataset.filecoinDeal.dealId,
          dataset.metadata.checksum
        );
      }

      return ipfsValid && filecoinValid;
    } catch (error) {
      console.error('Dataset verification failed:', error);
      return false;
    }
  }

  /**
   * Calculate storage costs
   */
  async estimateStorageCost(
    size: number,
    duration: number
  ): Promise<{ min: string; max: string; average: string }> {
    try {
      const offers = await filecoinService.getStorageOffers(size, duration);
      
      if (offers.length === 0) {
        return { min: '0', max: '0', average: '0' };
      }

      const prices = offers.map(offer => parseFloat(offer.price));
      const min = Math.min(...prices).toString();
      const max = Math.max(...prices).toString();
      const average = (prices.reduce((a, b) => a + b, 0) / prices.length).toString();

      return { min, max, average };
    } catch (error) {
      console.error('Storage cost estimation failed:', error);
      return { min: '0', max: '0', average: '0' };
    }
  }

  /**
   * Get dataset usage statistics
   */
  async getDatasetStats(datasetId: string): Promise<{
    downloads: number;
    earnings: string;
    qualityScore: number;
    verificationStatus: boolean;
  }> {
    try {
      // This would query usage metrics from smart contracts
      // For MVP, return simulated stats
      return {
        downloads: Math.floor(Math.random() * 1000),
        earnings: (Math.random() * 10).toFixed(4),
        qualityScore: Math.floor(Math.random() * 100),
        verificationStatus: Math.random() > 0.3
      };
    } catch (error) {
      console.error('Failed to get dataset stats:', error);
      return {
        downloads: 0,
        earnings: '0',
        qualityScore: 0,
        verificationStatus: false
      };
    }
  }

  /**
   * Replicate dataset to additional storage providers
   */
  async replicateDataset(
    dataset: Dataset,
    additionalProviders: number = 2
  ): Promise<FilecoinDeal[]> {
    try {
      const newDeals: FilecoinDeal[] = [];
      
      for (let i = 0; i < additionalProviders; i++) {
        const offers = await filecoinService.getStorageOffers(
          dataset.metadata.size,
          525600 // 1 year duration
        );

        if (offers.length > i) {
          const deal = await filecoinService.createStorageDeal(
            dataset.ipfsHash,
            dataset.metadata.size,
            525600,
            offers[i].price
          );
          newDeals.push(deal);
        }
      }

      return newDeals;
    } catch (error) {
      console.error('Dataset replication failed:', error);
      return [];
    }
  }
}

export const storageService = new StorageService();