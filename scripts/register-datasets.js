const { ethers } = require("ethers");
require('dotenv').config();

// Load contract info
const contractsInfo = require('../src/utils/contracts.json');

async function main() {
  console.log("🔄 Registering sample datasets in the KnowledgeMarketplace contract...\n");

  // Create provider and wallet
  const provider = new ethers.JsonRpcProvider("https://api.calibration.node.glif.io/rpc/v1");
  const deployer = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
  
  console.log("Deployer address:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.formatEther(balance), "tFIL\n");

  // Connect to the deployed contract
  const marketplace = new ethers.Contract(
    contractsInfo.KnowledgeMarketplace.address,
    contractsInfo.KnowledgeMarketplace.abi,
    deployer
  );

  // Sample datasets to register (matching our frontend data)
  const datasetsToRegister = [
    {
      id: "dataset_001",
      ipfsHash: "QmMockabcdef123456789abcdef123456789abcdef12345671",
      metadataHash: "QmMetadata001...",
      price: ethers.parseEther("0.05"), // 0.05 FIL
      metadata: {
        name: "Medical Image Dataset",
        description: "Curated collection of medical imaging data for AI training",
        tags: ["medical", "imaging", "ai-training"],
        format: "json",
        size: 1024000,
        license: "CC-BY-4.0"
      }
    },
    {
      id: "dataset_002", 
      ipfsHash: "QmMockabcdef123456789abcdef123456789abcdef12345672",
      metadataHash: "QmMetadata002...",
      price: ethers.parseEther("0.03"), // 0.03 FIL
      metadata: {
        name: "Climate Data Collection",
        description: "Global climate measurements and predictions",
        tags: ["climate", "environmental", "science"],
        format: "csv",
        size: 2048000,
        license: "Open Data"
      }
    },
    {
      id: "dataset_003",
      ipfsHash: "QmMockabcdef123456789abcdef123456789abcdef12345673", 
      metadataHash: "QmMetadata003...",
      price: ethers.parseEther("0.1"), // 0.1 FIL
      metadata: {
        name: "Financial Market Data",
        description: "Real-time and historical financial market data",
        tags: ["finance", "trading", "time-series"],
        format: "parquet",
        size: 512000,
        license: "Commercial"
      }
    }
  ];

  console.log("📝 Registering datasets:\n");

  for (const dataset of datasetsToRegister) {
    try {
      console.log(`Registering: ${dataset.metadata.name}`);
      console.log(`  ID: ${dataset.id}`);
      console.log(`  Price: ${ethers.formatEther(dataset.price)} FIL`);
      console.log(`  IPFS: ${dataset.ipfsHash}`);

      // Check if dataset already exists
      try {
        const existingDataset = await marketplace.datasets(dataset.id);
        if (existingDataset.contributor !== "0x0000000000000000000000000000000000000000") {
          console.log("  ⚠️  Dataset already exists, skipping...\n");
          continue;
        }
      } catch (error) {
        // Dataset doesn't exist, continue with registration
      }

      // Submit the dataset
      const tx = await marketplace.submitDataset(
        dataset.id,
        dataset.ipfsHash,
        dataset.metadataHash,
        dataset.price,
        { gasLimit: 25000000 } // Proper gas limit for Filecoin (25M)
      );

      console.log(`  📤 Transaction sent: ${tx.hash}`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`  ✅ Confirmed in block: ${receipt.blockNumber}`);
      console.log(`  💰 Gas used: ${Number(receipt.gasUsed)}\n`);

    } catch (error) {
      console.error(`  ❌ Failed to register ${dataset.id}:`, error.message);
      console.log("");
    }
  }

  // Verify registration
  console.log("🔍 Verifying dataset registrations:\n");
  
  for (const dataset of datasetsToRegister) {
    try {
      const registeredDataset = await marketplace.datasets(dataset.id);
      
      if (registeredDataset.contributor === "0x0000000000000000000000000000000000000000") {
        console.log(`❌ ${dataset.id}: Not registered`);
      } else {
        console.log(`✅ ${dataset.id}: Registered`);
        console.log(`   Contributor: ${registeredDataset.contributor}`);
        console.log(`   Price: ${ethers.formatEther(registeredDataset.price)} FIL`);
        console.log(`   IPFS: ${registeredDataset.ipfsHash}`);
        console.log(`   Verified: ${registeredDataset.verified}`);
        console.log("");
      }
    } catch (error) {
      console.log(`❌ ${dataset.id}: Error checking status - ${error.message}`);
    }
  }

  // Check total datasets
  const totalDatasets = await marketplace.getTotalDatasets();
  console.log(`📊 Total datasets in marketplace: ${Number(totalDatasets)}\n`);

  console.log("🎉 Dataset registration completed!");
  console.log("You can now test real blockchain purchases in the frontend!");
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Registration failed:", error);
    process.exit(1);
  });