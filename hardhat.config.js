require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    // Filecoin Calibration testnet
    calibration: {
      url: "https://api.calibration.node.glif.io/rpc/v1",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
      chainId: 314159
    },
    // Filecoin mainnet
    filecoin: {
      url: "https://api.node.glif.io/rpc/v1", 
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
      chainId: 314
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};