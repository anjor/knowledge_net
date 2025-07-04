import type { NextApiRequest, NextApiResponse } from 'next';
import { web3Service } from '../../../utils/web3';

interface DatasetSearchRequest {
  tags?: string[];
  format?: string;
  minQualityScore?: number;
  maxPrice?: string;
  verified?: boolean;
  limit?: number;
  offset?: number;
}

interface DatasetSearchResponse {
  success: boolean;
  datasets?: any[];
  total?: number;
  error?: string;
  metadata?: {
    page: number;
    limit: number;
    total_pages: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DatasetSearchResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.'
    });
  }

  try {
    const {
      tags,
      format,
      minQualityScore = 0,
      maxPrice,
      verified,
      limit = 10,
      offset = 0
    }: DatasetSearchRequest = req.query as any;

    // Parse arrays from query strings
    const tagsArray = tags ? (Array.isArray(tags) ? tags : [tags]) : [];
    const qualityThreshold = Number(minQualityScore);
    const limitNum = Number(limit);
    const offsetNum = Number(offset);

    // For demo purposes, return sample datasets that match the search criteria
    // In production, this would query the smart contract for all dataset IDs
    // and fetch their metadata from IPFS
    const sampleDatasets = [
      {
        id: 'dataset_001',
        metadata: {
          name: 'Medical Image Dataset',
          description: 'Curated collection of medical imaging data for AI training',
          tags: ['medical', 'imaging', 'ai-training'],
          format: 'json',
          size: 1024000,
          license: 'CC-BY-4.0'
        },
        ipfsHash: 'QmExample1...',
        contributor: '0x40696c3503CD8248da4b0bF9d02432Dc22ec274A',
        price: '0.05',
        downloadCount: 156,
        qualityScore: 92,
        verified: true,
        timestamp: Date.now() - 86400000
      },
      {
        id: 'dataset_002',
        metadata: {
          name: 'Climate Data Collection',
          description: 'Global climate measurements and predictions',
          tags: ['climate', 'environmental', 'science'],
          format: 'csv',
          size: 2048000,
          license: 'Open Data'
        },
        ipfsHash: 'QmExample2...',
        contributor: '0x40696c3503CD8248da4b0bF9d02432Dc22ec274A',
        price: '0.03',
        downloadCount: 89,
        qualityScore: 88,
        verified: true,
        timestamp: Date.now() - 172800000
      },
      {
        id: 'dataset_003',
        metadata: {
          name: 'Financial Market Data',
          description: 'Real-time and historical financial market data',
          tags: ['finance', 'trading', 'time-series'],
          format: 'parquet',
          size: 512000,
          license: 'Commercial'
        },
        ipfsHash: 'QmExample3...',
        contributor: '0x40696c3503CD8248da4b0bF9d02432Dc22ec274A',
        price: '0.1',
        downloadCount: 234,
        qualityScore: 95,
        verified: true,
        timestamp: Date.now() - 43200000
      }
    ];

    // Apply filters
    const filteredDatasets = sampleDatasets.filter(dataset => {
      // Tag filter
      if (tagsArray.length > 0) {
        const hasMatchingTag = tagsArray.some(tag => 
          dataset.metadata.tags.includes(tag.toLowerCase())
        );
        if (!hasMatchingTag) return false;
      }

      // Format filter
      if (format && dataset.metadata.format.toLowerCase() !== format.toLowerCase()) {
        return false;
      }

      // Quality score filter
      if (dataset.qualityScore < qualityThreshold) {
        return false;
      }

      // Price filter
      if (maxPrice && parseFloat(dataset.price) > parseFloat(maxPrice)) {
        return false;
      }

      // Verified filter
      if (verified !== undefined && dataset.verified !== verified) {
        return false;
      }

      return true;
    });

    // Apply pagination
    const paginatedDatasets = filteredDatasets.slice(offsetNum, offsetNum + limitNum);

    // Calculate metadata
    const totalPages = Math.ceil(filteredDatasets.length / limitNum);
    const currentPage = Math.floor(offsetNum / limitNum) + 1;

    return res.status(200).json({
      success: true,
      datasets: paginatedDatasets,
      total: filteredDatasets.length,
      metadata: {
        page: currentPage,
        limit: limitNum,
        total_pages: totalPages
      }
    });

  } catch (error: any) {
    console.error('Dataset search error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}