import { storageService, Dataset } from '../utils/storage';
import { ipfsService } from '../utils/ipfs';

export interface AIQuery {
  id: string;
  query: string;
  tags: string[];
  format?: string;
  minQualityScore?: number;
  maxPrice?: string;
  requesterAddress: string;
  timestamp: number;
}

export interface AIResponse {
  queryId: string;
  datasets: Dataset[];
  totalResults: number;
  queryTime: number;
  recommendations: string[];
}

export interface DataAccess {
  datasetId: string;
  accessKey: string;
  downloadUrl: string;
  validUntil: number;
  usage: {
    maxDownloads: number;
    currentDownloads: number;
  };
}

export interface ProvenanceChain {
  datasetId: string;
  chain: ProvenanceLink[];
  verified: boolean;
}

export interface ProvenanceLink {
  hash: string;
  timestamp: number;
  action: 'created' | 'modified' | 'verified' | 'accessed';
  actor: string;
  metadata: any;
}

class AIInterface {
  private activeQueries: Map<string, AIQuery> = new Map();
  private accessTokens: Map<string, DataAccess> = new Map();

  /**
   * Query datasets for AI models
   */
  async queryDatasets(query: {
    searchTerms: string;
    tags?: string[];
    format?: string;
    minQualityScore?: number;
    maxPrice?: string;
    limit?: number;
  }, requesterAddress: string): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      const queryId = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store query for tracking
      const aiQuery: AIQuery = {
        id: queryId,
        query: query.searchTerms,
        tags: query.tags || [],
        format: query.format,
        minQualityScore: query.minQualityScore || 0,
        maxPrice: query.maxPrice,
        requesterAddress,
        timestamp: Date.now()
      };
      
      this.activeQueries.set(queryId, aiQuery);

      // Search datasets using storage service
      const searchResults = await storageService.searchDatasets({
        tags: query.tags,
        format: query.format,
        minQualityScore: query.minQualityScore,
        verified: true
      });

      // Filter by price if specified
      let filteredResults = searchResults;
      if (query.maxPrice) {
        const maxPriceNum = parseFloat(query.maxPrice);
        filteredResults = searchResults.filter(dataset => 
          parseFloat(dataset.metadata.size.toString()) <= maxPriceNum
        );
      }

      // Apply limit
      if (query.limit) {
        filteredResults = filteredResults.slice(0, query.limit);
      }

      // Generate recommendations based on query patterns
      const recommendations = this.generateRecommendations(aiQuery, filteredResults);

      const response: AIResponse = {
        queryId,
        datasets: filteredResults,
        totalResults: filteredResults.length,
        queryTime: Date.now() - startTime,
        recommendations
      };

      return response;

    } catch (error) {
      console.error('AI query failed:', error);
      throw new Error('Failed to query datasets');
    }
  }

  /**
   * Request access to a specific dataset
   */
  async requestDatasetAccess(
    datasetId: string,
    requesterAddress: string,
    paymentProof: string
  ): Promise<DataAccess> {
    try {
      // Verify payment proof (would check smart contract)
      const paymentValid = await this.verifyPayment(datasetId, requesterAddress, paymentProof);
      if (!paymentValid) {
        throw new Error('Invalid payment proof');
      }

      // Generate access token
      const accessKey = `access_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
      
      // Create temporary download URL (signed URL pattern)
      const downloadUrl = await this.generateSecureDownloadUrl(datasetId, accessKey);

      const dataAccess: DataAccess = {
        datasetId,
        accessKey,
        downloadUrl,
        validUntil: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        usage: {
          maxDownloads: 5, // Allow 5 downloads per access token
          currentDownloads: 0
        }
      };

      this.accessTokens.set(accessKey, dataAccess);

      return dataAccess;

    } catch (error) {
      console.error('Dataset access request failed:', error);
      throw new Error('Failed to grant dataset access');
    }
  }

  /**
   * Download dataset with access token
   */
  async downloadDataset(
    accessKey: string,
    requesterAddress: string
  ): Promise<{ data: any; metadata: any; provenanceChain: ProvenanceChain }> {
    try {
      const access = this.accessTokens.get(accessKey);
      if (!access) {
        throw new Error('Invalid access token');
      }

      if (Date.now() > access.validUntil) {
        throw new Error('Access token expired');
      }

      if (access.usage.currentDownloads >= access.usage.maxDownloads) {
        throw new Error('Download limit exceeded');
      }

      // Get dataset from IPFS
      const dataset = await storageService.getDataset(access.datasetId);
      
      // Generate provenance chain
      const provenanceChain = await this.generateProvenanceChain(access.datasetId);

      // Update usage count
      access.usage.currentDownloads++;
      this.accessTokens.set(accessKey, access);

      return {
        data: dataset.data,
        metadata: dataset.metadata,
        provenanceChain
      };

    } catch (error) {
      console.error('Dataset download failed:', error);
      throw new Error('Failed to download dataset');
    }
  }

  /**
   * Validate data integrity and authenticity
   */
  async validateDataIntegrity(
    datasetId: string,
    expectedHash: string
  ): Promise<{ valid: boolean; actualHash: string; provenanceVerified: boolean }> {
    try {
      // Get dataset from storage
      const dataset = await storageService.getDataset(datasetId);
      
      // Calculate actual hash
      const actualHash = ipfsService.calculateHash(Buffer.from(JSON.stringify(dataset.data)));
      
      // Verify against expected hash
      const valid = actualHash === expectedHash;
      
      // Verify provenance chain
      const provenanceChain = await this.generateProvenanceChain(datasetId);
      const provenanceVerified = provenanceChain.verified;

      return {
        valid,
        actualHash,
        provenanceVerified
      };

    } catch (error) {
      console.error('Data integrity validation failed:', error);
      return {
        valid: false,
        actualHash: '',
        provenanceVerified: false
      };
    }
  }

  /**
   * Get dataset provenance chain
   */
  async generateProvenanceChain(datasetId: string): Promise<ProvenanceChain> {
    try {
      // This would query blockchain events and IPFS history
      // For MVP, generate a basic provenance chain
      const chain: ProvenanceLink[] = [
        {
          hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          timestamp: Date.now() - 86400000, // 1 day ago
          action: 'created',
          actor: '0xContributor...',
          metadata: { source: 'original_creation' }
        },
        {
          hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          timestamp: Date.now() - 43200000, // 12 hours ago
          action: 'verified',
          actor: '0xValidator...',
          metadata: { qualityScore: 85, verified: true }
        },
        {
          hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          timestamp: Date.now(),
          action: 'accessed',
          actor: '0xAIModel...',
          metadata: { accessType: 'query_download' }
        }
      ];

      return {
        datasetId,
        chain,
        verified: true
      };

    } catch (error) {
      console.error('Provenance chain generation failed:', error);
      return {
        datasetId,
        chain: [],
        verified: false
      };
    }
  }

  /**
   * Generate recommendations based on query patterns
   */
  private generateRecommendations(query: AIQuery, results: Dataset[]): string[] {
    const recommendations: string[] = [];

    // Analyze query patterns and results
    if (results.length === 0) {
      recommendations.push("Try broadening your search terms or reducing quality score requirements");
      recommendations.push("Consider exploring related tags or different data formats");
    } else if (results.length < 5) {
      recommendations.push("Limited results found. You might also be interested in related datasets");
      recommendations.push("Consider setting up alerts for new datasets matching your criteria");
    } else {
      recommendations.push("Multiple relevant datasets found. Consider filtering by recency or quality score");
      recommendations.push("Bundle multiple complementary datasets for comprehensive analysis");
    }

    // Add format-specific recommendations
    if (query.format) {
      recommendations.push(`Datasets in ${query.format} format are available for immediate use`);
    }

    return recommendations;
  }

  /**
   * Verify payment proof from smart contract
   */
  private async verifyPayment(
    datasetId: string,
    requesterAddress: string,
    paymentProof: string
  ): Promise<boolean> {
    try {
      // This would verify the payment transaction on the blockchain
      // For MVP, simulate payment verification
      return paymentProof.length > 0 && requesterAddress.length > 0;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  /**
   * Generate secure download URL with time-limited access
   */
  private async generateSecureDownloadUrl(
    datasetId: string,
    accessKey: string
  ): Promise<string> {
    try {
      // This would generate a signed URL for secure access
      // For MVP, return a placeholder URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      return `${baseUrl}/api/download/${datasetId}?access_key=${accessKey}`;
    } catch (error) {
      console.error('Secure URL generation failed:', error);
      throw new Error('Failed to generate download URL');
    }
  }

  /**
   * Get AI usage statistics
   */
  async getUsageStats(requesterAddress: string): Promise<{
    totalQueries: number;
    totalDownloads: number;
    datasetsAccessed: string[];
    averageQueryTime: number;
    preferredFormats: string[];
  }> {
    try {
      // This would query usage data from storage/blockchain
      // For MVP, return simulated stats
      return {
        totalQueries: Math.floor(Math.random() * 100),
        totalDownloads: Math.floor(Math.random() * 50),
        datasetsAccessed: [`dataset_${Date.now()}`],
        averageQueryTime: Math.floor(Math.random() * 1000) + 100,
        preferredFormats: ['json', 'csv', 'parquet']
      };
    } catch (error) {
      console.error('Usage stats retrieval failed:', error);
      throw new Error('Failed to get usage statistics');
    }
  }

  /**
   * Clear expired access tokens
   */
  cleanupExpiredTokens(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    this.accessTokens.forEach((access, key) => {
      if (now > access.validUntil) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.accessTokens.delete(key));
  }
}

export const aiInterface = new AIInterface();

// Cleanup expired tokens every hour
setInterval(() => {
  aiInterface.cleanupExpiredTokens();
}, 60 * 60 * 1000);