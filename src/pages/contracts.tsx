import React from 'react';
import Link from 'next/link';
import contracts from '../utils/contracts.json';

const ContractsPage = () => {
  const knowledgeMarketplace = contracts.KnowledgeMarketplace;
  const reputationSystem = contracts.ReputationSystem;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Contracts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            KnowledgeNet smart contracts deployed live on Filecoin Calibration testnet
          </p>
        </div>

        {/* Network Info */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center">
            <div className="bg-green-500 text-white rounded-full w-4 h-4 mr-3"></div>
            <span className="text-green-800 font-semibold text-lg">
              Live on Filecoin Calibration Testnet (Chain ID: 314159)
            </span>
          </div>
        </div>

        {/* KnowledgeMarketplace Contract */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">KnowledgeMarketplace</h2>
            <a
              href={`https://calibration.filscan.io/address/${knowledgeMarketplace.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View on FilScan
            </a>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contract Address</label>
              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <code className="text-sm font-mono flex-1 text-gray-800">
                  {knowledgeMarketplace.address}
                </code>
                <button
                  onClick={() => copyToClipboard(knowledgeMarketplace.address)}
                  className="ml-3 text-blue-600 hover:text-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Core Functions</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Dataset registration & submission</li>
                  <li>• Purchase processing & payments</li>
                  <li>• Validator registration & staking</li>
                  <li>• Quality validation & scoring</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Economic Features</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Automatic earnings distribution</li>
                  <li>• Platform fee collection (5%)</li>
                  <li>• Validator rewards (15%)</li>
                  <li>• Contributor earnings (80%)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ReputationSystem Contract */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">ReputationSystem</h2>
            <a
              href={`https://calibration.filscan.io/address/${reputationSystem.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              View on FilScan
            </a>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contract Address</label>
              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <code className="text-sm font-mono flex-1 text-gray-800">
                  {reputationSystem.address}
                </code>
                <button
                  onClick={() => copyToClipboard(reputationSystem.address)}
                  className="ml-3 text-purple-600 hover:text-purple-700"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Reputation Tracking</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Contributor score calculation</li>
                  <li>• Validator accuracy tracking</li>
                  <li>• Badge system & achievements</li>
                  <li>• Quality metrics aggregation</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Governance Features</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• User blacklisting/whitelisting</li>
                  <li>• Reputation-based privileges</li>
                  <li>• Threshold-based rankings</li>
                  <li>• Activity monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">Contract Deployment</h3>
                  <p className="text-sm text-gray-600">KnowledgeMarketplace successfully deployed</p>
                </div>
                <span className="text-xs text-gray-500">2024-12-30</span>
              </div>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">Contract Deployment</h3>
                  <p className="text-sm text-gray-600">ReputationSystem successfully deployed</p>
                </div>
                <span className="text-xs text-gray-500">2024-12-30</span>
              </div>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">Dataset Submission</h3>
                  <p className="text-sm text-gray-600">3 verified datasets uploaded to IPFS</p>
                </div>
                <span className="text-xs text-gray-500">2024-12-30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Developer Integration</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Web3 Connection</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <code className="text-sm text-gray-800">
                  Network: Filecoin Calibration<br/>
                  Chain ID: 314159<br/>
                  RPC: https://api.calibration.node.glif.io/rpc/v1
                </code>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">SDK Usage</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <code className="text-sm text-gray-800">
                  npm install @knowledgenet/sdk<br/>
                  import {`{ KnowledgeNetSDK }`} from '@knowledgenet/sdk'<br/>
                  const sdk = new KnowledgeNetSDK(contracts)
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors mr-4"
          >
            Explore Marketplace
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
  );
};

export default ContractsPage;