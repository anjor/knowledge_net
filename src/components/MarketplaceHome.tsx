import React, { useState, useEffect } from 'react';
import { DatasetCard } from './DatasetCard';
import { SearchBar } from './SearchBar';
import { StatsDisplay } from './StatsDisplay';
import { WalletConnect } from './WalletConnect';
import { Dataset } from '../utils/storage';

export const MarketplaceHome: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  useEffect(() => {
    loadFeaturedDatasets();
  }, []);

  const loadFeaturedDatasets = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from the API
      // For now, show some sample data
      const sampleDatasets: Dataset[] = [
        {
          id: 'dataset_001',
          metadata: {
            name: 'Medical Image Dataset',
            description: 'Curated collection of medical imaging data for AI training',
            tags: ['medical', 'imaging', 'ai-training'],
            format: 'json',
            size: 1024000,
            checksum: '0xabc123...',
            license: 'CC-BY-4.0',
            contributor: '0xMedicalInstitute',
            timestamp: Date.now() - 86400000
          },
          ipfsHash: 'QmExample1...',
          verified: true,
          qualityScore: 92,
          downloadCount: 156,
          earnings: '12.45'
        },
        {
          id: 'dataset_002',
          metadata: {
            name: 'Climate Data Collection',
            description: 'Global climate measurements and predictions',
            tags: ['climate', 'environmental', 'science'],
            format: 'csv',
            size: 2048000,
            checksum: '0xdef456...',
            license: 'Open Data',
            contributor: '0xClimateOrg',
            timestamp: Date.now() - 172800000
          },
          ipfsHash: 'QmExample2...',
          verified: true,
          qualityScore: 88,
          downloadCount: 89,
          earnings: '7.23'
        },
        {
          id: 'dataset_003',
          metadata: {
            name: 'Financial Market Data',
            description: 'Real-time and historical financial market data',
            tags: ['finance', 'trading', 'time-series'],
            format: 'parquet',
            size: 512000,
            checksum: '0xghi789...',
            license: 'Commercial',
            contributor: '0xFinanceProvider',
            timestamp: Date.now() - 43200000
          },
          ipfsHash: 'QmExample3...',
          verified: true,
          qualityScore: 95,
          downloadCount: 234,
          earnings: '18.76'
        }
      ];
      
      setDatasets(sampleDatasets);
    } catch (error) {
      console.error('Failed to load datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string, tags: string[]) => {
    setSearchQuery(query);
    setSelectedTags(tags);
    
    try {
      setLoading(true);
      
      // In a real app, this would call the search API
      const response = await fetch('/api/datasets/search?' + new URLSearchParams({
        tags: tags.join(','),
        q: query
      }));
      
      if (response.ok) {
        const data = await response.json();
        setDatasets(data.datasets);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnect = (address: string) => {
    setConnectedWallet(address);
  };

  const filteredDatasets = datasets.filter(dataset => {
    const matchesQuery = !searchQuery || 
      dataset.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.metadata.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => dataset.metadata.tags.includes(tag));
    
    return matchesQuery && matchesTags;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                KnowledgeNet
              </h1>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                PLGenesis 2025
              </span>
            </div>
            <WalletConnect onConnect={handleWalletConnect} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Decentralized AI Knowledge Marketplace
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Access verified scientific data for AI models through our decentralized 
              marketplace powered by Filecoin and IPFS. Earn rewards for contributing 
              high-quality datasets.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Browse Datasets
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                Contribute Data
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsDisplay />
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Featured Datasets */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {searchQuery || selectedTags.length > 0 ? 'Search Results' : 'Featured Datasets'}
          </h3>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="flex space-x-2 mb-4">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDatasets.map((dataset) => (
                <DatasetCard 
                  key={dataset.id} 
                  dataset={dataset}
                  onPurchase={() => console.log('Purchase', dataset.id)}
                  connectedWallet={connectedWallet}
                />
              ))}
            </div>
          )}
          
          {!loading && filteredDatasets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No datasets found matching your criteria.
              </p>
              <button 
                onClick={() => handleSearch('', [])}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to contribute your data?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of researchers and organizations earning rewards 
            by sharing verified scientific datasets on our decentralized marketplace.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Upload Dataset
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">KnowledgeNet</h4>
              <p className="text-gray-600 text-sm">
                Democratizing access to scientific data through decentralized technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Browse Datasets</a></li>
                <li><a href="#" className="hover:text-blue-600">Upload Data</a></li>
                <li><a href="#" className="hover:text-blue-600">Become Validator</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Developers</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">API Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600">AI Integration</a></li>
                <li><a href="#" className="hover:text-blue-600">SDKs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Discord</a></li>
                <li><a href="#" className="hover:text-blue-600">GitHub</a></li>
                <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 KnowledgeNet. Built for PLGenesis 2025 Hackathon.</p>
            <p className="mt-2">Powered by Filecoin, IPFS, and FVM</p>
          </div>
        </div>
      </footer>
    </div>
  );
};