const fs = require('fs');
const path = require('path');

// Sample dataset files
const sampleDatasets = [
  {
    id: 'dataset_001',
    name: 'Medical Image Dataset',
    description: 'Curated collection of medical imaging data for AI training',
    tags: ['medical', 'imaging', 'ai-training'],
    format: 'json',
    license: 'CC-BY-4.0',
    data: {
      type: 'medical_imaging',
      images: [
        {
          id: 'img_001',
          type: 'x-ray',
          body_part: 'chest',
          diagnosis: 'normal',
          metadata: {
            age: 45,
            gender: 'F',
            resolution: '512x512',
            format: 'DICOM'
          }
        },
        {
          id: 'img_002',
          type: 'x-ray', 
          body_part: 'chest',
          diagnosis: 'pneumonia',
          metadata: {
            age: 62,
            gender: 'M',
            resolution: '512x512',
            format: 'DICOM'
          }
        },
        {
          id: 'img_003',
          type: 'mri',
          body_part: 'brain',
          diagnosis: 'normal',
          metadata: {
            age: 34,
            gender: 'F',
            resolution: '256x256x128',
            format: 'NIfTI'
          }
        }
      ],
      statistics: {
        total_images: 1024,
        normal_cases: 512,
        abnormal_cases: 512,
        image_formats: ['DICOM', 'NIfTI', 'PNG'],
        body_parts: ['chest', 'brain', 'abdomen']
      },
      quality_metrics: {
        image_quality_score: 92,
        annotation_accuracy: 96,
        inter_rater_agreement: 0.94
      }
    }
  },
  {
    id: 'dataset_002', 
    name: 'Climate Data Collection',
    description: 'Global climate measurements and predictions',
    tags: ['climate', 'environmental', 'science'],
    format: 'csv',
    license: 'Open Data',
    data: {
      type: 'climate_measurements',
      measurements: [
        {
          station_id: 'STATION_001',
          location: { lat: 40.7128, lon: -74.0060, elevation: 10 },
          date: '2024-01-01',
          temperature_c: 8.5,
          humidity_percent: 67,
          pressure_hpa: 1013.2,
          wind_speed_ms: 4.2,
          precipitation_mm: 0
        },
        {
          station_id: 'STATION_002',
          location: { lat: 51.5074, lon: -0.1278, elevation: 25 },
          date: '2024-01-01',
          temperature_c: 12.1,
          humidity_percent: 72,
          pressure_hpa: 1015.8,
          wind_speed_ms: 6.1,
          precipitation_mm: 2.3
        }
      ],
      statistics: {
        total_stations: 2048,
        date_range: '2020-01-01 to 2024-12-31',
        measurements_per_day: 2048,
        total_measurements: 3744768,
        coverage: 'Global'
      },
      quality_metrics: {
        data_completeness: 88,
        sensor_accuracy: 95,
        calibration_status: 'Current'
      }
    }
  },
  {
    id: 'dataset_003',
    name: 'Financial Market Data',
    description: 'Real-time and historical financial market data',
    tags: ['finance', 'trading', 'time-series'],
    format: 'parquet',
    license: 'Commercial',
    data: {
      type: 'financial_timeseries',
      markets: [
        {
          symbol: 'BTC-USD',
          date: '2024-01-01',
          open: 42150.32,
          high: 42890.45,
          low: 41845.12,
          close: 42445.67,
          volume: 28945123456,
          market_cap: 830000000000
        },
        {
          symbol: 'ETH-USD',
          date: '2024-01-01',
          open: 2235.78,
          high: 2298.34,
          low: 2198.45,
          close: 2267.12,
          volume: 15678234567,
          market_cap: 270000000000
        }
      ],
      statistics: {
        total_symbols: 1024,
        date_range: '2020-01-01 to 2024-12-31',
        data_frequency: '1-minute',
        total_records: 2678400000,
        asset_classes: ['crypto', 'stocks', 'forex', 'commodities']
      },
      quality_metrics: {
        data_accuracy: 95,
        latency_ms: 12,
        uptime_percent: 99.9
      }
    }
  }
];

async function uploadSampleData() {
  console.log('📦 Uploading sample datasets to IPFS...\n');
  
  const uploadedDatasets = [];

  for (const dataset of sampleDatasets) {
    try {
      console.log(`Uploading ${dataset.name}...`);
      
      // Convert dataset to JSON string
      const dataString = JSON.stringify(dataset.data, null, 2);
      const dataBuffer = Buffer.from(dataString);
      
      // Add to IPFS
      const result = await ipfs.add({
        path: `${dataset.id}.json`,
        content: dataBuffer
      });
      
      const ipfsHash = result.cid.toString();
      
      uploadedDatasets.push({
        ...dataset,
        ipfsHash,
        size: dataBuffer.length,
        uploadTimestamp: Date.now()
      });
      
      console.log(`✅ Uploaded ${dataset.name}`);
      console.log(`   IPFS Hash: ${ipfsHash}`);
      console.log(`   Size: ${dataBuffer.length} bytes\n`);
      
    } catch (error) {
      console.error(`❌ Failed to upload ${dataset.name}:`, error.message);
    }
  }
  
  // Save upload results
  const outputPath = path.join(__dirname, '../src/utils/uploaded-datasets.json');
  fs.writeFileSync(outputPath, JSON.stringify(uploadedDatasets, null, 2));
  
  console.log('📋 Upload Summary:');
  console.log('=================');
  console.log(`Total datasets uploaded: ${uploadedDatasets.length}`);
  console.log(`Results saved to: ${outputPath}`);
  
  uploadedDatasets.forEach(dataset => {
    console.log(`${dataset.name}: ${dataset.ipfsHash}`);
  });
  
  return uploadedDatasets;
}

// For local testing without real IPFS upload
async function createMockUpload() {
  console.log('🔄 Creating mock IPFS upload for demo...\n');
  
  const mockDatasets = sampleDatasets.map((dataset, index) => ({
    ...dataset,
    ipfsHash: `QmMock${String(index + 1).padStart(44, 'abcdef123456789')}`,
    size: JSON.stringify(dataset.data).length,
    uploadTimestamp: Date.now()
  }));
  
  // Save mock results
  const outputPath = path.join(__dirname, '../src/utils/uploaded-datasets.json');
  fs.writeFileSync(outputPath, JSON.stringify(mockDatasets, null, 2));
  
  console.log('📋 Mock Upload Summary:');
  console.log('======================');
  console.log(`Total mock datasets: ${mockDatasets.length}`);
  console.log(`Results saved to: ${outputPath}`);
  
  mockDatasets.forEach(dataset => {
    console.log(`${dataset.name}: ${dataset.ipfsHash}`);
  });
  
  return mockDatasets;
}

// Main execution
if (require.main === module) {
  const useMock = process.argv.includes('--mock');
  
  if (useMock) {
    createMockUpload()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Mock upload failed:', error);
        process.exit(1);
      });
  } else {
    uploadSampleData()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Upload failed:', error);
        console.log('\n💡 Tip: Use --mock flag for local testing without IPFS');
        process.exit(1);
      });
  }
}

module.exports = { uploadSampleData, createMockUpload };