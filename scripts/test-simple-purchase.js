const { ethers } = require("ethers");
require('dotenv').config();

// Simple test for basic contract interaction
async function main() {
  console.log("🧪 Testing basic contract interaction...\n");

  const provider = new ethers.providers.JsonRpcProvider("https://api.calibration.node.glif.io/rpc/v1");
  const wallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
  
  // Simple contract ABI for testing
  const simpleABI = [
    "function getTotalDatasets() public view returns (uint256)",
    "function owner() public view returns (address)"
  ];
  
  const contract = new ethers.Contract(
    "0xc0322d66e1a2d334419e04c98Aa127F1E83087fC", // Your marketplace address
    simpleABI,
    wallet
  );

  try {
    // Test read functions
    const totalDatasets = await contract.getTotalDatasets();
    console.log("✅ Contract is responsive");
    console.log(`📊 Total datasets: ${totalDatasets.toString()}`);
    
    const owner = await contract.owner();
    console.log(`👤 Contract owner: ${owner}`);
    console.log(`🔑 Your address: ${wallet.address}`);
    console.log(`🎯 Match: ${owner.toLowerCase() === wallet.address.toLowerCase()}`);
    
  } catch (error) {
    console.error("❌ Contract interaction failed:", error.message);
  }
}

main().catch(console.error);