import { NextApiRequest, NextApiResponse } from 'next';
import { aiInterface } from '../../../api/ai-interface';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { datasetId, expectedHash } = req.body;

    if (!datasetId || !expectedHash) {
      return res.status(400).json({ error: 'Dataset ID and expected hash required' });
    }

    const validationResult = await aiInterface.validateDataIntegrity(
      datasetId,
      expectedHash
    );

    res.status(200).json(validationResult);
  } catch (error) {
    console.error('Data validation API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}