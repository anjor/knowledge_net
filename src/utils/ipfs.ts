import { create } from 'ipfs-http-client';

export interface DatasetMetadata {
  name: string;
  description: string;
  tags: string[];
  format: string;
  size: number;
  checksum: string;
  license: string;
  contributor: string;
  timestamp: number;
}

export interface StorageResult {
  ipfsHash: string;
  size: number;
  filecoinDealId?: string;
}

class IPFSService {
  private client;

  constructor() {
    this.client = create({
      url: process.env.IPFS_API_URL || 'https://ipfs.infura.io:5001'
    });
  }

  /**
   * Upload dataset to IPFS with metadata
   */
  async uploadDataset(
    data: File | Buffer, 
    metadata: DatasetMetadata
  ): Promise<StorageResult> {
    try {
      // Create dataset package with metadata
      const packageData = {
        metadata,
        data: data instanceof File ? await this.fileToBuffer(data) : data
      };

      // Add to IPFS
      const result = await this.client.add(JSON.stringify(packageData), {
        pin: true,
        cidVersion: 1
      });

      return {
        ipfsHash: result.cid.toString(),
        size: result.size
      };
    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw new Error('Failed to upload dataset to IPFS');
    }
  }

  /**
   * Retrieve dataset from IPFS
   */
  async getDataset(ipfsHash: string): Promise<any> {
    try {
      const chunks = [];
      for await (const chunk of this.client.cat(ipfsHash)) {
        chunks.push(chunk);
      }
      
      const data = Buffer.concat(chunks);
      return JSON.parse(data.toString());
    } catch (error) {
      console.error('IPFS retrieval failed:', error);
      throw new Error('Failed to retrieve dataset from IPFS');
    }
  }

  /**
   * Pin dataset to ensure availability
   */
  async pinDataset(ipfsHash: string): Promise<boolean> {
    try {
      await this.client.pin.add(ipfsHash);
      return true;
    } catch (error) {
      console.error('IPFS pinning failed:', error);
      return false;
    }
  }

  /**
   * Search datasets by metadata tags
   */
  async searchDatasets(tags: string[]): Promise<string[]> {
    // This would typically integrate with a decentralized indexing service
    // For MVP, we'll implement a basic search mechanism
    try {
      // Placeholder for search implementation
      // In production, this would query a decentralized index
      return [];
    } catch (error) {
      console.error('Dataset search failed:', error);
      return [];
    }
  }

  private async fileToBuffer(file: File): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        resolve(Buffer.from(arrayBuffer));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Calculate content hash for verification
   */
  calculateHash(data: Buffer): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Validate dataset integrity
   */
  async validateDataset(ipfsHash: string, expectedHash: string): Promise<boolean> {
    try {
      const dataset = await this.getDataset(ipfsHash);
      const actualHash = this.calculateHash(Buffer.from(JSON.stringify(dataset.data)));
      return actualHash === expectedHash;
    } catch (error) {
      console.error('Dataset validation failed:', error);
      return false;
    }
  }
}

export const ipfsService = new IPFSService();