# KnowledgeNet Architecture

## Overview

KnowledgeNet is a decentralized AI knowledge marketplace built on Filecoin that enables AI models to access verified scientific data with economic incentives for contributors.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          KnowledgeNet                          │
│                 Decentralized AI Knowledge Marketplace         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Models     │    │  Data Scientists │    │   Validators    │
│                 │    │   & Researchers  │    │                 │
│ • Query Data    │    │ • Upload Data    │    │ • Verify Data   │
│ • Pay for Access│    │ • Earn Rewards   │    │ • Earn Rewards  │
│ • Get Provenance│    │ • Build Rep.     │    │ • Stake FIL     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │              ┌───────┴───────┐              │
          │              │               │              │
          ▼              ▼               ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Layer (Next.js)                    │
├─────────────────────────────────────────────────────────────────┤
│ • React Components    • Web3 Integration    • Toast Notifications│
│ • Dataset Cards       • MetaMask Connection • Purchase Flow      │
│ • Search & Filter     • Real-time Stats     • AI Demo Interface │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Layer (Next.js API)                    │
├─────────────────────────────────────────────────────────────────┤
│ AI Interface Endpoints:                                         │
│ • /api/ai-interface/query     - AI data queries with provenance │
│ • /api/ai-interface/datasets  - Dataset search and discovery    │
│ • /api/ai-interface/access    - Access token management         │
│ • /api/ai-interface/usage     - Usage analytics and billing     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Web3 Integration Layer                        │
├─────────────────────────────────────────────────────────────────┤
│ • Web3Service       • useWeb3 Hook        • Ethers.js          │
│ • Contract ABIs     • Transaction Mgmt    • Event Listeners     │
│ • Gas Optimization  • Error Handling      • Network Detection   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Filecoin Network Layer                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐              ┌─────────────────┐           │
│  │ Smart Contracts │              │ IPFS Storage    │           │
│  │   (FVM Layer)   │              │   (Content)     │           │
│  ├─────────────────┤              ├─────────────────┤           │
│  │ KnowledgeMarket │◄────────────►│ Dataset Files   │           │
│  │ • registerDataset│              │ • Medical Data  │           │
│  │ • purchaseDataset│              │ • Climate Data  │           │
│  │ • hasAccess     │              │ • Financial Data│           │
│  │ • payments      │              │ • Metadata      │           │
│  ├─────────────────┤              └─────────────────┘           │
│  │ ReputationSystem│                                            │
│  │ • validateData  │              ┌─────────────────┐           │
│  │ • stakeTokens   │              │ Filecoin Storage│           │
│  │ • badgeSystem   │              │  (Persistence)  │           │
│  │ • governance    │◄────────────►│ • Storage Deals │           │
│  └─────────────────┘              │ • Replication   │           │
│                                   │ • Proof-of-Time │           │
│                                   └─────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Data Flow & Incentives                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Data Upload ──► IPFS Hash ──► Smart Contract ──► Validation    │
│       │                            │                   │       │
│       ▼                            ▼                   ▼       │
│  Contributors ◄── FIL Rewards ◄── Purchase ◄── Quality Score   │
│                                     │                           │
│                                     ▼                           │
│                              AI Models Get:                    │
│                              • Verified Data                   │
│                              • Cryptographic Provenance        │
│                              • Usage Analytics                 │
│                              • Compliance Tracking             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Frontend Layer (Next.js + React)
- **Purpose**: User interface for all marketplace participants
- **Components**: 
  - `MarketplaceHome.tsx` - Main marketplace interface
  - `DatasetCard.tsx` - Individual dataset display with purchase flow
  - `WalletConnect.tsx` - MetaMask integration for Filecoin
  - `Toast.tsx` - Professional notifications with copyable transaction hashes
  - `StatsDisplay.tsx` - Real-time network statistics

### 2. API Layer (Next.js API Routes)
- **Purpose**: Backend services for AI model integration
- **Endpoints**:
  - `/api/ai-interface/query` - Process AI queries with provenance tracking
  - `/api/ai-interface/datasets` - Search and filter available datasets
  - `/api/ai-interface/access` - Manage dataset access tokens
  - `/api/ai-interface/usage` - Analytics and billing information

### 3. Web3 Integration Layer
- **Purpose**: Blockchain interaction and transaction management
- **Files**:
  - `src/utils/web3.ts` - Core Web3 service class
  - `src/hooks/useWeb3.ts` - React hook for easy Web3 integration
  - `src/utils/knowledgenet-sdk.ts` - Developer SDK for external integration

### 4. Smart Contract Layer (FVM)
- **Purpose**: On-chain logic for marketplace operations
- **Contracts**:
  - `KnowledgeMarketplace.sol` - Core marketplace functionality
  - `ReputationSystem.sol` - Quality validation and reputation management

### 5. Storage Layer (IPFS + Filecoin)
- **Purpose**: Decentralized data storage with persistence guarantees
- **Components**:
  - IPFS for content addressing and immediate access
  - Filecoin for long-term storage with proof-of-spacetime

## Data Flow

### Dataset Upload Flow
1. **Data Provider** uploads dataset to IPFS
2. **IPFS** returns content hash
3. **Smart Contract** records dataset metadata and IPFS hash
4. **Filecoin** creates storage deal for long-term persistence
5. **Validators** verify data quality and assign score

### AI Query Flow
1. **AI Model** searches datasets via API
2. **Smart Contract** checks access permissions
3. **API** retrieves data from IPFS using hash
4. **AI Processing** occurs with provenance tracking
5. **Usage Metrics** recorded for billing and analytics

### Economic Flow
1. **AI Models** pay FIL for dataset access
2. **Smart Contract** splits payment:
   - 93% to data contributor
   - 5% to validators
   - 2% platform fee
3. **Contributors** earn passive income from quality datasets
4. **Validators** earn rewards for maintaining data quality

## Key Design Principles

### Decentralization
- No single point of failure
- Censorship-resistant data access
- Community-driven quality assurance

### Verifiability  
- Cryptographic proof of data authenticity
- Immutable provenance tracking
- Transparent quality scoring

### Economic Sustainability
- Market-driven pricing
- Quality-based incentives
- Sustainable validator economics

### AI-Native Design
- Optimized for machine learning workflows
- Standardized data formats
- Provenance-aware APIs

## Network Architecture

### Filecoin Calibration Testnet
- **Chain ID**: 314159
- **RPC URL**: https://api.calibration.node.glif.io/rpc/v1
- **Explorer**: https://calibration.filscan.io/
- **Currency**: tFIL (test Filecoin)

### Deployed Contracts
- **KnowledgeMarketplace**: `0xc0322d66e1a2d334419e04c98Aa127F1E83087fC`
- **ReputationSystem**: `0x9b72e52503C0528BD92F3DE78FA83CcaB97d0F86`

## Security Considerations

### Smart Contract Security
- ReentrancyGuard on all payable functions
- Access control with Ownable pattern
- Input validation and bounds checking
- Event logging for transparency

### Data Integrity
- IPFS content addressing prevents tampering
- Filecoin proof-of-spacetime ensures persistence
- Multi-validator consensus for quality scores

### Economic Security
- Validator staking requirements
- Slashing for malicious behavior
- Reputation-based weighting system

## Scalability Features

### Layer 2 Ready
- Modular architecture supports scaling solutions
- Event-driven updates minimize on-chain storage
- Batch processing capabilities

### IPFS Optimization
- Content caching for frequently accessed datasets
- CDN integration for global distribution
- Lazy loading for large datasets

### Economic Efficiency
- Gas-optimized smart contracts
- Minimal on-chain data storage
- Efficient reward distribution algorithms