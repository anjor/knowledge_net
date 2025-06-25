const { ethers } = require("ethers");
require('dotenv').config();

async function main() {
  console.log("Deploying ReputationSystem contract...");

  // Create provider and wallet
  const provider = new ethers.providers.JsonRpcProvider("https://api.calibration.node.glif.io/rpc/v1");
  const deployer = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
  
  console.log("Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "tFIL");

  try {
    // Marketplace address from previous deployment
    const marketplaceAddress = "0x4387030f7e1715627C960f084bD86889672503B6";
    
    // Load contract artifact
    const reputationArtifact = require('../artifacts/contracts/ReputationSystem.sol/ReputationSystem.json');
    
    // Deploy ReputationSystem contract
    console.log("Deploying ReputationSystem...");
    const ReputationFactory = new ethers.ContractFactory(reputationArtifact.abi, reputationArtifact.bytecode, deployer);
    const reputation = await ReputationFactory.deploy(marketplaceAddress);
    await reputation.deployed();
    
    console.log("✅ ReputationSystem deployed to:", reputation.address);

    // Verify deployment
    const pioneerBadge = await reputation.badges("PIONEER");
    console.log("✅ Pioneer badge verified:", pioneerBadge.name);

    // Create deployment summary
    const deploymentInfo = {
      network: "filecoin-calibration",
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: {
        KnowledgeMarketplace: {
          address: marketplaceAddress
        },
        ReputationSystem: {
          address: reputation.address,
          transactionHash: reputation.deployTransaction?.hash
        }
      }
    };

    console.log("\n🎉 Deployment Summary:");
    console.log("=====================================");
    console.log("Network: Filecoin Calibration Testnet");
    console.log("Deployer:", deployer.address);
    console.log("KnowledgeMarketplace:", marketplaceAddress);
    console.log("ReputationSystem:", reputation.address);
    console.log("=====================================");

    // Save deployment info
    const fs = require('fs');
    const path = require('path');
    
    const deploymentPath = path.join(__dirname, '../src/utils/deployment.json');
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log("✅ Deployment info saved to:", deploymentPath);

    // Save contract ABIs
    const marketplaceArtifact = require('../artifacts/contracts/KnowledgeMarketplace.sol/KnowledgeMarketplace.json');
    
    const abiInfo = {
      KnowledgeMarketplace: {
        address: marketplaceAddress,
        abi: marketplaceArtifact.abi
      },
      ReputationSystem: {
        address: reputation.address,
        abi: reputationArtifact.abi
      }
    };

    const abiPath = path.join(__dirname, '../src/utils/contracts.json');
    fs.writeFileSync(abiPath, JSON.stringify(abiInfo, null, 2));
    console.log("✅ Contract ABIs saved to:", abiPath);

    console.log("\n🚀 KnowledgeNet is now LIVE on Filecoin!");
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

main();