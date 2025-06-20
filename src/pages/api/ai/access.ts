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

    const { datasetId, paymentProof } = req.body;

    if (!datasetId || !paymentProof) {
      return res.status(400).json({ error: 'Dataset ID and payment proof required' });
    }

    const accessData = await aiInterface.requestDatasetAccess(
      datasetId,
      requesterAddress,
      paymentProof
    );

    res.status(200).json(accessData);
  } catch (error) {
    console.error('Dataset access API error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}