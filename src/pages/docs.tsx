import React from 'react';
import Link from 'next/link';

const DocsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
              KnowledgeNet
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
              <Link href="/upload" className="text-gray-600 hover:text-blue-600">Upload</Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link>
              <Link href="/docs" className="text-blue-600 font-medium">Docs</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how to use KnowledgeNet's decentralized AI knowledge marketplace
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Table of Contents</h2>
          <ul className="space-y-2 text-blue-700">
            <li><a href="#overview" className="hover:underline">1. Platform Overview</a></li>
            <li><a href="#architecture" className="hover:underline">2. Live Architecture</a></li>
            <li><a href="#getting-started" className="hover:underline">3. Getting Started</a></li>
            <li><a href="#uploading" className="hover:underline">4. Uploading Datasets</a></li>
            <li><a href="#purchasing" className="hover:underline">5. Purchasing Data Access</a></li>
            <li><a href="#validation" className="hover:underline">6. Dataset Validation</a></li>
            <li><a href="#ai-integration" className="hover:underline">7. AI Integration</a></li>
            <li><a href="#smart-contracts" className="hover:underline">8. Smart Contracts</a></li>
            <li><a href="#troubleshooting" className="hover:underline">9. Troubleshooting</a></li>
          </ul>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Platform Overview */}
          <section id="overview" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Platform Overview</h2>
            <p className="text-gray-600 mb-4">
              KnowledgeNet is a decentralized marketplace that connects AI developers with verified scientific datasets. 
              Built on Filecoin, it ensures data permanence, verifiability, and fair compensation for data contributors.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Features</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li><strong>Decentralized Storage:</strong> Data stored on IPFS and Filecoin for permanence</li>
              <li><strong>Smart Contract Payments:</strong> Automatic FIL payments to data contributors</li>
              <li><strong>Quality Validation:</strong> Peer-reviewed datasets with quality scores</li>
              <li><strong>Immutable Provenance:</strong> Blockchain-verified data lineage</li>
              <li><strong>AI-Ready APIs:</strong> Direct integration for AI models and training</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium text-blue-900">Upload Data</div>
                <div className="text-sm text-blue-700">Contributors upload datasets</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-medium text-green-900">Validation</div>
                <div className="text-sm text-green-700">Validators review quality</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">💰</div>
                <div className="font-medium text-purple-900">Purchase</div>
                <div className="text-sm text-purple-700">AI developers buy access</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl mb-2">🤖</div>
                <div className="font-medium text-orange-900">AI Training</div>
                <div className="text-sm text-orange-700">Models access verified data</div>
              </div>
            </div>
          </section>

          {/* Live Architecture */}
          <section id="architecture" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Live Architecture</h2>
            <p className="text-gray-600 mb-6">
              KnowledgeNet is built with a modular architecture deployed live on Filecoin Calibration testnet. 
              Every component below is functional and verifiable on the blockchain.
            </p>

            {/* Architecture Diagram */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Architecture</h3>
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <div className="text-center space-y-4">
                  <div className="flex justify-center items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg font-medium text-blue-900">Frontend (React/Next.js)</div>
                    <div className="text-gray-400">→</div>
                    <div className="bg-green-100 p-3 rounded-lg font-medium text-green-900">API Layer</div>
                    <div className="text-gray-400">→</div>
                    <div className="bg-purple-100 p-3 rounded-lg font-medium text-purple-900">Smart Contracts</div>
                    <div className="text-gray-400">→</div>
                    <div className="bg-orange-100 p-3 rounded-lg font-medium text-orange-900">Filecoin</div>
                  </div>
                  <div className="flex justify-center items-center space-x-4">
                    <div className="bg-yellow-100 p-3 rounded-lg font-medium text-yellow-900">IPFS Storage</div>
                    <div className="text-gray-400">↕</div>
                    <div className="bg-red-100 p-3 rounded-lg font-medium text-red-900">Web3 Integration</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Contract Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployed Smart Contracts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">KnowledgeMarketplace</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-green-700">Address:</span>
                      <code className="text-green-800 font-mono text-xs">0x8662307D31e29dC91C8dca9B78e8F896dBC68383</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Network:</span>
                      <span className="text-green-800">Filecoin Calibration</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Status:</span>
                      <span className="text-green-800 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Live
                      </span>
                    </div>
                    <div className="mt-2">
                      <a 
                        href="https://calibration.filscan.io/address/0x8662307D31e29dC91C8dca9B78e8F896dBC68383" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 text-xs underline"
                      >
                        View on FilScan Explorer →
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">ReputationSystem</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Address:</span>
                      <code className="text-purple-800 font-mono text-xs">0x9b72e52503C0528BD92F3DE78FA83CcaB97d0F86</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Network:</span>
                      <span className="text-purple-800">Filecoin Calibration</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Status:</span>
                      <span className="text-purple-800 flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                        Live
                      </span>
                    </div>
                    <div className="mt-2">
                      <a 
                        href="https://calibration.filscan.io/address/0x9b72e52503C0528BD92F3DE78FA83CcaB97d0F86" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 text-xs underline"
                      >
                        View on FilScan Explorer →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Status */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Information</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-900">Chain ID:</span>
                    <span className="text-blue-700 ml-2">314159</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-900">RPC URL:</span>
                    <span className="text-blue-700 ml-2">api.calibration.node.glif.io</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-900">Explorer:</span>
                    <a href="https://calibration.filscan.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                      calibration.filscan.io
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* API Endpoints */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live API Endpoints</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm font-mono text-gray-800">/api/ai-interface/query</code>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">POST</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm font-mono text-gray-800">/api/ai-interface/datasets</code>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">GET</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm font-mono text-gray-800">/api/ai-interface/access</code>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">GET</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm font-mono text-gray-800">/api/datasets/upload</code>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">POST</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verify Live Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href="https://calibration.filscan.io/address/0x8662307D31e29dC91C8dca9B78e8F896dBC68383" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-green-600 text-lg mb-2">⛓️</div>
                  <div className="font-medium text-gray-900">View Contracts</div>
                  <div className="text-sm text-gray-600">Check live smart contracts</div>
                </a>
                <a 
                  href="/ai-demo" 
                  className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-purple-600 text-lg mb-2">🤖</div>
                  <div className="font-medium text-gray-900">Test AI Interface</div>
                  <div className="text-sm text-gray-600">Try live API endpoints</div>
                </a>
                <a 
                  href="/contracts" 
                  className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-blue-600 text-lg mb-2">📋</div>
                  <div className="font-medium text-gray-900">Contract Details</div>
                  <div className="text-sm text-gray-600">View deployment info</div>
                </a>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Getting Started</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prerequisites</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>MetaMask wallet installed</li>
              <li>Connected to Filecoin Calibration testnet</li>
              <li>Test FIL tokens for transactions</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">Network Configuration</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="font-medium text-gray-900 mb-2">Filecoin Calibration Testnet:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>Network Name:</strong> Filecoin Calibration</li>
                <li><strong>RPC URL:</strong> https://api.calibration.node.glif.io/rpc/v1</li>
                <li><strong>Chain ID:</strong> 314159</li>
                <li><strong>Currency Symbol:</strong> tFIL</li>
                <li><strong>Faucet:</strong> <a href="https://faucet.calibnet.chainsafe-fil.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Get Test FIL</a></li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">First Steps</h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-2">
              <li>Connect your MetaMask wallet on the homepage</li>
              <li>Ensure you're on Filecoin Calibration testnet</li>
              <li>Get test FIL from the faucet if needed</li>
              <li>Browse available datasets or upload your own</li>
            </ol>
          </section>

          {/* Uploading Datasets */}
          <section id="uploading" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Uploading Datasets</h2>
            
            <p className="text-gray-600 mb-4">
              Share your scientific data with the community and earn FIL when researchers purchase access.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step-by-Step Process</h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 mb-4">
              <li><strong>Prepare Your Data:</strong> Ensure data is clean, well-formatted, and scientifically valuable</li>
              <li><strong>Go to Upload Page:</strong> Click "Upload Dataset" from the homepage</li>
              <li><strong>Fill Metadata:</strong> Provide name, description, tags, format, and license</li>
              <li><strong>Set Price:</strong> Choose FIL price per access (e.g., 0.05 FIL)</li>
              <li><strong>Upload File:</strong> Select your dataset file (JSON, CSV, Parquet, etc.)</li>
              <li><strong>Submit Transaction:</strong> Confirm the blockchain transaction in MetaMask</li>
              <li><strong>Wait for Validation:</strong> Validators will review and score your dataset</li>
            </ol>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-yellow-800">
                <strong>Note:</strong> Datasets must be validated with a quality score ≥70% before users can purchase access.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Practices</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Include comprehensive metadata and clear descriptions</li>
              <li>Use relevant tags to improve discoverability</li>
              <li>Choose appropriate licenses (CC-BY-4.0 recommended for research)</li>
              <li>Price competitively based on data value and size</li>
              <li>Ensure data quality to pass validation</li>
            </ul>
          </section>

          {/* Purchasing Data Access */}
          <section id="purchasing" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Purchasing Data Access</h2>
            
            <p className="text-gray-600 mb-4">
              Purchase access to verified datasets for AI training, research, or analysis.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">Purchase Process</h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Browse datasets on the homepage</li>
              <li>Review dataset details, quality score, and price</li>
              <li>Click "Purchase Access" on your chosen dataset</li>
              <li>Confirm the FIL payment in MetaMask</li>
              <li>Access granted immediately after transaction confirmation</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">What You Get</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Permanent access to the dataset</li>
              <li>IPFS hash for decentralized access</li>
              <li>Verified provenance and quality metrics</li>
              <li>License terms for usage rights</li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <p className="text-green-800">
                <strong>Payment Distribution:</strong> 93% to data contributor, 5% to validators, 2% platform fee
              </p>
            </div>
          </section>

          {/* Dataset Validation */}
          <section id="validation" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Dataset Validation</h2>
            
            <p className="text-gray-600 mb-4">
              Community validators review datasets for quality, accuracy, and compliance before they become purchasable.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">Validation Process</h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Validator stakes 1 FIL to participate</li>
              <li>Reviews dataset content and metadata</li>
              <li>Assigns quality score (0-100)</li>
              <li>Submits validation transaction</li>
              <li>Earns rewards from future purchases</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Criteria</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li><strong>Data Quality (40%):</strong> Accuracy, completeness, formatting</li>
              <li><strong>Scientific Value (30%):</strong> Research relevance, novelty</li>
              <li><strong>Documentation (20%):</strong> Metadata completeness, clarity</li>
              <li><strong>Compliance (10%):</strong> License validity, ethical considerations</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-blue-800">
                <strong>Threshold:</strong> Datasets need ≥70% quality score to become available for purchase
              </p>
            </div>
          </section>

          {/* AI Integration */}
          <section id="ai-integration" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. AI Integration</h2>
            
            <p className="text-gray-600 mb-4">
              Integrate KnowledgeNet into your AI workflows with our APIs and SDKs.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">Try the Demo</h3>
            <p className="text-gray-600 mb-4">
              Experience AI integration with our <Link href="/ai-demo" className="text-blue-600 hover:underline">interactive demo</Link> that shows:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Dataset search and discovery</li>
              <li>Automated data querying</li>
              <li>Usage tracking and billing</li>
              <li>Access control and permissions</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">Integration Benefits</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li><strong>Verified Data:</strong> All datasets are peer-reviewed for quality</li>
              <li><strong>Decentralized Access:</strong> No single point of failure</li>
              <li><strong>Transparent Pricing:</strong> Fair, blockchain-enforced payments</li>
              <li><strong>Immutable Provenance:</strong> Complete data lineage tracking</li>
            </ul>
          </section>

          {/* Smart Contracts */}
          <section id="smart-contracts" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Smart Contracts</h2>
            
            <p className="text-gray-600 mb-4">
              KnowledgeNet runs on two main smart contracts deployed on Filecoin.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">KnowledgeMarketplace</h4>
                <p className="text-sm text-gray-600 mb-2">Core marketplace functionality</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Dataset registration</li>
                  <li>• Purchase transactions</li>
                  <li>• Access control</li>
                  <li>• Payment distribution</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">ReputationSystem</h4>
                <p className="text-sm text-gray-600 mb-2">Validation and reputation</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Validator registration</li>
                  <li>• Quality scoring</li>
                  <li>• Reputation tracking</li>
                  <li>• Reward distribution</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-600">
              View live contract details and transactions on our <Link href="/contracts" className="text-blue-600 hover:underline">Smart Contracts page</Link>.
            </p>
          </section>

          {/* Troubleshooting */}
          <section id="troubleshooting" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Troubleshooting</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Issues</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-medium text-gray-900">Transaction Failed</h4>
                <p className="text-gray-600 text-sm">Increase gas limit to 30M+ for Filecoin transactions</p>
              </div>
              
              <div className="border-l-4 border-yellow-400 pl-4">
                <h4 className="font-medium text-gray-900">Dataset Not Purchasable</h4>
                <p className="text-gray-600 text-sm">Dataset must be validated with ≥70% quality score first</p>
              </div>
              
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-medium text-gray-900">MetaMask Not Connecting</h4>
                <p className="text-gray-600 text-sm">Ensure you're on Filecoin Calibration testnet (Chain ID: 314159)</p>
              </div>
              
              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-medium text-gray-900">No Test FIL</h4>
                <p className="text-gray-600 text-sm">Get free test tokens from: <a href="https://faucet.calibnet.chainsafe-fil.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Filecoin Faucet</a></p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-6">Need Help?</h3>
            <p className="text-gray-600">
              For additional support, check our <a href="https://github.com/anjor/knowledge_net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub repository</a> or contact the development team.
            </p>
          </section>
        </div>

        {/* Back to Top */}
        <div className="text-center mt-12">
          <a href="#top" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Back to Top
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;