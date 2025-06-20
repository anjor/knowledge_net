import { NextApiRequest, NextApiResponse } from 'next';
import { aiInterface } from '../../../../api/ai-interface';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const requesterAddress = req.headers['x-requester-address'] as string;
    if (!requesterAddress) {
      return res.status(400).json({ error: 'Requester address required' });
    }

    const { datasetId } = req.query;
    const { access_key } = req.query;

    if (!datasetId || !access_key) {
      return res.status(400).json({ error: 'Dataset ID and access key required' });
    }

    const downloadData = await aiInterface.downloadDataset(
      access_key as string,
      requesterAddress
    );

    res.status(200).json(downloadData);
  } catch (error) {
    console.error('Dataset download API error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}