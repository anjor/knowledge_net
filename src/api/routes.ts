import { NextApiRequest, NextApiResponse } from 'next';
import { aiInterface, AIQuery, AIResponse } from './ai-interface';
import { storageService, Dataset } from '../utils/storage';

// API route handlers for AI interface

/**
 * POST /api/ai/query - Query datasets for AI models
 */
export async function handleAIQuery(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { searchTerms, tags, format, minQualityScore, maxPrice, limit } = req.body;
    const requesterAddress = req.headers['x-requester-address'] as string;

    if (!requesterAddress) {
      return res.status(400).json({ error: 'Requester address required' });
    }

    if (!searchTerms) {
      return res.status(400).json({ error: 'Search terms required' });
    }

    const response = await aiInterface.queryDatasets({
      searchTerms,
      tags,
      format,
      minQualityScore,
      maxPrice,
      limit
    }, requesterAddress);

    res.status(200).json(response);

  } catch (error) {
    console.error('AI query error:', error);
    res.status(500).json({ error: 'Query failed' });
  }
}

/**
 * POST /api/ai/access - Request access to a dataset
 */
export async function handleAccessRequest(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { datasetId, paymentProof } = req.body;
    const requesterAddress = req.headers['x-requester-address'] as string;

    if (!requesterAddress || !datasetId || !paymentProof) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const access = await aiInterface.requestDatasetAccess(
      datasetId,
      requesterAddress,
      paymentProof
    );

    res.status(200).json(access);

  } catch (error) {
    console.error('Access request error:', error);
    res.status(500).json({ error: 'Access request failed' });
  }
}

/**
 * GET /api/ai/download/:datasetId - Download dataset with access token
 */
export async function handleDatasetDownload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { access_key } = req.query;
    const requesterAddress = req.headers['x-requester-address'] as string;

    if (!access_key || !requesterAddress) {
      return res.status(400).json({ error: 'Access key and requester address required' });
    }

    const downloadData = await aiInterface.downloadDataset(
      access_key as string,
      requesterAddress
    );

    res.status(200).json(downloadData);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
}

/**
 * POST /api/ai/validate - Validate data integrity
 */
export async function handleDataValidation(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { datasetId, expectedHash } = req.body;

    if (!datasetId || !expectedHash) {
      return res.status(400).json({ error: 'Dataset ID and expected hash required' });
    }

    const validation = await aiInterface.validateDataIntegrity(datasetId, expectedHash);

    res.status(200).json(validation);

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: 'Validation failed' });
  }
}

/**
 * GET /api/ai/provenance/:datasetId - Get dataset provenance chain
 */
export async function handleProvenanceQuery(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { datasetId } = req.query;

    if (!datasetId) {
      return res.status(400).json({ error: 'Dataset ID required' });
    }

    const provenance = await aiInterface.generateProvenanceChain(datasetId as string);

    res.status(200).json(provenance);

  } catch (error) {
    console.error('Provenance query error:', error);
    res.status(500).json({ error: 'Provenance query failed' });
  }
}

/**
 * GET /api/ai/stats - Get AI usage statistics
 */
export async function handleStatsQuery(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const requesterAddress = req.headers['x-requester-address'] as string;

    if (!requesterAddress) {
      return res.status(400).json({ error: 'Requester address required' });
    }

    const stats = await aiInterface.getUsageStats(requesterAddress);

    res.status(200).json(stats);

  } catch (error) {
    console.error('Stats query error:', error);
    res.status(500).json({ error: 'Stats query failed' });
  }
}

// Marketplace API handlers

/**
 * POST /api/datasets/upload - Upload a new dataset
 */
export async function handleDatasetUpload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { metadata, data, options } = req.body;

    if (!metadata || !data) {
      return res.status(400).json({ error: 'Metadata and data required' });
    }

    // Convert base64 data to buffer if needed
    const dataBuffer = Buffer.from(data, 'base64');

    const dataset = await storageService.uploadDataset(dataBuffer, metadata, options);

    res.status(200).json(dataset);

  } catch (error) {
    console.error('Dataset upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}

/**
 * GET /api/datasets/search - Search datasets
 */
export async function handleDatasetSearch(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tags, format, minQualityScore, verified } = req.query;

    const searchCriteria: any = {};
    
    if (tags) {
      searchCriteria.tags = (tags as string).split(',');
    }
    if (format) {
      searchCriteria.format = format as string;
    }
    if (minQualityScore) {
      searchCriteria.minQualityScore = parseInt(minQualityScore as string);
    }
    if (verified !== undefined) {
      searchCriteria.verified = verified === 'true';
    }

    const datasets = await storageService.searchDatasets(searchCriteria);

    res.status(200).json({ datasets, total: datasets.length });

  } catch (error) {
    console.error('Dataset search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}

/**
 * GET /api/datasets/:id/stats - Get dataset statistics
 */
export async function handleDatasetStats(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Dataset ID required' });
    }

    const stats = await storageService.getDatasetStats(id as string);

    res.status(200).json(stats);

  } catch (error) {
    console.error('Dataset stats error:', error);
    res.status(500).json({ error: 'Stats retrieval failed' });
  }
}

/**
 * POST /api/storage/estimate - Estimate storage costs
 */
export async function handleStorageCostEstimate(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { size, duration } = req.body;

    if (!size || !duration) {
      return res.status(400).json({ error: 'Size and duration required' });
    }

    const estimate = await storageService.estimateStorageCost(
      parseInt(size),
      parseInt(duration)
    );

    res.status(200).json(estimate);

  } catch (error) {
    console.error('Storage cost estimation error:', error);
    res.status(500).json({ error: 'Cost estimation failed' });
  }
}