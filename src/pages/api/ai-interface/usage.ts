import type { NextApiRequest, NextApiResponse } from 'next';

interface UsageRequest {
  userAddress?: string;
  datasetId?: string;
  apiKey?: string;
  timeRange?: 'day' | 'week' | 'month' | 'year';
}

interface UsageResponse {
  success: boolean;
  usage?: {
    totalQueries: number;
    totalCost: string;
    datasetAccess: number;
    avgResponseTime: number;
    topDatasets: Array<{
      datasetId: string;
      name: string;
      queries: number;
      cost: string;
    }>;
    timeline: Array<{
      date: string;
      queries: number;
      cost: string;
    }>;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UsageResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.'
    });
  }

  try {
    const {
      userAddress,
      datasetId,
      apiKey,
      timeRange = 'month'
    }: UsageRequest = req.query as any;

    // In production, validate API key and user permissions
    if (!apiKey && !userAddress) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Generate mock usage data for demo
    const usage = generateMockUsage(timeRange, datasetId);

    return res.status(200).json({
      success: true,
      usage
    });

  } catch (error: any) {
    console.error('Usage tracking error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

function generateMockUsage(timeRange: string, datasetId?: string) {
  const now = new Date();
  const timeRanges = {
    day: 1,
    week: 7,
    month: 30,
    year: 365
  };

  const days = timeRanges[timeRange as keyof typeof timeRanges] || 30;
  const totalQueries = Math.floor(Math.random() * 1000) + 100;
  const totalCost = (totalQueries * 0.001).toFixed(3);

  // Generate timeline data
  const timeline = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dailyQueries = Math.floor(Math.random() * (totalQueries / days * 2));
    const dailyCost = (dailyQueries * 0.001).toFixed(3);
    
    timeline.push({
      date: date.toISOString().split('T')[0],
      queries: dailyQueries,
      cost: dailyCost
    });
  }

  // Generate top datasets
  const topDatasets = [
    {
      datasetId: 'dataset_001',
      name: 'Medical Image Dataset',
      queries: Math.floor(totalQueries * 0.4),
      cost: (totalQueries * 0.4 * 0.001).toFixed(3)
    },
    {
      datasetId: 'dataset_002',
      name: 'Climate Data Collection',
      queries: Math.floor(totalQueries * 0.35),
      cost: (totalQueries * 0.35 * 0.001).toFixed(3)
    },
    {
      datasetId: 'dataset_003',
      name: 'Financial Market Data',
      queries: Math.floor(totalQueries * 0.25),
      cost: (totalQueries * 0.25 * 0.001).toFixed(3)
    }
  ];

  return {
    totalQueries,
    totalCost,
    datasetAccess: datasetId ? 1 : 3,
    avgResponseTime: Math.floor(Math.random() * 500) + 200, // ms
    topDatasets: datasetId 
      ? topDatasets.filter(d => d.datasetId === datasetId)
      : topDatasets,
    timeline
  };
}