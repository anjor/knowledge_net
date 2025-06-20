import { NextApiRequest, NextApiResponse } from 'next';
import { aiInterface } from '../../../api/ai-interface';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    console.error('Usage stats API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}