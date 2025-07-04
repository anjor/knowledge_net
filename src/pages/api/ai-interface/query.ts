import type { NextApiRequest, NextApiResponse } from 'next';
import { web3Service } from '../../../utils/web3';

interface QueryRequest {
  datasetId: string;
  query: string;
  apiKey?: string;
  userId?: string;
}

interface QueryResponse {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QueryResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { datasetId, query, apiKey, userId }: QueryRequest = req.body;

    // Validate required fields
    if (!datasetId || !query) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: datasetId and query'
      });
    }

    // In production, validate API key and user access
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key required for data access'
      });
    }

    // Check if user has access to this dataset (via smart contract)
    // For demo purposes, allow access for presentation smoothness if contract fails
    let hasAccess = true;
    try {
      if (userId) {
        hasAccess = await web3Service.hasAccess(datasetId, userId);
        console.log(`Smart contract access check for user ${userId} on dataset ${datasetId}: ${hasAccess}`);
      }
    } catch (error) {
      console.warn('Smart contract access check failed, allowing for demo:', error);
      hasAccess = true; // Allow access for demo purposes
    }
    
    if (!hasAccess && userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Purchase dataset access first.'
      });
    }

    // Get dataset information for provenance
    let dataset;
    try {
      dataset = await web3Service.getDataset(datasetId);
    } catch (error) {
      console.warn('Smart contract dataset fetch failed, using mock data:', error);
      // Use mock dataset for demo
      dataset = {
        id: datasetId,
        ipfsHash: 'QmExample' + datasetId.slice(-3) + 'Hash123...',
        contributor: '0x40696c3503CD8248da4b0bF9d02432Dc22ec274A',
        verified: true,
        metadata: JSON.stringify({
          name: getDatasetName(datasetId),
          tags: getDatasetTags(datasetId),
          format: 'json',
          size: 1024000,
          license: 'CC-BY-4.0'
        })
      };
    }
    
    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found'
      });
    }

    // Parse metadata
    let metadata;
    try {
      metadata = typeof dataset.metadata === 'string' ? JSON.parse(dataset.metadata) : dataset.metadata;
    } catch (error) {
      console.warn('Failed to parse metadata, using fallback:', error);
      metadata = {
        name: getDatasetName(datasetId),
        tags: getDatasetTags(datasetId),
        format: 'json',
        size: 1024000
      };
    }

    // Simulate AI data processing
    const processedData = await processAIQuery(dataset.ipfsHash, query, metadata);

    // Calculate usage cost (simplified pricing model)
    const usage = {
      tokensUsed: query.length * 2, // Simple token estimation
      cost: '0.001' // 0.001 FIL per query
    };

    // Build provenance information
    const provenance = {
      datasetId,
      ipfsHash: dataset.ipfsHash,
      contributor: dataset.contributor,
      verified: dataset.verified,
      timestamp: Date.now()
    };

    return res.status(200).json({
      success: true,
      data: processedData,
      usage,
      provenance
    });

  } catch (error: any) {
    console.error('AI query error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

async function processAIQuery(ipfsHash: string, query: string, metadata: any): Promise<any> {
  // Simulate AI processing of the data
  // In production, this would:
  // 1. Fetch data from IPFS using the hash
  // 2. Process the query against the dataset
  // 3. Return relevant results

  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time

  // Return mock processed data based on dataset type
  if (metadata.tags.includes('medical')) {
    return {
      type: 'medical_analysis',
      query,
      results: [
        {
          finding: 'Pattern detected in medical imaging data',
          confidence: 0.92,
          data_points: 156,
          source: ipfsHash
        }
      ],
      summary: `Analyzed medical dataset for: ${query}`,
      accuracy_metrics: {
        precision: 0.94,
        recall: 0.89,
        f1_score: 0.91
      }
    };
  } else if (metadata.tags.includes('climate')) {
    return {
      type: 'climate_analysis',
      query,
      results: [
        {
          measurement: 'Temperature trend analysis',
          value: 23.5,
          unit: 'celsius',
          trend: 'increasing',
          confidence: 0.87
        }
      ],
      summary: `Climate data analysis for: ${query}`,
      time_range: '2020-2024',
      geographic_scope: 'Global'
    };
  } else if (metadata.tags.includes('finance')) {
    return {
      type: 'financial_analysis',
      query,
      results: [
        {
          metric: 'Price correlation',
          value: 0.73,
          timeframe: '1Y',
          volatility: 0.24
        }
      ],
      summary: `Financial market analysis for: ${query}`,
      risk_metrics: {
        var_95: 0.023,
        sharpe_ratio: 1.42
      }
    };
  }

  // Generic response for other dataset types
  return {
    type: 'general_analysis',
    query,
    results: [
      {
        summary: `Processed query "${query}" against dataset`,
        data_points_analyzed: Math.floor(Math.random() * 1000) + 100,
        processing_time_ms: Math.floor(Math.random() * 500) + 200
      }
    ],
    metadata: {
      dataset_format: metadata.format,
      dataset_size: metadata.size,
      tags: metadata.tags
    }
  };
}

function getDatasetName(datasetId: string): string {
  const names: { [key: string]: string } = {
    'dataset_001': 'Medical Image Dataset',
    'dataset_002': 'Climate Data Collection', 
    'dataset_003': 'Financial Market Data'
  };
  return names[datasetId] || 'Unknown Dataset';
}

function getDatasetTags(datasetId: string): string[] {
  const tags: { [key: string]: string[] } = {
    'dataset_001': ['medical', 'imaging', 'ai-training'],
    'dataset_002': ['climate', 'environmental', 'science'],
    'dataset_003': ['finance', 'trading', 'time-series']
  };
  return tags[datasetId] || ['general'];
}