# KnowledgeNet: Decentralized AI Knowledge Marketplace

## 🎯 PLGenesis 2025 Hackathon Project

A decentralized marketplace where AI models can access verified, peer-reviewed scientific data stored on Filecoin, with economic incentives for data contributors.

### 🏆 Target Tracks
- **AI & Autonomous Infrastructure** - Open knowledge graphs with verifiable provenance
- **Decentralized Economies** - Programmable incentives for data contributors
- **Secure, Sovereign Systems** - Peer-to-peer data sharing infrastructure

## 🏗️ Architecture

### Core Components
1. **Data Storage Layer**: Filecoin + IPFS for decentralized data persistence
2. **Economic Layer**: FVM smart contracts for incentives and payments
3. **AI Interface**: APIs for AI model data querying and validation
4. **Marketplace**: Web interface for data providers and consumers

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Compile smart contracts
npm run contracts:compile

# Run tests
npm test
```

## 📁 Project Structure

```
├── contracts/          # FVM smart contracts
├── scripts/            # Deployment scripts
├── src/
│   ├── components/     # React components
│   ├── pages/          # Next.js pages
│   ├── utils/          # Utility functions
│   └── api/            # API routes
├── public/             # Static assets
└── docs/               # Documentation
```

## 🛠️ Technology Stack

- **Frontend**: Next.js + React + TypeScript
- **Smart Contracts**: Solidity (FVM/EVM compatible)
- **Storage**: IPFS + Filecoin
- **Web3**: Ethers.js + Web3.js
