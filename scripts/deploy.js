const { ethers } = require("ethers");
require('dotenv').config();

async function main() {
  console.log("Deploying KnowledgeNet contracts to Filecoin network...");

  // Create provider and wallet
  const provider = new ethers.JsonRpcProvider("https://api.calibration.node.glif.io/rpc/v1");
  const deployer = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
  
  console.log("Deploying contracts with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.formatEther(balance), "tFIL");

  try {
    // Load contract artifacts
    const marketplaceArtifact = require('../artifacts/contracts/KnowledgeMarketplace.sol/KnowledgeMarketplace.json');
    const reputationArtifact = require('../artifacts/contracts/ReputationSystem.sol/ReputationSystem.json');
    
    // Deploy KnowledgeMarketplace contract
    console.log("\n1. Deploying KnowledgeMarketplace...");
    const MarketplaceFactory = new ethers.ContractFactory(marketplaceArtifact.abi, marketplaceArtifact.bytecode, deployer);
    const marketplace = await MarketplaceFactory.deploy();
    await marketplace.waitForDeployment();
    
    console.log("✅ KnowledgeMarketplace deployed to:", await marketplace.getAddress());

    // Deploy ReputationSystem contract
    console.log("\n2. Deploying ReputationSystem...");
    const ReputationFactory = new ethers.ContractFactory(reputationArtifact.abi, reputationArtifact.bytecode, deployer);
    const reputation = await ReputationFactory.deploy(marketplace.address);
    await reputation.waitForDeployment();
    
    console.log("✅ ReputationSystem deployed to:", await reputation.getAddress());

    // Verify deployment by calling a read function
    console.log("\n3. Verifying deployments...");
    const totalDatasets = await marketplace.getTotalDatasets();
    console.log("✅ Marketplace total datasets:", totalDatasets.toString());

    const pioneerBadge = await reputation.badges("PIONEER");
    console.log("✅ Reputation system Pioneer badge:", pioneerBadge.name);

    // Save deployment info
    const deploymentInfo = {
      network: "filecoin-calibration",
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: {
        KnowledgeMarketplace: {
          address: await marketplace.getAddress(),
          transactionHash: marketplace.deploymentTransaction()?.hash
        },
        ReputationSystem: {
          address: await reputation.getAddress(),
          transactionHash: reputation.deploymentTransaction()?.hash
        }
      }
    };

    console.log("\n4. Deployment Summary:");
    console.log("=====================================");
    console.log("Network: Filecoin Calibration Testnet");
    console.log("Deployer:", deployer.address);
    console.log("KnowledgeMarketplace:", await marketplace.getAddress());
    console.log("ReputationSystem:", await reputation.getAddress());
    console.log("=====================================");

    // Save to file for frontend integration
    const fs = require('fs');
    const path = require('path');
    
    const deploymentPath = path.join(__dirname, '../src/utils/deployment.json');
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log("✅ Deployment info saved to:", deploymentPath);

    // Contract ABIs already loaded above
    
    const abiInfo = {
      KnowledgeMarketplace: {
        address: await marketplace.getAddress(),
        abi: marketplaceArtifact.abi
      },
      ReputationSystem: {
        address: await reputation.getAddress(),
        abi: reputationArtifact.abi
      }
    };

    const abiPath = path.join(__dirname, '../src/utils/contracts.json');
    fs.writeFileSync(abiPath, JSON.stringify(abiInfo, null, 2));
    console.log("✅ Contract ABIs saved to:", abiPath);

    console.log("\n🎉 Deployment completed successfully!");
    console.log("Your KnowledgeNet marketplace is now live on Filecoin!");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment script failed:", error);
    process.exit(1);
  });