import { NextApiRequest, NextApiResponse } from 'next';
import { storageService } from '../../../utils/storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Dataset ID required' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const dataset = await storageService.getDataset(id);
        res.status(200).json(dataset);
      } catch (error) {
        console.error('Dataset retrieval API error:', error);
        res.status(404).json({ error: 'Dataset not found' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}