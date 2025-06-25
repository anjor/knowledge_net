import type { NextApiRequest, NextApiResponse } from 'next';
import { web3Service } from '../../../utils/web3';

interface AccessRequest {
  datasetId: string;
  userAddress: string;
  duration?: number; // Access duration in days
}

interface AccessResponse {
  success: boolean;
  accessToken?: string;
  expiresAt?: number;
  cost?: string;
  error?: string;
  transactionHash?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AccessResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { datasetId, userAddress, duration = 30 }: AccessRequest = req.body;

    // Validate required fields
    if (!datasetId || !userAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: datasetId and userAddress'
      });
    }

    // Check if user already has access
    const hasAccess = await web3Service.hasAccess(datasetId, userAddress);
    
    if (hasAccess) {
      return res.status(200).json({
        success: true,
        accessToken: generateAccessToken(datasetId, userAddress),
        expiresAt: Date.now() + (duration * 24 * 60 * 60 * 1000),
        cost: '0.00'
      });
    }

    // Get dataset information
    const dataset = await web3Service.getDataset(datasetId);
    
    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found'
      });
    }

    // For demo purposes, simulate the purchase process
    // In production, this would handle the actual blockchain transaction
    const cost = web3Service.formatPrice(dataset.price);
    
    // Generate access token for this user
    const accessToken = generateAccessToken(datasetId, userAddress);
    const expiresAt = Date.now() + (duration * 24 * 60 * 60 * 1000);

    // Store access information (in production, this would be in a database)
    // For demo, we'll just return the token
    
    return res.status(200).json({
      success: true,
      accessToken,
      expiresAt,
      cost,
      transactionHash: '0x' + Math.random().toString(16).substring(2) // Mock transaction hash
    });

  } catch (error: any) {
    console.error('Access request error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

function generateAccessToken(datasetId: string, userAddress: string): string {
  // In production, this would be a proper JWT or secure token
  const payload = {
    datasetId,
    userAddress,
    timestamp: Date.now(),
    nonce: Math.random().toString(36).substring(2)
  };
  
  // Simple base64 encoding for demo (use proper JWT in production)
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}