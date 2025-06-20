const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying KnowledgeNet contracts to Filecoin network...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.formatEther(balance), "FIL");

  try {
    // Deploy KnowledgeMarketplace contract
    console.log("\n1. Deploying KnowledgeMarketplace...");
    const KnowledgeMarketplace = await ethers.getContractFactory("KnowledgeMarketplace");
    const marketplace = await KnowledgeMarketplace.deploy();
    await marketplace.waitForDeployment();
    
    const marketplaceAddress = await marketplace.getAddress();
    console.log("✅ KnowledgeMarketplace deployed to:", marketplaceAddress);

    // Deploy ReputationSystem contract
    console.log("\n2. Deploying ReputationSystem...");
    const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
    const reputation = await ReputationSystem.deploy(marketplaceAddress);
    await reputation.waitForDeployment();
    
    const reputationAddress = await reputation.getAddress();
    console.log("✅ ReputationSystem deployed to:", reputationAddress);

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
          address: marketplaceAddress,
          transactionHash: marketplace.deploymentTransaction()?.hash
        },
        ReputationSystem: {
          address: reputationAddress,
          transactionHash: reputation.deploymentTransaction()?.hash
        }
      },
      gasUsed: {
        marketplace: marketplace.deploymentTransaction()?.gasLimit?.toString(),
        reputation: reputation.deploymentTransaction()?.gasLimit?.toString()
      }
    };

    console.log("\n4. Deployment Summary:");
    console.log("=====================================");
    console.log("Network: Filecoin Calibration Testnet");
    console.log("Deployer:", deployer.address);
    console.log("KnowledgeMarketplace:", marketplaceAddress);
    console.log("ReputationSystem:", reputationAddress);
    console.log("=====================================");

    // Save to file for frontend integration
    const fs = require('fs');
    const path = require('path');
    
    const deploymentPath = path.join(__dirname, '../src/utils/deployment.json');
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log("✅ Deployment info saved to:", deploymentPath);

    // Generate contract ABIs for frontend
    const marketplaceABI = require('../artifacts/contracts/KnowledgeMarketplace.sol/KnowledgeMarketplace.json');
    const reputationABI = require('../artifacts/contracts/ReputationSystem.sol/ReputationSystem.json');
    
    const abiInfo = {
      KnowledgeMarketplace: {
        address: marketplaceAddress,
        abi: marketplaceABI.abi
      },
      ReputationSystem: {
        address: reputationAddress,
        abi: reputationABI.abi
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