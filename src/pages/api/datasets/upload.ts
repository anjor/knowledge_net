import { NextApiRequest, NextApiResponse } from 'next';
import { storageService } from '../../../utils/storage';
import { DatasetMetadata } from '../../../utils/ipfs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, metadata, options } = req.body;

    if (!data || !metadata) {
      return res.status(400).json({ error: 'Data and metadata required' });
    }

    // Convert base64 data to buffer
    const dataBuffer = Buffer.from(data, 'base64');

    const datasetMetadata: DatasetMetadata = {
      name: metadata.name,
      description: metadata.description,
      tags: metadata.tags || [],
      format: metadata.format,
      size: dataBuffer.length,
      checksum: metadata.checksum,
      license: metadata.license || 'MIT',
      contributor: metadata.contributor,
      timestamp: Date.now()
    };

    const dataset = await storageService.uploadDataset(dataBuffer, datasetMetadata, options);

    res.status(200).json(dataset);
  } catch (error) {
    console.error('Dataset upload API error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}