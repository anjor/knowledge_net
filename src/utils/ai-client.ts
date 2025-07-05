/**
 * KnowledgeNet AI Client SDK
 * Easy integration for AI models to access the decentralized marketplace
 */

export interface KnowledgeNetConfig {
  baseUrl: string;
  requesterAddress: string;
  apiKey?: string;
}

export interface QueryOptions {
  searchTerms: string;
  tags?: string[];
  format?: string;
  minQualityScore?: number;
  maxPrice?: string;
  limit?: number;
}

export interface PurchaseOptions {
  datasetId: string;
  paymentProof: string;
}

export class KnowledgeNetClient {
  private config: KnowledgeNetConfig;

  constructor(config: KnowledgeNetConfig) {
    this.config = config;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'x-requester-address': this.config.requesterAddress,
      ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`API Error: ${error.error || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Query datasets for AI training/inference
   */
  async queryDatasets(options: QueryOptions) {
    return this.makeRequest('/api/ai/query', {
      method: 'POST',
      body: JSON.stringify(options)
    });
  }

  /**
   * Purchase access to a dataset
   */
  async purchaseAccess(options: PurchaseOptions) {
    return this.makeRequest('/api/ai/access', {
      method: 'POST',
      body: JSON.stringify(options)
    });
  }

  /**
   * Download dataset with access key
   */
  async downloadDataset(datasetId: string, accessKey: string) {
    return this.makeRequest(
      `/api/ai/download/${datasetId}?access_key=${accessKey}`
    );
  }

  /**
   * Validate data integrity
   */
  async validateDataset(datasetId: string, expectedHash: string) {
    return this.makeRequest('/api/ai/validate', {
      method: 'POST',
      body: JSON.stringify({ datasetId, expectedHash })
    });
  }

  /**
   * Get dataset provenance chain
   */
  async getProvenance(datasetId: string) {
    return this.makeRequest(`/api/ai/provenance/${datasetId}`);
  }

  /**
   * Get usage statistics
   */
  async getUsageStats() {
    return this.makeRequest('/api/ai/stats');
  }

  /**
   * Get storage cost estimate
   */
  async estimateStorageCost(size: number, duration: number) {
    return this.makeRequest('/api/storage/estimate', {
      method: 'POST',
      body: JSON.stringify({ size, duration })
    });
  }

  /**
   * Upload new dataset
   */
  async uploadDataset(data: ArrayBuffer, metadata: any, options?: any) {
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(data)));
    
    return this.makeRequest('/api/datasets/upload', {
      method: 'POST',
      body: JSON.stringify({
        data: base64Data,
        metadata: {
          ...metadata,
          contributor: this.config.requesterAddress,
          timestamp: Date.now()
        },
        options
      })
    });
  }

  /**
   * Get dataset by ID
   */
  async getDataset(datasetId: string) {
    return this.makeRequest(`/api/datasets/${datasetId}`);
  }

  /**
   * Convenience method for complete workflow
   */
  async findAndDownloadDataset(query: QueryOptions): Promise<{
    queryResults: any;
    selectedDataset?: any;
    downloadData?: any;
  }> {
    try {
      // Step 1: Query datasets
      const queryResults = await this.queryDatasets(query);
      
      if (queryResults.datasets.length === 0) {
        return { queryResults };
      }

      // Step 2: Select best dataset (first one for demo)
      const selectedDataset = queryResults.datasets[0];
      
      console.log(`Found ${queryResults.datasets.length} datasets. Selected: ${selectedDataset.id}`);
      
      return {
        queryResults,
        selectedDataset
      };

    } catch (error) {
      console.error('Workflow error:', error);
      throw error;
    }
  }
}

// Factory function for easy instantiation
export function createKnowledgeNetClient(config: KnowledgeNetConfig): KnowledgeNetClient {
  return new KnowledgeNetClient(config);
}

