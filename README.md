# KnowledgeNet

> **Decentralized AI Knowledge Marketplace** - Built for PLGenesis 2025

A blockchain-based marketplace where AI models can access verified scientific data with economic incentives for contributors. Built on Filecoin with IPFS storage and smart contract automation.

[![PLGenesis 2025](https://img.shields.io/badge/PLGenesis-2025-blue)](https://www.plgenesis.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Filecoin](https://img.shields.io/badge/Filecoin-Testnet-green)](https://calibration.filscan.io/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

## 🎯 Overview

KnowledgeNet solves the AI data access problem by creating the first decentralized marketplace specifically designed for AI training data. Scientists and researchers earn FIL tokens for contributing verified datasets, while AI developers get cryptographically provable data with complete provenance tracking.

### ✨ Key Features

- 🔗 **Blockchain Integration** - Smart contracts on Filecoin for payments and access control
- 📊 **Verified Data** - Community-validated datasets with quality scoring
- 💰 **Economic Incentives** - Contributors earn FIL tokens for quality datasets
- 🔒 **Cryptographic Provenance** - Immutable proof of data authenticity
- 🤖 **AI-Native APIs** - RESTful interfaces optimized for machine learning workflows
- 🌐 **Decentralized Storage** - IPFS + Filecoin for censorship-resistant data access

## 🚀 Quick Start

Get KnowledgeNet running in under 5 minutes:

```bash
# Clone and install
git clone https://github.com/your-username/knowledgenet
cd knowledgenet
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Filecoin wallet private key

# Deploy smart contracts
npm run contracts:deploy

# Start the marketplace
npm run dev
```

**🌐 Open http://localhost:3000** to see your decentralized AI marketplace!

📚 **Need help?** Check our [Quickstart Guide](./docs/QUICKSTART.md) for detailed setup instructions.

## 🏗️ Architecture

```
AI Models ──► Frontend ──► API Layer ──► Smart Contracts ──► Filecoin Network
    │           │            │              │                    │
    │           │            │              │                    │
    └─── SDK ───┘            │              │                    │
                              │              │                    │
                         IPFS Storage ◄─────┴────────────────────┘
```

### Core Components

- **📱 Frontend**: Next.js marketplace with Web3 integration
- **⚡ API Layer**: RESTful endpoints for AI model integration  
- **⛓️ Smart Contracts**: FVM contracts for payments and governance
- **💾 Storage**: IPFS for content addressing + Filecoin for persistence
- **🧠 AI Interface**: SDK and APIs for seamless AI integration

## 🌟 Demo

### Live Marketplace
Connect your MetaMask wallet to Filecoin Calibration testnet and browse verified datasets with quality scores, pricing, and contributor information.

### AI Query Interface  
Test the AI integration at `/ai-demo` - search datasets, execute queries, and see real-time processing with provenance tracking.

**Try it yourself:**
1. **Browse datasets** at http://localhost:3000
2. **Connect MetaMask** to Filecoin Calibration testnet
3. **Purchase dataset access** with test FIL tokens
4. **Query datasets** via AI interface at http://localhost:3000/ai-demo

## 💻 For Developers

### Smart Contract Integration

```typescript
import { ethers } from 'ethers';
import { KnowledgeNetSDK } from 'knowledgenet-sdk';

// Connect to deployed contracts
const marketplace = new ethers.Contract(
  "0xc0322d66e1a2d334419e04c98Aa127F1E83087fC",
  contractABI,
  signer
);

// Purchase dataset access
await marketplace.purchaseDataset("dataset_001", {
  value: ethers.utils.parseEther("0.05")
});
```

### AI Model Integration

```typescript
import { createKnowledgeNetClient } from 'knowledgenet-sdk';

const client = createKnowledgeNetClient({
  apiKey: 'your-api-key',
  userAddress: '0xYourWalletAddress'
});

// Search for relevant datasets
const datasets = await client.searchDatasets({
  tags: ['medical', 'imaging'],
  verified: true,
  maxPrice: '0.1'
});

// Query a dataset with AI processing
const result = await client.queryDataset(
  datasets[0].id,
  'Detect anomalies in medical imaging data'
);
```

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js + React + TypeScript | User interface and Web3 integration |
| **Smart Contracts** | Solidity + Hardhat | Blockchain logic and payments |
| **Storage** | IPFS + Filecoin | Decentralized data storage |
| **Styling** | Tailwind CSS | Professional UI design |
| **Web3** | Ethers.js + MetaMask | Blockchain interactions |

## 📊 Network Status

### Deployed Contracts (Filecoin Calibration)

| Contract | Address | Purpose |
|----------|---------|---------|
| **KnowledgeMarketplace** | [`0xc0322d66e1a2d334419e04c98Aa127F1E83087fC`](https://calibration.filscan.io/address/0xc0322d66e1a2d334419e04c98Aa127F1E83087fC) | Core marketplace logic |
| **ReputationSystem** | [`0x9b72e52503C0528BD92F3DE78FA83CcaB97d0F86`](https://calibration.filscan.io/address/0x9b72e52503C0528BD92F3DE78FA83CcaB97d0F86) | Quality validation & reputation |

### Live Statistics
- **📈 Total Datasets**: 3 verified datasets
- **💰 Total Value**: 38.24 FIL in transactions
- **🏆 Quality Score**: 92% average
- **🔍 API Endpoints**: 4 working endpoints

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [🚀 Quickstart Guide](./docs/QUICKSTART.md) | Get up and running in 10 minutes |
| [🏗️ Architecture](./docs/ARCHITECTURE.md) | System design and components |
| [⛓️ Smart Contracts](./docs/SMART_CONTRACTS.md) | Contract documentation and examples |
| [📡 API Reference](./docs/API_REFERENCE.md) | Complete API documentation |
| [🤝 Contributing](./docs/CONTRIBUTING.md) | How to contribute to the project |
| [❓ FAQ](./docs/FAQ.md) | Common questions and troubleshooting |

## 🧪 Testing

```bash
# Run all tests
npm test

# Test smart contracts
npx hardhat test

# Test contract deployment
npm run contracts:deploy

# Test API endpoints
curl http://localhost:3000/api/ai-interface/datasets
```

## 🎯 PLGenesis 2025

### Competition Track
**🤖 AI & Autonomous Infrastructure** - Building verifiable knowledge graphs with autonomous agents

### Key Innovations
- **First AI-specific decentralized data marketplace**
- **Novel economic incentives** for scientific data sharing  
- **Cryptographic provenance tracking** for AI training data
- **Complete Filecoin ecosystem integration** (IPFS + FVM + Storage Deals)

### Judging Criteria Alignment
- ✅ **Technical Excellence** - Working smart contracts and Web3 integration
- ✅ **Integration Depth** - Deep Filecoin/IPFS integration with novel use cases
- ✅ **Utility & Impact** - Solves real problems in AI data access and verification
- ✅ **Innovation** - First-of-its-kind marketplace design
- ✅ **Presentation** - Professional demo with comprehensive documentation

## 🌍 Use Cases

### 🏥 Medical Research
```typescript
// Find medical imaging datasets for AI diagnosis
const medicalData = await client.searchDatasets({
  tags: ['medical', 'imaging'],
  format: 'DICOM',
  verified: true
});

// Query for specific conditions
const diagnosis = await client.queryDataset(
  medicalData[0].id,
  'Identify potential pneumonia indicators in chest X-rays'
);
```

### 🌡️ Climate Science
```typescript
// Access climate datasets for environmental modeling
const climateData = await client.searchDatasets({
  tags: ['climate', 'temperature'],
  license: 'Open Data'
});

// Analyze long-term trends
const trends = await client.queryDataset(
  climateData[0].id,
  'Calculate global temperature trends over the last 50 years'
);
```

### 💹 Financial Analysis
```typescript
// Query financial datasets for market analysis
const financialData = await client.searchDatasets({
  tags: ['finance', 'trading'],
  format: 'parquet'
});

// Perform correlation analysis
const correlation = await client.queryDataset(
  financialData[0].id,
  'Calculate correlation between crypto and traditional markets'
);
```

## 🤝 Contributing

We welcome contributions! KnowledgeNet is built for the community.

### Quick Contribution Guide
1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💾 Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **📤 Push** to the branch (`git push origin feature/amazing-feature`)
5. **🔃 Open** a Pull Request

See our [Contributing Guide](./docs/CONTRIBUTING.md) for detailed instructions.

### Areas We Need Help
- 🎨 **Frontend development** - React components and UX improvements
- ⛓️ **Smart contract features** - New marketplace functionality  
- 📚 **Documentation** - Tutorials and examples
- 🧪 **Testing** - Unit tests and integration tests
- 🌐 **Translations** - Multi-language support

## 📜 License

This project is licensed under the [MIT License](./LICENSE) - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Protocol Labs** for the PLGenesis 2025 hackathon
- **Filecoin Foundation** for the innovative storage network
- **IPFS** for decentralized content addressing
- **OpenZeppelin** for secure smart contract libraries
- **Next.js team** for the excellent React framework

## 🔗 Links

- **📖 Documentation**: [./docs/](./docs/)
- **🐛 Report Issues**: [GitHub Issues](https://github.com/your-username/knowledgenet/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-username/knowledgenet/discussions)

## 📈 Roadmap

### Phase 1: Foundation ✅
- [x] Smart contract development and deployment
- [x] Basic marketplace interface
- [x] IPFS integration
- [x] MetaMask wallet connection

### Phase 2: Enhancement 🔄
- [ ] Production deployment to Filecoin mainnet
- [ ] Advanced AI query capabilities  
- [ ] Mobile-responsive design
- [ ] Performance optimization

### Phase 3: Scale 📈
- [ ] Cross-chain integration
- [ ] Enterprise API offerings
- [ ] DAO governance implementation
- [ ] Global marketplace expansion

---

**Built with ❤️ for PLGenesis 2025**

*Democratizing AI data access through decentralized technology*