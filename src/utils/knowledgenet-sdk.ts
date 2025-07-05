/**
 * KnowledgeNet SDK for AI Developers
 * 
 * This SDK provides easy access to verified scientific datasets
 * stored on Filecoin through the KnowledgeNet marketplace.
 */

export interface DatasetMetadata {
  name: string;
  description: string;
  tags: string[];
  format: string;
  size: number;
  license: string;
}

export interface Dataset {
  id: string;
  metadata: DatasetMetadata;
  ipfsHash: string;
  contributor: string;
  price: string;
  downloadCount: number;
  qualityScore: number;
  verified: boolean;
  timestamp: number;
}

export interface QueryResult {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    tokensUsed: number;
    cost: string;
  };
  provenance?: {
    datasetId: string;
    ipfsHash: string;
    contributor: string;
    verified: boolean;
    timestamp: number;
  };
}

export interface SearchOptions {
  tags?: string[];
  format?: string;
  minQualityScore?: number;
  maxPrice?: string;
  verified?: boolean;
  limit?: number;
  offset?: number;
}

export class KnowledgeNetSDK {
  private baseUrl: string;
  private userAddress: string;

  constructor(config: {
    baseUrl?: string;
    userAddress: string;
  }) {
    this.baseUrl = config.baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    this.userAddress = config.userAddress;
  }

  /**
   * Search for datasets matching specific criteria
   */
  async searchDatasets(options: SearchOptions = {}): Promise<{
    datasets: Dataset[];
    total: number;
    metadata: {
      page: number;
      limit: number;
      total_pages: number;
    };
  }> {
    const searchParams = new URLSearchParams();
    
    if (options.tags?.length) {
      options.tags.forEach(tag => searchParams.append('tags', tag));
    }
    if (options.format) searchParams.set('format', options.format);
    if (options.minQualityScore) searchParams.set('minQualityScore', options.minQualityScore.toString());
    if (options.maxPrice) searchParams.set('maxPrice', options.maxPrice);
    if (options.verified !== undefined) searchParams.set('verified', options.verified.toString());
    if (options.limit) searchParams.set('limit', options.limit.toString());
    if (options.offset) searchParams.set('offset', options.offset.toString());

    // Add cache buster for development
    searchParams.set('_t', Date.now().toString());

    const response = await fetch(`${this.baseUrl}/api/ai-interface/datasets?${searchParams}`, {
      headers: {
        'x-requester-address': this.userAddress,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Search failed');
    }

    return {
      datasets: result.datasets,
      total: result.total,
      metadata: result.metadata
    };
  }

  /**
   * Query a specific dataset with an AI prompt
   */
  async queryDataset(datasetId: string, query: string): Promise<QueryResult> {
    const response = await fetch(`${this.baseUrl}/api/ai-interface/query`, {
      method: 'POST',
      headers: {
        'x-requester-address': this.userAddress,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        datasetId,
        query,
        userId: this.userAddress
      })
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || `Query failed: ${response.statusText}`);
    }

    return result;
  }

  /**
   * Get access to a dataset (purchase if needed)
   */
  async getDatasetAccess(datasetId: string, duration: number = 30): Promise<{
    accessToken: string;
    expiresAt: number;
    cost: string;
    transactionHash?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/api/ai-interface/access`, {
      method: 'POST',
      headers: {
        'x-requester-address': this.userAddress,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        datasetId,
        userAddress: this.userAddress,
        duration
      })
    });

    if (!response.ok) {
      throw new Error(`Access request failed: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Access request failed');
    }

    return {
      accessToken: result.accessToken,
      expiresAt: result.expiresAt,
      cost: result.cost,
      transactionHash: result.transactionHash
    };
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(timeRange: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{
    totalQueries: number;
    totalCost: string;
    datasetAccess: number;
    avgResponseTime: number;
    topDatasets: Array<{
      datasetId: string;
      name: string;
      queries: number;
      cost: string;
    }>;
    timeline: Array<{
      date: string;
      queries: number;
      cost: string;
    }>;
  }> {
    const searchParams = new URLSearchParams({
      timeRange,
      userAddress: this.userAddress
    });

    const response = await fetch(`${this.baseUrl}/api/ai-interface/usage?${searchParams}`, {
      headers: {
        'x-requester-address': this.userAddress,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Usage request failed: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Usage request failed');
    }

    return result.usage;
  }

  /**
   * Helper method to find datasets by tag
   */
  async findDatasetsByTag(tag: string, limit: number = 10): Promise<Dataset[]> {
    const result = await this.searchDatasets({
      tags: [tag],
      limit,
      verified: true
    });
    return result.datasets;
  }

  /**
   * Helper method to find high-quality datasets
   */
  async findHighQualityDatasets(minScore: number = 90, limit: number = 10): Promise<Dataset[]> {
    const result = await this.searchDatasets({
      minQualityScore: minScore,
      limit,
      verified: true
    });
    return result.datasets;
  }

  /**
   * Helper method to get affordable datasets
   */
  async findAffordableDatasets(maxPrice: string = '0.1', limit: number = 10): Promise<Dataset[]> {
    const result = await this.searchDatasets({
      maxPrice,
      limit,
      verified: true
    });
    return result.datasets;
  }
}

// Export convenience factory function
export function createKnowledgeNetClient(config: {
  baseUrl?: string;
  userAddress: string;
}): KnowledgeNetSDK {
  return new KnowledgeNetSDK(config);
}

// Example usage:
/*
const client = createKnowledgeNetClient({
  userAddress: '0xYourWalletAddress'
});

// Search for medical datasets
const medicalDatasets = await client.findDatasetsByTag('medical');

// Query a specific dataset
const result = await client.queryDataset('dataset_001', 'Find anomalies in the imaging data');

// Get usage statistics
const stats = await client.getUsageStats('month');
*/