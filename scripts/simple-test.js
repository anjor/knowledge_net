const hre = require("hardhat");

async function main() {
  console.log("Testing basic Hardhat connection...");
  console.log("Hardhat object keys:", Object.keys(hre));
  console.log("Network name:", hre.network.name);
  console.log("Network config:", hre.network.config);
  
  if (hre.ethers) {
    console.log("Ethers is available");
    try {
      const provider = hre.ethers.provider;
      const network = await provider.getNetwork();
      console.log("Network chain ID:", network.chainId);
      
      const signers = await hre.ethers.getSigners();
      console.log("Number of signers:", signers.length);
      
      if (signers.length > 0) {
        const deployer = signers[0];
        console.log("Deployer address:", deployer.address);
        
        const balance = await deployer.getBalance();
        console.log("Balance:", hre.ethers.formatEther(balance), "tFIL");
        
        if (network.chainId === 314159) {
          console.log("✅ Successfully connected to Filecoin Calibration testnet!");
        } else {
          console.log("❌ Connected to wrong network");
        }
      }
    } catch (error) {
      console.error("Error with ethers operations:", error.message);
    }
  } else {
    console.log("❌ Ethers not available in hre");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });