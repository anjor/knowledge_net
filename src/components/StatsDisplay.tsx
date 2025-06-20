import React, { useState, useEffect } from 'react';

interface MarketplaceStats {
  totalDatasets: number;
  totalValidators: number;
  totalDownloads: number;
  totalEarnings: string;
  verifiedDatasets: number;
  avgQualityScore: number;
}

export const StatsDisplay: React.FC = () => {
  const [stats, setStats] = useState<MarketplaceStats>({
    totalDatasets: 0,
    totalValidators: 0,
    totalDownloads: 0,
    totalEarnings: '0',
    verifiedDatasets: 0,
    avgQualityScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from the smart contract
      // For demo, simulate realistic stats
      const simulatedStats: MarketplaceStats = {
        totalDatasets: 1247,
        totalValidators: 89,
        totalDownloads: 15623,
        totalEarnings: '2847.32',
        verifiedDatasets: 1156,
        avgQualityScore: 87
      };

      // Animate the numbers counting up
      await animateStats(simulatedStats);
      
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateStats = async (targetStats: MarketplaceStats) => {
    const duration = 2000; // 2 seconds
    const steps = 50;
    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setStats({
        totalDatasets: Math.floor(targetStats.totalDatasets * easeProgress),
        totalValidators: Math.floor(targetStats.totalValidators * easeProgress),
        totalDownloads: Math.floor(targetStats.totalDownloads * easeProgress),
        totalEarnings: (parseFloat(targetStats.totalEarnings) * easeProgress).toFixed(2),
        verifiedDatasets: Math.floor(targetStats.verifiedDatasets * easeProgress),
        avgQualityScore: Math.floor(targetStats.avgQualityScore * easeProgress)
      });

      if (i < steps) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
      }
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const verificationRate = stats.totalDatasets > 0 
    ? Math.round((stats.verifiedDatasets / stats.totalDatasets) * 100)
    : 0;

  const statsItems = [
    {
      label: 'Total Datasets',
      value: formatNumber(stats.totalDatasets),
      subtext: `${verificationRate}% verified`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Active Validators',
      value: stats.totalValidators.toString(),
      subtext: 'Maintaining quality',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Total Downloads',
      value: formatNumber(stats.totalDownloads),
      subtext: 'Data accesses',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Total Earnings',
      value: `${stats.totalEarnings} FIL`,
      subtext: 'Distributed to contributors',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${item.bgColor} ${item.color} mr-4`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500">{item.subtext}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Additional Quality Metrics */}
      <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.avgQualityScore}%</div>
                <div className="text-sm text-gray-600">Average Quality Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{verificationRate}%</div>
                <div className="text-sm text-gray-600">Verification Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalDatasets > 0 ? Math.round(stats.totalDownloads / stats.totalDatasets) : 0}
                </div>
                <div className="text-sm text-gray-600">Avg Downloads/Dataset</div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};