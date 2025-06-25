const { ethers } = require("ethers");
require('dotenv').config();

async function main() {
  console.log("Checking balance on Filecoin Calibration testnet...");
  
  try {
    // Create provider
    const provider = new ethers.providers.JsonRpcProvider("https://api.calibration.node.glif.io/rpc/v1");
    
    // Create wallet from private key
    const wallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
    
    console.log("Wallet address:", wallet.address);
    
    // Check network
    const network = await provider.getNetwork();
    console.log("Network chain ID:", network.chainId);
    
    // Check balance
    const balance = await wallet.getBalance();
    console.log("Balance:", ethers.utils.formatEther(balance), "tFIL");
    
    if (balance.eq(0)) {
      console.log("\n⚠️  You need test FIL to deploy contracts!");
      console.log("📝 Steps to get test FIL:");
      console.log("1. Go to: https://faucet.calibnet.chainsafe-fil.io/");
      console.log("2. Connect your wallet or paste address:", wallet.address);
      console.log("3. Request test FIL");
      console.log("4. Wait a few minutes for the transaction");
    } else {
      console.log("✅ You have test FIL! Ready to deploy contracts.");
    }
    
    if (network.chainId === 314159) {
      console.log("✅ Connected to Filecoin Calibration testnet");
    } else {
      console.log("❌ Wrong network - expected chain ID 314159");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main();