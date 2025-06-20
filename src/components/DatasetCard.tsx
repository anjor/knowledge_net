import React, { useState } from 'react';
import { Dataset } from '../utils/storage';

interface DatasetCardProps {
  dataset: Dataset;
  onPurchase: (datasetId: string) => void;
  connectedWallet: string | null;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({ 
  dataset, 
  onPurchase, 
  connectedWallet 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!connectedWallet) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      onPurchase(dataset.id);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return Math.round(bytes / (1024 * 1024)) + ' MB';
    return Math.round(bytes / (1024 * 1024 * 1024)) + ' GB';
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const truncateDescription = (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const getQualityColor = (score: number): string => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {dataset.metadata.name}
            </h3>
            <p className="text-sm text-gray-500">
              by {dataset.metadata.contributor.slice(0, 6)}...{dataset.metadata.contributor.slice(-4)}
            </p>
          </div>
          {dataset.verified && (
            <div className="flex items-center text-green-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          {isExpanded ? dataset.metadata.description : truncateDescription(dataset.metadata.description)}
          {dataset.metadata.description.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {dataset.metadata.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {dataset.metadata.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{dataset.metadata.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Quality Score</span>
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ml-2 ${getQualityColor(dataset.qualityScore)}`}>
              {dataset.qualityScore}%
            </div>
          </div>
          <div>
            <span className="text-gray-500">Downloads</span>
            <span className="font-medium ml-2">{dataset.downloadCount}</span>
          </div>
          <div>
            <span className="text-gray-500">Size</span>
            <span className="font-medium ml-2">{formatFileSize(dataset.metadata.size)}</span>
          </div>
          <div>
            <span className="text-gray-500">Format</span>
            <span className="font-medium ml-2 uppercase">{dataset.metadata.format}</span>
          </div>
        </div>

        {/* License and Date */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
          <span>License: {dataset.metadata.license}</span>
          <span>Updated: {formatTimestamp(dataset.metadata.timestamp)}</span>
        </div>

        {/* Earnings Display */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div>
            <span className="text-sm text-gray-600">Total Earnings</span>
            <div className="font-semibold text-lg text-green-600">
              {dataset.earnings} FIL
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600">Price per Access</span>
            <div className="font-semibold">
              0.05 FIL
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handlePurchase}
            disabled={loading || !connectedWallet}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              connectedWallet
                ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Purchase Access'
            )}
          </button>
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            Preview
          </button>
        </div>

        {/* Additional Info (Expandable) */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">IPFS Hash:</span>
                <span className="font-mono text-xs text-gray-700">
                  {dataset.ipfsHash.slice(0, 12)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Checksum:</span>
                <span className="font-mono text-xs text-gray-700">
                  {dataset.metadata.checksum.slice(0, 12)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Storage:</span>
                <span className="text-gray-700">
                  {dataset.filecoinDeal ? 'Filecoin + IPFS' : 'IPFS Only'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};