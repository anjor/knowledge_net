import React, { useState } from 'react';
import Link from 'next/link';
import datasets from '../utils/uploaded-datasets.json';

const MarketplacePage = () => {
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);

  const handlePurchase = async (datasetId: string) => {
    setPurchaseInProgress(true);
    // Simulate purchase transaction
    setTimeout(() => {
      setPurchaseInProgress(false);
      alert(`Purchase initiated for ${datasetId}. Check your wallet for transaction confirmation.`);
    }, 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Data Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover, purchase, and access verified datasets for AI training and research
          </p>
        </div>

        {/* Stats Banner */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Verified Datasets</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">479</div>
              <div className="text-sm text-gray-600">Total Downloads</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">38.24</div>
              <div className="text-sm text-gray-600">FIL Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-gray-600">Quality Score</div>
            </div>
          </div>
        </div>

        {/* Dataset Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {datasets.map((dataset) => (
            <div key={dataset.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Dataset Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                <h3 className="text-xl font-bold mb-2">{dataset.name}</h3>
                <p className="text-blue-100 text-sm">{dataset.description}</p>
              </div>

              {/* Dataset Content */}
              <div className="p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {dataset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Metrics */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">{dataset.format.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{formatSize(dataset.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">License:</span>
                    <span className="font-medium">{dataset.license}</span>
                  </div>
                  {dataset.data.quality_metrics && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quality Score:</span>
                      <span className="font-medium text-green-600">
                        {Object.values(dataset.data.quality_metrics)[0]}%
                      </span>
                    </div>
                  )}
                </div>

                {/* IPFS Info */}
                <div className="bg-gray-50 p-3 rounded-lg mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">IPFS Hash:</span>
                    <code className="text-xs font-mono text-gray-800 bg-white px-2 py-1 rounded">
                      {dataset.ipfsHash.slice(0, 12)}...
                    </code>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedDataset(dataset)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handlePurchase(dataset.id)}
                    disabled={purchaseInProgress}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                      purchaseInProgress
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {purchaseInProgress ? 'Processing...' : 'Purchase Access'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dataset Detail Modal */}
        {selectedDataset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDataset.name}</h2>
                  <button
                    onClick={() => setSelectedDataset(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Dataset Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Type:</strong> {selectedDataset.data.type}</div>
                      <div><strong>Format:</strong> {selectedDataset.format}</div>
                      <div><strong>License:</strong> {selectedDataset.license}</div>
                      <div><strong>Size:</strong> {formatSize(selectedDataset.size)}</div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Statistics</h3>
                    <div className="space-y-2 text-sm">
                      {selectedDataset.data.statistics && Object.entries(selectedDataset.data.statistics).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key.replace(/_/g, ' ')}:</strong> {Array.isArray(value) ? value.join(', ') : String(value)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quality Metrics */}
                {selectedDataset.data.quality_metrics && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Quality Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(selectedDataset.data.quality_metrics).map(([key, value]) => (
                        <div key={key} className="bg-green-50 p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">{value}%</div>
                          <div className="text-sm text-green-700">{key.replace(/_/g, ' ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sample Data */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Sample Data</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(selectedDataset.data[Object.keys(selectedDataset.data).find(k => Array.isArray(selectedDataset.data[k]))]?.[0] || selectedDataset.data, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedDataset(null)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handlePurchase(selectedDataset.id)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Purchase Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload CTA */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Have valuable data to share?
          </h2>
          <p className="text-gray-600 mb-6">
            Upload your datasets to KnowledgeNet and earn FIL from AI researchers worldwide
          </p>
          <div className="space-x-4">
            <Link
              href="/upload"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Upload Dataset
            </Link>
            <Link
              href="/ai-demo"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Try AI Interface
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;