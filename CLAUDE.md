# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Decentralized AI Knowledge Marketplace** - A PLGenesis 2025 hackathon project that creates a decentralized marketplace where AI models can access verified, peer-reviewed scientific data stored on Filecoin, with economic incentives for data contributors.

## Key Technologies

- **Filecoin/IPFS**: Decentralized storage for scientific datasets and content addressing
- **FVM (Filecoin Virtual Machine)**: Smart contracts for economic incentives and governance
- **Web3 Stack**: Frontend interfaces for marketplace interaction
- **AI Integration**: APIs for AI model data querying and validation

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Run tests
npm test

# Compile smart contracts
npm run contracts:compile

# Deploy contracts to Filecoin
npm run contracts:deploy
```

## Architecture

### Core Components
1. **Data Storage Layer**: Filecoin for persistent storage, IPFS for content addressing
2. **Economic Layer**: FVM smart contracts for incentives, reputation, and payments
3. **AI Interface Layer**: APIs and SDKs for AI model integration
4. **Marketplace Layer**: Web frontend for data providers and consumers


## github rules

- make small commits
- don't write verbose commit messages
