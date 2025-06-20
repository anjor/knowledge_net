import { NextApiRequest, NextApiResponse } from 'next';
import { aiInterface } from '../../../../api/ai-interface';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { datasetId } = req.query;

    if (!datasetId) {
      return res.status(400).json({ error: 'Dataset ID required' });
    }

    const provenanceChain = await aiInterface.generateProvenanceChain(datasetId as string);

    res.status(200).json(provenanceChain);
  } catch (error) {
    console.error('Provenance API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}