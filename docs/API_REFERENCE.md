# KnowledgeNet API Reference

The KnowledgeNet API provides programmatic access to the decentralized AI knowledge marketplace, enabling AI models to search, access, and query verified scientific datasets.

## Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## Authentication

All API requests require an API key passed in the `Authorization` header:

```http
Authorization: Bearer your-api-key-here
```

## Rate Limiting

- **100 requests per minute** per API key
- **1000 dataset queries per day** per API key
- Headers included in responses:
  - `X-RateLimit-Limit`: Request limit per window
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Reset time as Unix timestamp

## Endpoints

### Dataset Discovery

#### GET /api/ai-interface/datasets

Search and filter available datasets in the marketplace.

**Query Parameters:**
```typescript
interface DatasetSearchParams {
  tags?: string[];          // Filter by tags (e.g., "medical,imaging")
  format?: string;          // Data format (e.g., "json", "csv", "parquet")
  minQualityScore?: number; // Minimum quality score (0-100)
  maxPrice?: string;        // Maximum price in FIL
  verified?: boolean;       // Only verified datasets
  limit?: number;           // Results per page (default: 10, max: 100)
  offset?: number;          // Pagination offset (default: 0)
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/ai-interface/datasets?tags=medical,imaging&verified=true&limit=5" \
  -H "Authorization: Bearer your-api-key"
```

**Response:**
```json
{
  "success": true,
  "datasets": [
    {
      "id": "dataset_001",
      "metadata": {
        "name": "Medical Image Dataset",
        "description": "Curated collection of medical imaging data for AI training",
        "tags": ["medical", "imaging", "ai-training"],
        "format": "json",
        "size": 1024000,
        "license": "CC-BY-4.0"
      },
      "ipfsHash": "QmExample1...",
      "contributor": "0x40696c3503CD8248da4b0bF9d02432Dc22ec274A",
      "price": "0.05",
      "downloadCount": 156,
      "qualityScore": 92,
      "verified": true,
      "timestamp": 1703123456789
    }
  ],
  "total": 3,
  "metadata": {
    "page": 1,
    "limit": 5,
    "total_pages": 1
  }
}
```

### Dataset Access

#### POST /api/ai-interface/access

Request access to a dataset (handles purchase if needed).

**Request Body:**
```json
{
  "datasetId": "dataset_001",
  "userAddress": "0xYourWalletAddress",
  "duration": 30
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": 1703209856789,
  "cost": "0.05",
  "transactionHash": "0xabc123..."
}
```

### AI Query Processing

#### POST /api/ai-interface/query

Query a dataset with AI processing and provenance tracking.

**Request Body:**
```json
{
  "datasetId": "dataset_001",
  "query": "Analyze patterns in the medical imaging data",
  "apiKey": "your-api-key",
  "userId": "0xYourWalletAddress"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "medical_analysis",
    "query": "Analyze patterns in the medical imaging data",
    "results": [
      {
        "finding": "Pattern detected in medical imaging data",
        "confidence": 0.92,
        "data_points": 156,
        "source": "QmExample1..."
      }
    ],
    "summary": "Analyzed medical dataset for: Analyze patterns in the medical imaging data",
    "accuracy_metrics": {
      "precision": 0.94,
      "recall": 0.89,
      "f1_score": 0.91
    }
  },
  "usage": {
    "tokensUsed": 42,
    "cost": "0.001"
  },
  "provenance": {
    "datasetId": "dataset_001",
    "ipfsHash": "QmExample1...",
    "contributor": "0x40696c3503CD8248da4b0bF9d02432Dc22ec274A",
    "verified": true,
    "timestamp": 1703123456789
  }
}
```

### Usage Analytics

#### GET /api/ai-interface/usage

Get usage statistics and billing information.

**Query Parameters:**
```typescript
interface UsageParams {
  userAddress?: string;     // Filter by user address
  datasetId?: string;       // Filter by dataset
  timeRange?: 'day' | 'week' | 'month' | 'year'; // Time window
}
```

**Response:**
```json
{
  "success": true,
  "usage": {
    "totalQueries": 1247,
    "totalCost": "3.45",
    "datasetAccess": 5,
    "avgResponseTime": 342,
    "topDatasets": [
      {
        "datasetId": "dataset_001",
        "name": "Medical Image Dataset",
        "queries": 498,
        "cost": "1.38"
      }
    ],
    "timeline": [
      {
        "date": "2024-01-01",
        "queries": 45,
        "cost": "0.12"
      }
    ]
  }
}
```

## SDK Integration

### TypeScript/JavaScript SDK

Install the KnowledgeNet SDK:

```bash
npm install knowledgenet-sdk
```

**Basic Usage:**
```typescript
import { createKnowledgeNetClient } from 'knowledgenet-sdk';

const client = createKnowledgeNetClient({
  baseUrl: 'http://localhost:3000',
  apiKey: 'your-api-key',
  userAddress: '0xYourWalletAddress'
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
  'Find anomalies in the imaging data'
);

// Get usage stats
const usage = await client.getUsageStats('month');
```

### Python SDK (Conceptual)

```python
from knowledgenet import KnowledgeNetClient

client = KnowledgeNetClient(
    api_key='your-api-key',
    user_address='0xYourWalletAddress'
)

# Search datasets
datasets = client.search_datasets(
    tags=['medical'],
    verified=True,
    max_price='0.1'
)

# Query dataset
result = client.query_dataset(
    'dataset_001',
    'Find anomalies in the imaging data'
)
```

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error context"
  }
}
```

**Common Error Codes:**
- `INVALID_API_KEY` (401) - API key is missing or invalid
- `DATASET_NOT_FOUND` (404) - Dataset doesn't exist
- `ACCESS_DENIED` (403) - User doesn't have access to dataset
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests
- `INVALID_QUERY` (400) - Query format is invalid
- `INSUFFICIENT_BALANCE` (402) - Not enough FIL for purchase

## Webhook Events

Subscribe to real-time events via webhooks:

**Event Types:**
- `dataset.registered` - New dataset added
- `dataset.purchased` - Dataset access purchased
- `dataset.queried` - Dataset queried by AI model
- `user.badge_earned` - User earned a new badge

**Webhook Payload:**
```json
{
  "event": "dataset.purchased",
  "timestamp": 1703123456789,
  "data": {
    "datasetId": "dataset_001",
    "buyer": "0xBuyerAddress",
    "price": "0.05",
    "transactionHash": "0xabc123..."
  }
}
```

## Data Formats

### Supported Dataset Formats

| Format | Description | Use Cases |
|--------|-------------|-----------|
| JSON | Structured data with metadata | APIs, configurations, small datasets |
| CSV | Comma-separated values | Tabular data, time series |
| Parquet | Columnar storage format | Large datasets, analytics |
| HDF5 | Hierarchical data format | Scientific data, arrays |
| DICOM | Medical imaging standard | Medical imaging data |
| NetCDF | Network Common Data Form | Climate and geospatial data |

### Metadata Schema

All datasets include standardized metadata:

```json
{
  "name": "Dataset name",
  "description": "Detailed description",
  "tags": ["tag1", "tag2"],
  "format": "json",
  "size": 1024000,
  "license": "CC-BY-4.0",
  "version": "1.0.0",
  "created": "2024-01-01T00:00:00Z",
  "updated": "2024-01-01T00:00:00Z",
  "schema": {
    "fields": [
      {
        "name": "field1",
        "type": "string",
        "description": "Field description"
      }
    ]
  },
  "provenance": {
    "source": "Original data source",
    "methodology": "Data collection methodology",
    "validation": "Validation process"
  }
}
```

## Best Practices

### API Usage
1. **Cache responses** when possible to reduce API calls
2. **Use pagination** for large dataset searches
3. **Implement exponential backoff** for rate-limited requests
4. **Validate data** before processing query results

### Query Optimization
1. **Be specific** in queries for better results
2. **Use relevant tags** when searching datasets
3. **Consider price vs. quality** trade-offs
4. **Batch similar queries** when possible

### Security
1. **Keep API keys secure** - never expose in client-side code
2. **Use HTTPS** for all API requests
3. **Validate webhook signatures** if using webhooks
4. **Monitor usage** for unusual patterns

## Examples

### Medical AI Use Case
```typescript
// Search for medical imaging datasets
const medicalDatasets = await client.searchDatasets({
  tags: ['medical', 'imaging'],
  format: 'json',
  verified: true,
  minQualityScore: 90
});

// Query for specific medical conditions
const diagnosisResult = await client.queryDataset(
  medicalDatasets[0].id,
  'Identify potential pneumonia indicators in chest X-rays'
);

// Process results for medical AI model
const indicators = diagnosisResult.data.results.map(r => ({
  finding: r.finding,
  confidence: r.confidence,
  location: r.anatomical_location
}));
```

### Climate Research Use Case
```typescript
// Find climate datasets
const climateData = await client.searchDatasets({
  tags: ['climate', 'temperature'],
  format: 'csv',
  maxPrice: '0.05'
});

// Analyze temperature trends
const trendAnalysis = await client.queryDataset(
  climateData[0].id,
  'Calculate global temperature trends over the last 50 years'
);
```

### Financial Analysis Use Case
```typescript
// Search financial datasets
const financialData = await client.searchDatasets({
  tags: ['finance', 'trading'],
  format: 'parquet'
});

// Market correlation analysis
const correlation = await client.queryDataset(
  financialData[0].id,
  'Calculate correlation between cryptocurrency prices and traditional markets'
);
```