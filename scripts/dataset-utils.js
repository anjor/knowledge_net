const {ethers} = require('ethers');
require('dotenv').config();
const contractsInfo = require('../src/utils/contracts.json');

async function getMarketplaceContract(withSigner = false) {
  const provider = new ethers.JsonRpcProvider('https://api.calibration.node.glif.io/rpc/v1');
  const signer = withSigner ? new ethers.Wallet(process.env.PRIVATE_KEY, provider) : provider;
  
  return new ethers.Contract(
    contractsInfo.KnowledgeMarketplace.address,
    contractsInfo.KnowledgeMarketplace.abi,
    signer
  );
}

async function checkDataset(datasetId) {
  const marketplace = await getMarketplaceContract();
  const dataset = await marketplace.datasets(datasetId);
  
  console.log(`Dataset ${datasetId} details:`);
  console.log('Exists:', dataset.id !== '');
  console.log('Contributor:', dataset.contributor);
  console.log('Price:', ethers.formatEther(dataset.price), 'FIL');
  console.log('Verified:', dataset.verified);
  console.log('Quality Score:', Number(dataset.qualityScore));
  console.log('IPFS Hash:', dataset.ipfsHash);
  console.log('Download Count:', Number(dataset.downloadCount));
  
  return dataset;
}

async function validateDataset(datasetId, qualityScore = 85) {
  const marketplace = await getMarketplaceContract(true);
  
  try {
    // Check if validator is registered
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    const validatorInfo = await marketplace.validators(wallet.address);
    
    if (!validatorInfo.active) {
      console.log('Registering as validator first...');
      const registerTx = await marketplace.registerValidator({
        value: ethers.parseEther('1'),
        gasLimit: 25000000
      });
      await registerTx.wait();
      console.log('✅ Registered as validator');
    }

    console.log(`Validating ${datasetId} with quality score ${qualityScore}...`);
    const validateTx = await marketplace.validateDataset(datasetId, qualityScore, {
      gasLimit: 25000000
    });
    
    console.log('Transaction hash:', validateTx.hash);
    const receipt = await validateTx.wait();
    console.log('✅ Dataset validated! Block:', receipt.blockNumber);
    
    return await checkDataset(datasetId);
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    throw error;
  }
}

async function testPurchase(datasetId) {
  const marketplace = await getMarketplaceContract(true);
  
  try {
    const dataset = await marketplace.datasets(datasetId);
    console.log(`Testing purchase of ${datasetId} for ${ethers.formatEther(dataset.price)} FIL`);
    
    const tx = await marketplace.purchaseDataset(datasetId, {
      value: dataset.price,
      gasLimit: 35000000
    });
    
    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('✅ Purchase successful! Block:', receipt.blockNumber);
    console.log('Gas used:', Number(receipt.gasUsed));
    
    return tx.hash;
  } catch (error) {
    console.error('❌ Purchase failed:', error.message);
    throw error;
  }
}

// CLI interface
async function main() {
  const [,, command, datasetId, ...args] = process.argv;
  
  switch (command) {
    case 'check':
      if (!datasetId) {
        console.log('Usage: node dataset-utils.js check <datasetId>');
        return;
      }
      await checkDataset(datasetId);
      break;
      
    case 'validate':
      if (!datasetId) {
        console.log('Usage: node dataset-utils.js validate <datasetId> [qualityScore]');
        return;
      }
      const score = args[0] ? parseInt(args[0]) : 85;
      await validateDataset(datasetId, score);
      break;
      
    case 'purchase':
      if (!datasetId) {
        console.log('Usage: node dataset-utils.js purchase <datasetId>');
        return;
      }
      await testPurchase(datasetId);
      break;
      
    default:
      console.log('Available commands:');
      console.log('  check <datasetId>                 - Check dataset details');
      console.log('  validate <datasetId> [score]      - Validate dataset (default score: 85)');
      console.log('  purchase <datasetId>              - Test purchase dataset');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkDataset, validateDataset, testPurchase, getMarketplaceContract };