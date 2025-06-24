const { ethers } = require("hardhat");

async function main() {
  console.log("Generating new wallet for testnet...\n");
  
  // Generate a random wallet
  const wallet = ethers.Wallet.createRandom();
  
  console.log("🔐 New Wallet Generated:");
  console.log("Address:", wallet.address);
  console.log("Private Key (for .env):", wallet.privateKey.slice(2)); // Remove 0x prefix
  console.log("\n⚠️  IMPORTANT:");
  console.log("- This is for TESTNET ONLY");
  console.log("- Never use this private key on mainnet");
  console.log("- Add this private key to your .env file");
  console.log("- Get test FIL from: https://faucet.calibnet.chainsafe-fil.io/");
  console.log("\n📋 Add to .env file:");
  console.log(`PRIVATE_KEY=${wallet.privateKey.slice(2)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });