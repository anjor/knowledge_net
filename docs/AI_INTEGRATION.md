# AI Model Integration Guide

This guide explains how AI models can integrate with the KnowledgeNet decentralized marketplace to access verified scientific data.

## Quick Start

### 1. Authentication
```typescript
// Set your wallet address for authentication
const requesterAddress = "your_wallet_address";
```

### 2. Query Datasets
```typescript
const response = await fetch('/api/ai/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-requester-address': requesterAddress
  },
  body: JSON.stringify({
    searchTerms: "machine learning training data",
    tags: ["medical", "imaging"],
    format: "json",
    minQualityScore: 80,
    maxPrice: "0.1", // in FIL
    limit: 10
  })
});

const data = await response.json();
console.log(data.datasets); // Array of matching datasets
```

### 3. Purchase Dataset Access
```typescript
// First, purchase through the smart contract
const paymentTx = await marketplace.purchaseDataset(datasetId, {
  value: ethers.parseEther("0.05")
});

// Then request access with payment proof
const accessResponse = await fetch('/api/ai/access', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-requester-address': requesterAddress
  },
  body: JSON.stringify({
    datasetId: "dataset_123",
    paymentProof: paymentTx.hash
  })
});

const accessData = await accessResponse.json();
console.log(accessData.accessKey); // Use this for downloads
```

### 4. Download Dataset
```typescript
const downloadResponse = await fetch(`/api/ai/download/${datasetId}?access_key=${accessKey}`, {
  headers: {
    'x-requester-address': requesterAddress
  }
});

const downloadData = await downloadResponse.json();
console.log(downloadData.data); // The actual dataset
console.log(downloadData.provenanceChain); // Verification chain
```

## Advanced Features

### Data Integrity Validation
```typescript
const validation = await fetch('/api/ai/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    datasetId: "dataset_123",
    expectedHash: "0xabc123..."
  })
});

const validationResult = await validation.json();
if (validationResult.valid && validationResult.provenanceVerified) {
  console.log("Data integrity confirmed");
}
```

### Provenance Tracking
```typescript
const provenance = await fetch(`/api/ai/provenance/${datasetId}`);
const provenanceData = await provenance.json();

// Verify the chain of custody
provenanceData.chain.forEach(link => {
  console.log(`${link.action} by ${link.actor} at ${new Date(link.timestamp)}`);
});
```

### Usage Statistics
```typescript
const stats = await fetch('/api/ai/stats', {
  headers: { 'x-requester-address': requesterAddress }
});

const statsData = await stats.json();
console.log(`Total queries: ${statsData.totalQueries}`);
console.log(`Preferred formats: ${statsData.preferredFormats.join(', ')}`);
```

## Python SDK Example

```python
import requests
import json

class KnowledgeNetClient:
    def __init__(self, base_url, requester_address):
        self.base_url = base_url
        self.requester_address = requester_address
        self.headers = {
            'Content-Type': 'application/json',
            'x-requester-address': requester_address
        }
    
    def query_datasets(self, search_terms, **kwargs):
        """Query datasets for AI training"""
        payload = {
            'searchTerms': search_terms,
            **kwargs
        }
        
        response = requests.post(
            f"{self.base_url}/api/ai/query",
            headers=self.headers,
            data=json.dumps(payload)
        )
        
        return response.json()
    
    def purchase_access(self, dataset_id, payment_proof):
        """Purchase access to a dataset"""
        payload = {
            'datasetId': dataset_id,
            'paymentProof': payment_proof
        }
        
        response = requests.post(
            f"{self.base_url}/api/ai/access",
            headers=self.headers,
            data=json.dumps(payload)
        )
        
        return response.json()
    
    def download_dataset(self, dataset_id, access_key):
        """Download dataset with access key"""
        response = requests.get(
            f"{self.base_url}/api/ai/download/{dataset_id}",
            headers=self.headers,
            params={'access_key': access_key}
        )
        
        return response.json()

# Usage
client = KnowledgeNetClient("http://localhost:3000", "0xYourAddress")

# Search for datasets
results = client.query_datasets(
    "medical imaging data",
    tags=["radiology", "ct-scan"],
    min_quality_score=85
)

# Purchase and download
access = client.purchase_access(dataset_id, payment_tx_hash)
data = client.download_dataset(dataset_id, access['accessKey'])
```

## Best Practices

### 1. Data Verification
Always verify data integrity before using:
```typescript
const isValid = await validateDataIntegrity(datasetId, expectedHash);
if (!isValid) {
  throw new Error("Data integrity check failed");
}
```

### 2. Cost Management
Estimate costs before purchasing:
```typescript
const estimate = await fetch('/api/storage/estimate', {
  method: 'POST',
  body: JSON.stringify({ size: datasetSize, duration: 30 })
});
```

### 3. Batch Processing
Query multiple datasets efficiently:
```typescript
const batchQuery = await Promise.all([
  queryDatasets({ searchTerms: "query1" }),
  queryDatasets({ searchTerms: "query2" }),
  queryDatasets({ searchTerms: "query3" })
]);
```

### 4. Error Handling
Implement robust error handling:
```typescript
try {
  const data = await downloadDataset(datasetId, accessKey);
} catch (error) {
  if (error.message.includes("expired")) {
    // Re-authenticate and retry
  } else if (error.message.includes("limit exceeded")) {
    // Wait or request new access
  } else {
    // Handle other errors
  }
}
```

## Rate Limits and Quotas

- **Query Rate**: 100 queries per hour per address
- **Download Limit**: 5 downloads per access token
- **Token Validity**: 24 hours
- **Concurrent Downloads**: 3 simultaneous downloads

## Data Formats Supported

- **JSON**: Structured data, metadata
- **CSV**: Tabular data, time series
- **Parquet**: Large analytical datasets
- **HDF5**: Scientific data arrays
- **XML**: Structured documents
- **Binary**: Custom formats with metadata

## Troubleshooting

### Common Issues

1. **"Invalid access token"**
   - Check token expiry
   - Verify payment proof
   - Ensure correct dataset ID

2. **"Download limit exceeded"**
   - Request new access token
   - Wait for token refresh

3. **"Data integrity check failed"**
   - Re-download dataset
   - Check network connectivity
   - Verify IPFS availability

### Support

For technical support and integration help:
- GitHub Issues: [Repository Link]
- Discord: [Community Link]
- Documentation: [Docs Link]