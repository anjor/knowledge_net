# KnowledgeNet Quickstart Guide

Get KnowledgeNet running locally in under 10 minutes! This guide walks you through setting up the decentralized AI knowledge marketplace.

## Prerequisites

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for cloning the repository
- **MetaMask** browser extension ([Install](https://metamask.io/))

### Required Accounts
- **MetaMask wallet** with Filecoin Calibration testnet configured
- **Test FIL tokens** from the Filecoin faucet

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/knowledgenet
cd knowledgenet

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

## Step 2: Configure Environment

Edit `.env` file with your settings:

```bash
# Filecoin Network Configuration
PRIVATE_KEY=your_private_key_here
FILECOIN_RPC_URL=https://api.calibration.node.glif.io/rpc/v1

# IPFS Configuration  
IPFS_API_URL=https://ipfs.infura.io:5001
IPFS_GATEWAY_URL=https://ipfs.io/ipfs/

# Application Configuration
NEXT_PUBLIC_APP_NAME=KnowledgeNet
NEXT_PUBLIC_NETWORK=calibration
```

**⚠️ Getting Your Private Key:**
1. Open MetaMask
2. Click account menu → Account Details → Export Private Key
3. Enter your password and copy the key (remove 0x prefix)

## Step 3: Set Up Filecoin Network

### Add Filecoin Calibration to MetaMask

1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Enter these details:

```
Network Name: Filecoin Calibration
RPC URL: https://api.calibration.node.glif.io/rpc/v1
Chain ID: 314159
Currency Symbol: tFIL
Block Explorer: https://calibration.filscan.io/
```

### Get Test FIL Tokens

1. Visit [Filecoin Calibration Faucet](https://faucet.calibration.fildev.network/)
2. Enter your wallet address
3. Request test FIL tokens (you'll get ~100 tFIL)
4. Wait for confirmation

## Step 4: Deploy Smart Contracts

```bash
# Compile contracts
npm run contracts:compile

# Deploy to Filecoin testnet
npm run contracts:deploy
```

**Expected Output:**
```
✅ KnowledgeMarketplace deployed to: 0x...
✅ ReputationSystem deployed to: 0x...
🎉 Deployment completed successfully!
```

The deployment addresses are automatically saved to:
- `src/utils/deployment.json`
- `src/utils/contracts.json`

## Step 5: Upload Sample Data

```bash
# Upload sample datasets to IPFS (mock mode for demo)
node scripts/upload-sample-data.js --mock
```

This creates sample datasets for testing the marketplace.

## Step 6: Start the Application

```bash
# Start development server
npm run dev
```

Visit **http://localhost:3000** to see your marketplace!

## Step 7: Test the Marketplace

### Connect Your Wallet
1. Click "Connect Wallet" in the top-right
2. Approve the MetaMask connection
3. Ensure you're on Filecoin Calibration network
4. Your tFIL balance should display

### Browse Datasets
- View the 3 sample datasets (Medical, Climate, Financial)
- Click dataset cards to see details
- Notice quality scores, prices, and verification status

### Test Purchase Flow
1. Click "Purchase Access" on any dataset
2. See the professional toast notification
3. Copy the transaction hash if desired
4. **Note**: Currently in demo mode for smooth presentation

### Try the AI Demo
1. Navigate to **http://localhost:3000/ai-demo**
2. Click "Search Datasets" to load available data
3. Select a dataset by clicking on it
4. Try sample queries like:
   - "Analyze patterns in the medical imaging data"
   - "Find temperature trends over the last decade"
5. Execute the query and see AI processing results

## Architecture Overview

```
Your Browser ──► Next.js App ──► Web3 Service ──► Smart Contracts ──► Filecoin
     │              │               │                │                  │
     │              │               │                │                  │
     └──► MetaMask ──┘               └──► IPFS ───────┘                  │
                                                                        │
                                          Filecoin Storage ◄────────────┘
```

## Key Features Working

✅ **Wallet Integration** - MetaMask connected to Filecoin testnet  
✅ **Smart Contracts** - Deployed and verified on blockchain  
✅ **Dataset Marketplace** - Browse, search, and purchase data  
✅ **AI Interface** - Query datasets with provenance tracking  
✅ **IPFS Storage** - Decentralized file storage  
✅ **Economic Incentives** - Payment flows and earnings tracking  

## Development Workflow

### Making Changes
1. **Frontend**: Edit files in `src/components/` or `src/pages/`
2. **Smart Contracts**: Edit files in `contracts/`
3. **API**: Edit files in `src/pages/api/`

### Hot Reload
The development server automatically reloads when you make changes.

### Testing Contracts
```bash
# Test basic contract interaction
node scripts/test-simple-purchase.js

# Register datasets in contract (optional)
npm run contracts:register
```

## Common Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Contracts
npm run contracts:compile    # Compile smart contracts
npm run contracts:deploy     # Deploy to testnet
npm run contracts:register   # Register sample datasets

# Utilities
npm run lint            # Check code quality
npm test               # Run tests
```

## Troubleshooting

### Wallet Won't Connect
- Ensure MetaMask is installed and unlocked
- Verify you're on Filecoin Calibration network
- Try refreshing the page

### Transactions Fail
- Check you have enough tFIL for gas fees
- Verify contract addresses in `src/utils/contracts.json`
- Try increasing gas limit in transaction

### Development Server Issues
- Ensure port 3000 is available
- Check for errors in browser console
- Restart with `npm run dev`

### Contract Deployment Fails
- Verify your private key in `.env`
- Ensure you have sufficient tFIL balance
- Check Filecoin network status

## Next Steps

### For Development
1. **Explore the Code**: Check out `src/components/` and `contracts/`
2. **Read Architecture**: See `docs/ARCHITECTURE.md`
3. **Smart Contract Details**: See `docs/SMART_CONTRACTS.md`

### For Production
1. **Deploy to Mainnet**: Update RPC URLs and get real FIL
2. **Real IPFS**: Configure Infura or Pinata for production IPFS
3. **Domain Setup**: Configure custom domain and SSL

### For AI Integration
1. **SDK Usage**: Check `src/utils/knowledgenet-sdk.ts`
2. **API Reference**: See `docs/API_REFERENCE.md`
3. **Examples**: Look at `/ai-demo` page implementation

## Demo Mode vs Production

**Current Setup (Demo Mode):**
- ✅ Real wallet connection and blockchain interaction
- ✅ Real smart contracts deployed on testnet  
- ✅ Simulated purchases for smooth presentation
- ✅ Professional UX with toast notifications

**For Real Transactions:**
Edit `src/components/DatasetCard.tsx` and uncomment real blockchain calls:
```typescript
// Enable real blockchain transactions
const priceInWei = parsePrice(dataset.price);
const txHash = await purchaseDataset(dataset.id, priceInWei);
```

## Support

- **Documentation**: See `docs/` directory
- **Examples**: Check component implementations
- **Issues**: Create GitHub issues for bugs
- **Community**: Join the PLGenesis Discord

---

🎉 **Congratulations!** You now have a fully functional decentralized AI knowledge marketplace running locally on Filecoin!