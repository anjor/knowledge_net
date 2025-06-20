import { NextApiRequest, NextApiResponse } from 'next';
import { storageService } from '../../../utils/storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    console.error('Storage estimation API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}