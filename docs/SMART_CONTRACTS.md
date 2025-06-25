# Smart Contracts Documentation

## Overview

KnowledgeNet uses two main smart contracts deployed on Filecoin's FVM (Filecoin Virtual Machine) to create a decentralized marketplace for AI training data.

## Contract Addresses (Filecoin Calibration Testnet)

- **KnowledgeMarketplace**: `0xc0322d66e1a2d334419e04c98Aa127F1E83087fC`
- **ReputationSystem**: `0x9b72e52503C0528BD92F3DE78FA83CcaB97d0F86`

## KnowledgeMarketplace Contract

The core marketplace contract that handles dataset registration, purchases, and access control.

### Data Structures

#### Dataset
```solidity
struct Dataset {
    string id;              // Unique dataset identifier
    string ipfsHash;        // IPFS content hash
    string metadataHash;    // Metadata IPFS hash
    address contributor;    // Dataset owner
    uint256 price;          // Price in wei (FIL)
    uint256 qualityScore;   // Quality score (0-100)
    uint256 downloadCount;  // Number of purchases
    uint256 earnings;       // Total earnings for contributor
    bool verified;          // Validation status
    uint256 timestamp;      // Registration timestamp
}
```

#### Download
```solidity
struct Download {
    string datasetId;       // Dataset identifier
    address buyer;          // Purchaser address
    uint256 amount;         // Amount paid
    uint256 timestamp;      // Purchase timestamp
}
```

### Key Functions

#### submitDataset
Register a new dataset in the marketplace.

```solidity
function submitDataset(
    string memory _id,
    string memory _ipfsHash,
    string memory _metadataHash,
    uint256 _price
) external nonReentrant
```

**Parameters:**
- `_id`: Unique identifier for the dataset
- `_ipfsHash`: IPFS hash where dataset is stored
- `_metadataHash`: IPFS hash containing dataset metadata
- `_price`: Price in wei (1 FIL = 10^18 wei)

**Requirements:**
- Dataset ID must be unique
- IPFS hash must be provided
- Price must be greater than 0

**Events Emitted:**
- `DatasetSubmitted(datasetId, contributor, ipfsHash)`

#### purchaseDataset
Purchase access to a dataset.

```solidity
function purchaseDataset(string memory _datasetId) 
    external 
    payable 
    nonReentrant
```

**Parameters:**
- `_datasetId`: ID of the dataset to purchase

**Requirements:**
- Dataset must exist and be verified
- Payment must equal dataset price
- Buyer cannot be the dataset contributor

**Payment Distribution:**
- 93% to dataset contributor
- 5% to validators (via ReputationSystem)
- 2% platform fee

**Events Emitted:**
- `DatasetPurchased(datasetId, buyer, amount)`

#### hasAccess
Check if a user has access to a specific dataset.

```solidity
function hasAccess(string memory _datasetId, address _user) 
    external 
    view 
    returns (bool)
```

**Returns:** `true` if user has purchased access or is the contributor

#### getDataset
Retrieve dataset information.

```solidity
function getDataset(string memory _datasetId) 
    external 
    view 
    returns (Dataset memory)
```

**Returns:** Complete dataset struct

#### getTotalDatasets
Get the total number of registered datasets.

```solidity
function getTotalDatasets() external view returns (uint256)
```

#### getDatasetsByContributor
Get all dataset IDs contributed by a specific address.

```solidity
function getDatasetsByContributor(address _contributor) 
    external 
    view 
    returns (string[] memory)
```

### Events

```solidity
event DatasetSubmitted(
    string indexed datasetId, 
    address indexed contributor, 
    string ipfsHash
);

event DatasetVerified(
    string indexed datasetId, 
    address indexed validator, 
    uint256 qualityScore
);

event DatasetPurchased(
    string indexed datasetId, 
    address indexed buyer, 
    uint256 amount
);

event EarningsClaimed(
    address indexed user, 
    uint256 amount
);
```

## ReputationSystem Contract

Manages data validation, quality scoring, and contributor reputation.

### Data Structures

#### Validator
```solidity
struct Validator {
    address validatorAddress;  // Validator's address
    uint256 stakedAmount;     // Amount staked in wei
    uint256 reputation;       // Reputation score
    uint256 validationsCount; // Number of validations performed
    uint256 rewards;          // Total rewards earned
    bool active;              // Active status
}
```

#### Badge
```solidity
struct Badge {
    string name;              // Badge name
    string description;       // Badge description
    string criteria;          // Earning criteria
    uint256 rewardAmount;     // Reward for earning badge
}
```

### Key Functions

#### registerValidator
Become a validator by staking FIL.

```solidity
function registerValidator() external payable
```

**Requirements:**
- Must stake at least `VALIDATION_STAKE` (1 FIL)
- Cannot already be a registered validator

#### validateDataset
Submit a quality validation for a dataset.

```solidity
function validateDataset(
    string memory _datasetId,
    uint256 _qualityScore,
    string memory _comments
) external payable
```

**Parameters:**
- `_datasetId`: Dataset to validate
- `_qualityScore`: Quality score (0-100)
- `_comments`: Validation comments

**Requirements:**
- Must be a registered validator
- Must stake additional FIL for validation
- Quality score must be 0-100

#### getUserReputation
Get reputation information for a user.

```solidity
function getUserReputation(address _user) 
    external 
    view 
    returns (
        uint256 score,
        uint256 validationsCount,
        uint256 totalEarnings,
        bool isValidator
    )
```

#### getUserBadges
Get all badges earned by a user.

```solidity
function getUserBadges(address _user) 
    external 
    view 
    returns (string[] memory)
```

### Pre-defined Badges

The system includes several badges that users can earn:

1. **PIONEER** - "Early adopter of the platform"
2. **VALIDATOR** - "Performed dataset validations"
3. **CONTRIBUTOR** - "Contributed datasets to the marketplace"
4. **QUALITY_LEADER** - "Maintained high quality standards"
5. **TOP_EARNER** - "Earned significant rewards"

## Interaction Examples

### JavaScript/TypeScript Integration

#### Setup
```typescript
import { ethers } from 'ethers';
import contractsInfo from './contracts.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const marketplace = new ethers.Contract(
  contractsInfo.KnowledgeMarketplace.address,
  contractsInfo.KnowledgeMarketplace.abi,
  signer
);
```

#### Submit a Dataset
```typescript
const submitDataset = async () => {
  const tx = await marketplace.submitDataset(
    "my-dataset-001",
    "QmYourIPFSHashHere...",
    "QmMetadataHashHere...",
    ethers.utils.parseEther("0.1") // 0.1 FIL
  );
  
  await tx.wait();
  console.log("Dataset submitted!");
};
```

#### Purchase a Dataset
```typescript
const purchaseDataset = async (datasetId: string, price: string) => {
  const tx = await marketplace.purchaseDataset(datasetId, {
    value: price
  });
  
  await tx.wait();
  console.log("Dataset purchased!");
};
```

#### Check Access
```typescript
const checkAccess = async (datasetId: string, userAddress: string) => {
  const hasAccess = await marketplace.hasAccess(datasetId, userAddress);
  return hasAccess;
};
```

#### Listen for Events
```typescript
// Listen for new dataset submissions
marketplace.on("DatasetSubmitted", (datasetId, contributor, ipfsHash) => {
  console.log(`New dataset: ${datasetId} by ${contributor}`);
});

// Listen for purchases
marketplace.on("DatasetPurchased", (datasetId, buyer, amount) => {
  console.log(`Dataset ${datasetId} purchased for ${ethers.utils.formatEther(amount)} FIL`);
});
```

### Using the KnowledgeNet SDK

```typescript
import { createKnowledgeNetClient } from './knowledgenet-sdk';

const client = createKnowledgeNetClient({
  apiKey: 'your-api-key',
  userAddress: '0xYourAddress'
});

// Search datasets
const datasets = await client.searchDatasets({
  tags: ['medical'],
  verified: true,
  maxPrice: '0.1'
});

// Query a dataset
const result = await client.queryDataset(
  'dataset_001', 
  'Find anomalies in the medical imaging data'
);
```

## Gas Considerations

### Typical Gas Costs (Filecoin Calibration)
- **submitDataset**: ~1,200,000 gas
- **purchaseDataset**: ~150,000 gas
- **validateDataset**: ~200,000 gas
- **registerValidator**: ~100,000 gas

### Gas Optimization Tips
1. Use batch operations when possible
2. Set reasonable gas limits (2M for complex operations)
3. Monitor gas prices on the network
4. Consider using multicall for multiple operations

## Security Features

### Access Control
- Only dataset contributors can modify their datasets
- Only registered validators can perform validations
- Owner-only functions for emergency management

### Economic Security
- Validator staking requirements prevent spam
- Payment splitting ensures fair compensation
- Slashing mechanisms for malicious behavior

### Technical Security
- ReentrancyGuard on all payable functions
- Input validation on all parameters
- Event logging for transparency and debugging

## Error Messages

Common error messages you might encounter:

- `"Dataset ID required"` - Empty dataset ID provided
- `"Dataset already exists"` - Attempting to register duplicate dataset
- `"Dataset does not exist"` - Referencing non-existent dataset
- `"Price must be greater than 0"` - Invalid price parameter
- `"Insufficient payment"` - Payment doesn't match dataset price
- `"Access denied"` - User doesn't have access to dataset
- `"Not a validator"` - Attempting validator-only operation without registration

## Upgradeability

The contracts use a proxy pattern for upgradeability:
- Logic contracts can be upgraded by the owner
- Data storage remains persistent across upgrades
- Users are notified of upgrades through events

## Testing

See `test/` directory for comprehensive test suites covering:
- Dataset lifecycle (submit → validate → purchase)
- Validator registration and staking
- Payment distribution and earnings
- Access control and permissions
- Error conditions and edge cases