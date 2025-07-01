import React from 'react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About KnowledgeNet
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The first decentralized marketplace for AI training data, built on Filecoin for PLGenesis 2025
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Architecture Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Data Storage Layer */}
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <div className="text-center">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Data Storage</h3>
                <p className="text-sm text-gray-600">Filecoin + IPFS for decentralized, verifiable storage</p>
              </div>
            </div>

            {/* Economic Layer */}
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <div className="text-center">
                <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 7.41L16 12l-2.59 2.59L12 13.17 9.41 10.59 8 12l4 4 6-6-1.41-1.41z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Economic Layer</h3>
                <p className="text-sm text-gray-600">FVM smart contracts for incentives & payments</p>
              </div>
            </div>

            {/* AI Interface */}
            <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
              <div className="text-center">
                <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">AI Interface</h3>
                <p className="text-sm text-gray-600">APIs & SDKs for AI model integration</p>
              </div>
            </div>

            {/* Marketplace */}
            <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
              <div className="text-center">
                <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 6l2.29 2.29c.63.63.63 1.71 0 2.34L16 12.59 13.41 10 16 7.41 14.59 6 12 8.59 9.41 6 8 7.41 10.59 10 8 12.59 9.41 14 12 11.41 14.59 14 16 12.59 18.29 14.88c.63.63 1.71.63 2.34 0L22.92 12.59c.63-.63.63-1.71 0-2.34L20.63 8c-.63-.63-1.71-.63-2.34 0L16 10.29 13.71 8c-.63-.63-1.71-.63-2.34 0L9.08 10.29c-.63.63-.63 1.71 0 2.34L11.37 15c.63.63 1.71.63 2.34 0L16 12.71l2.29 2.29z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Marketplace</h3>
                <p className="text-sm text-gray-600">Web frontend for data discovery & trading</p>
              </div>
            </div>
          </div>
        </div>

        {/* Network Stats */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Network Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-gray-600">Verified Datasets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">479</div>
              <div className="text-gray-600">Total Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">38.24</div>
              <div className="text-gray-600">FIL Earned</div>
            </div>
          </div>
        </div>

        {/* Problem & Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-red-50 rounded-lg p-8 border-2 border-red-200">
            <h3 className="text-xl font-bold text-red-800 mb-4">Traditional Problems</h3>
            <ul className="space-y-3 text-red-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                Centralized data silos
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                Expensive access costs
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                Lack of data provenance
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                No incentives for quality
              </li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-8 border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4">KnowledgeNet Solutions</h3>
            <ul className="space-y-3 text-green-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Decentralized storage on Filecoin
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Competitive pricing mechanisms
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Cryptographic verification
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Economic rewards for contributors
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link 
            href="/marketplace" 
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

export default AboutPage;