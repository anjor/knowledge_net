async function main(hre) {
  // Test connection to Calibration testnet
  console.log("Testing connection to Filecoin Calibration testnet...");
  
  try {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    
    const balance = await deployer.getBalance();
    console.log("Balance:", ethers.formatEther(balance), "tFIL");
    
    if (balance === 0n) {
      console.log("⚠️  Balance is 0 - You need test FIL!");
      console.log("Get test FIL from: https://faucet.calibnet.chainsafe-fil.io/");
      console.log("Use your address:", deployer.address);
    }
    
    const network = await ethers.provider.getNetwork();
    console.log("Connected to network - Chain ID:", network.chainId);
    
    if (network.chainId === 314159) {
      console.log("✅ Successfully connected to Filecoin Calibration testnet!");
      return true;
    } else {
      console.log("❌ Not connected to Calibration testnet");
      return false;
    }
    
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    return false;
  }
}

module.exports = main;

if (require.main === module) {
  main(require("hardhat"))
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}