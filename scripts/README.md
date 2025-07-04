# PLGenesis Scripts

Essential scripts for managing the KnowledgeNet marketplace.

## Setup Scripts
- `check-balance.js` - Check wallet balance on Filecoin Calibration testnet
- `test-connection.js` - Test connection to Filecoin network
- `generate-wallet.js` - Generate new wallet for development

## Deployment Scripts
- `deploy.js` - Deploy smart contracts to Filecoin testnet
- `deploy-reputation.js` - Deploy reputation system contract

## Dataset Management
- `register-datasets.js` - Register sample datasets in the marketplace
- `upload-sample-data.js` - Upload sample data to IPFS
- `dataset-utils.js` - Unified utility for dataset operations

## Usage Examples

### Check dataset status
```bash
node scripts/dataset-utils.js check dataset_001
```

### Validate a dataset
```bash
node scripts/dataset-utils.js validate dataset_001 85
```

### Test purchase
```bash
node scripts/dataset-utils.js purchase dataset_001
```

### Check wallet balance
```bash
node scripts/check-balance.js
```

## Environment Setup
Make sure you have `.env` with:
```
PRIVATE_KEY=your_private_key_without_0x_prefix
```