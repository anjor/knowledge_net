import React, { useState, useEffect } from 'react';
import { KnowledgeNetSDK } from '../utils/knowledgenet-sdk';
import { useWallet } from '../contexts/WalletContext';
import { toast } from 'react-hot-toast';

const AIDemoPage: React.FC = () => {
  const { userAddress, isConnecting, connectWallet, web3Service } = useWallet();
  const [query, setQuery] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('dataset_001');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [datasetOwnership, setDatasetOwnership] = useState<Record<string, boolean>>({});

  const sdk = new KnowledgeNetSDK({
    userAddress: userAddress || ''
  });

  const handleSearch = async () => {
    try {
      setLoading(true);
      console.log('Starting dataset search...');
      const searchResult = await sdk.searchDatasets({
        limit: 10,
        verified: true
      });
      console.log('Search result:', searchResult);
      console.log('Datasets found:', searchResult.datasets);
      setDatasets(searchResult.datasets);
      console.log('Datasets state updated');
      
      // Check ownership for each dataset if wallet is connected
      if (userAddress && searchResult.datasets.length > 0) {
        const ownership: Record<string, boolean> = {};
        for (const dataset of searchResult.datasets) {
          try {
            const hasAccess = await web3Service.hasAccess(dataset.id, userAddress);
            ownership[dataset.id] = hasAccess;
          } catch (error) {
            console.error(`Error checking access for ${dataset.id}:`, error);
            ownership[dataset.id] = false;
          }
        }
        setDatasetOwnership(ownership);
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error('Search failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    if (!userAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const queryResult = await sdk.queryDataset(selectedDataset, query);
      setResult(queryResult);
    } catch (error: any) {
      console.error('Query error:', error);
      toast.error('Query failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    'Analyze patterns in the medical imaging data',
    'Find temperature trends over the last decade',
    'Calculate correlation between market indicators',
    'Detect anomalies in the dataset',
    'Generate summary statistics'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            KnowledgeNet AI Interface Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Demonstrate how AI models can access verified scientific data 
            through our decentralized marketplace API
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          {!userAddress ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Connect your wallet to access the AI query interface
              </p>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-2">Connected Address:</p>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">{userAddress}</p>
            </div>
          )}
        </div>

        {/* Dataset Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Available Datasets</h2>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Search Datasets'}
            </button>
          </div>
          
          {/* Debug info */}
          <div className="text-sm text-gray-500 mb-4">
            Debug: Found {datasets.length} datasets, Loading: {loading.toString()}
          </div>
          
          {datasets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    selectedDataset === dataset.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDataset(dataset.id)}
                >
                  <h3 className="font-medium text-gray-900 mb-2">
                    {dataset.metadata.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {dataset.metadata.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Quality: {dataset.qualityScore}%</span>
                    <span>Price: {dataset.price} FIL</span>
                  </div>
                  {datasetOwnership[dataset.id] && (
                    <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full text-center">
                      ✓ You own this dataset
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {dataset.metadata.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Query Interface */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">AI Query Interface</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Dataset: {selectedDataset}
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Query
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your AI query (e.g., 'Analyze patterns in the data')"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sample Queries
            </label>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(sample)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleQuery}
            disabled={loading || !query.trim() || !userAddress}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
          >
            {!userAddress ? 'Connect Wallet First' : loading ? 'Processing Query...' : 'Execute AI Query'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Query Results</h2>
            
            {result.success ? (
              <div className="space-y-4">
                {/* Provenance Information */}
                {result.provenance && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">Data Provenance</h3>
                    <div className="text-sm text-green-700 space-y-1">
                      <p><strong>Dataset ID:</strong> {result.provenance.datasetId}</p>
                      <p><strong>IPFS Hash:</strong> {result.provenance.ipfsHash}</p>
                      <p><strong>Contributor:</strong> {result.provenance.contributor}</p>
                      <p><strong>Verified:</strong> {result.provenance.verified ? '✅ Yes' : '❌ No'}</p>
                    </div>
                  </div>
                )}

                {/* Usage Information */}
                {result.usage && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 mb-2">Usage & Cost</h3>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p><strong>Tokens Used:</strong> {result.usage.tokensUsed}</p>
                      <p><strong>Cost:</strong> {result.usage.cost} FIL {result.usage.wasFree ? '(Free - You own this dataset)' : ''}</p>
                    </div>
                  </div>
                )}

                {/* AI Results */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">AI Analysis Results</h3>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-800 mb-2">Error</h3>
                <p className="text-sm text-red-700">{result.error}</p>
              </div>
            )}
          </div>
        )}

        {/* SDK Code Example */}
        <div className="bg-gray-900 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">SDK Integration Example</h2>
          <pre className="text-sm text-gray-300 overflow-x-auto">
            <code>
{`// Install: npm install knowledgenet-sdk
import { createKnowledgeNetClient } from 'knowledgenet-sdk';

const client = createKnowledgeNetClient({
  userAddress: '${userAddress || '0x...'}'
});

// Search for datasets
const datasets = await client.findDatasetsByTag('medical');

// Query a dataset
const result = await client.queryDataset('${selectedDataset}', '${query || 'Analyze the data'}');

// Get usage statistics  
const stats = await client.getUsageStats('month');`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AIDemoPage;