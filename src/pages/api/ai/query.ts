import { NextApiRequest, NextApiResponse } from 'next';
import { aiInterface } from '../../../api/ai-interface';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const requesterAddress = req.headers['x-requester-address'] as string;
    if (!requesterAddress) {
      return res.status(400).json({ error: 'Requester address required' });
    }

    const { searchTerms, tags, format, minQualityScore, maxPrice, limit } = req.body;

    if (!searchTerms) {
      return res.status(400).json({ error: 'Search terms required' });
    }

    const result = await aiInterface.queryDatasets({
      searchTerms,
      tags,
      format,
      minQualityScore,
      maxPrice,
      limit
    }, requesterAddress);

    res.status(200).json(result);
  } catch (error) {
    console.error('AI query API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}