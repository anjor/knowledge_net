# Frequently Asked Questions

Common questions and troubleshooting guide for KnowledgeNet.

## General Questions

### What is KnowledgeNet?

KnowledgeNet is a decentralized marketplace for AI training data built on Filecoin. It enables AI models to access verified scientific datasets while providing economic incentives for data contributors and validators.

### Why use Filecoin for AI data?

Filecoin provides several advantages for AI data:
- **Decentralized storage** - No single point of failure
- **Cryptographic proof** - Verifiable data integrity  
- **Economic incentives** - Sustainable model for data sharing
- **Censorship resistance** - Data cannot be arbitrarily removed
- **Global accessibility** - Available worldwide without restrictions

### How does the economic model work?

The marketplace uses a three-party economic model:
- **AI Models** pay FIL tokens to access datasets
- **Data Contributors** earn 93% of purchase fees
- **Validators** earn 5% for quality verification  
- **Platform** takes 2% for operations

### Is this production ready?

KnowledgeNet is currently a demonstration project for PLGenesis 2025. While the smart contracts are functional on testnet, production deployment would require:
- Security audits
- Mainnet deployment
- Production IPFS infrastructure
- Legal compliance review

## Technical Questions

### What blockchain networks are supported?

Currently supported:
- **Filecoin Calibration Testnet** (primary development network)
- **Filecoin Mainnet** (contract compatible, not deployed)

The system is designed to be compatible with any FVM-compatible network.

### What data formats are supported?

KnowledgeNet supports various formats:
- **JSON** - Structured data, APIs, small datasets
- **CSV** - Tabular data, time series
- **Parquet** - Large datasets, analytics  
- **HDF5** - Scientific data, arrays
- **DICOM** - Medical imaging
- **NetCDF** - Climate and geospatial data

### How is data quality ensured?

Quality assurance through multiple mechanisms:
- **Validator staking** - Validators stake FIL to participate
- **Peer review** - Multiple validators score each dataset
- **Reputation system** - Track record of quality assessments
- **Economic incentives** - Rewards tied to accurate validation
- **Community governance** - Dispute resolution mechanisms

### What happens to data if IPFS nodes go offline?

Data persistence is ensured through:
- **Filecoin storage deals** - Long-term storage contracts
- **Multiple replicas** - Data stored across multiple miners
- **Proof-of-Spacetime** - Cryptographic proof data is still available
- **Retrieval network** - Incentivized data retrieval

## Setup and Installation

### I'm getting "Module not found" errors

**Solution:**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# If using yarn
rm -rf node_modules yarn.lock  
yarn install
```

### MetaMask won't connect to Filecoin network

**Solution:**
1. Manually add Filecoin Calibration network:
   - Network Name: `Filecoin Calibration`
   - RPC URL: `https://api.calibration.node.glif.io/rpc/v1`
   - Chain ID: `314159`
   - Currency: `tFIL`

2. Ensure MetaMask is unlocked
3. Try refreshing the page
4. Check browser console for errors

### I can't get test FIL tokens

**Solutions:**
1. Try the official faucet: https://faucet.calibration.fildev.network/
2. Make sure you're using a valid Filecoin address (starts with `f` or `0x`)
3. Wait a few minutes - the faucet can be slow
4. Try from a different IP address if rate-limited

### Smart contract deployment fails

**Common causes and solutions:**

**Insufficient balance:**
```bash
# Check your balance
node scripts/test-simple-purchase.js
```

**Network issues:**
```bash
# Test network connectivity
curl https://api.calibration.node.glif.io/rpc/v1
```

**Gas estimation problems:**
- Increase gas limit in deployment script
- Check for contract compilation errors
- Verify all dependencies are installed

### Development server won't start

**Port 3000 already in use:**
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

**Environment variables missing:**
```bash
# Copy example environment file
cp .env.example .env
# Edit .env with your values
```

## Usage Questions

### How do I test purchases without spending real money?

The application has two modes:

**Demo Mode (Current):**
- Simulated transactions for smooth presentation
- No real FIL spent
- Professional UX testing

**Test Mode:**
- Real blockchain transactions on testnet
- Uses free test FIL tokens
- Full end-to-end validation

### Can I use my own datasets?

Yes! To add your own datasets:

1. **Upload to IPFS** (or use mock hashes for testing)
2. **Register in smart contract**:
   ```bash
   npm run contracts:register
   ```
3. **Update frontend data** in `src/components/MarketplaceHome.tsx`

### How do I enable real blockchain transactions?

Edit `src/components/DatasetCard.tsx`:

```typescript
// Change from demo mode
// await new Promise(resolve => setTimeout(resolve, 2000));
// const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);

// To real mode
const priceInWei = parsePrice(dataset.price);
const txHash = await purchaseDataset(dataset.id, priceInWei);
```

### How do I integrate with my AI model?

Use the KnowledgeNet SDK:

```typescript
import { createKnowledgeNetClient } from 'knowledgenet-sdk';

const client = createKnowledgeNetClient({
  apiKey: 'your-api-key',
  userAddress: '0xYourAddress'
});

// Search for relevant datasets
const datasets = await client.searchDatasets({
  tags: ['medical'],
  verified: true
});

// Query a dataset
const result = await client.queryDataset(
  datasets[0].id,
  'Your AI query here'
);
```

## Troubleshooting

### Wallet Connection Issues

**Problem:** "Connect Wallet" button not working

**Solutions:**
1. Check MetaMask is installed and unlocked
2. Verify you're on the correct network (Filecoin Calibration)
3. Clear browser cache and cookies
4. Try incognito/private browsing mode
5. Disable other wallet extensions temporarily

**Problem:** Network switching fails

**Solutions:**
1. Manually add the network in MetaMask
2. Update MetaMask to latest version
3. Try a different browser
4. Check RPC URL is correct

### Transaction Failures

**Problem:** "Gas estimation failed"

**Solutions:**
1. Ensure sufficient tFIL balance for gas
2. Check dataset exists in contract
3. Verify contract addresses are correct
4. Try increasing gas limit manually

**Problem:** "Dataset does not exist" error

**Solutions:**
1. Register datasets first: `npm run contracts:register`
2. Check dataset IDs match exactly
3. Verify contract deployment was successful
4. Use demo mode for presentations

### API Issues

**Problem:** API endpoints returning 404

**Solutions:**
1. Ensure development server is running: `npm run dev`
2. Check API endpoint URLs are correct
3. Verify Next.js API routes are properly configured
4. Check browser network tab for actual request URLs

**Problem:** CORS errors in browser

**Solutions:**
1. API routes in Next.js handle CORS automatically
2. If using external API, configure CORS headers
3. For development, consider using a proxy

### Performance Issues

**Problem:** Slow page loading

**Solutions:**
1. Optimize React component re-renders
2. Implement code splitting for large components
3. Use React.memo for expensive components
4. Check browser dev tools for performance bottlenecks

**Problem:** Slow blockchain interactions

**Solutions:**
1. Use appropriate gas prices
2. Implement transaction caching
3. Show loading states for better UX
4. Consider batching multiple operations

### Build and Deployment

**Problem:** Build fails with TypeScript errors

**Solutions:**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix common issues
npm run lint -- --fix

# Update dependencies
npm update
```

**Problem:** Production deployment issues

**Solutions:**
1. Use environment variables for sensitive data
2. Configure proper IPFS endpoints for production
3. Use mainnet contract addresses
4. Implement proper error boundaries

## Best Practices

### Development Workflow

1. **Always test locally** before submitting PRs
2. **Use TypeScript** for type safety
3. **Write tests** for new features
4. **Follow coding standards** in CONTRIBUTING.md
5. **Document your changes** thoroughly

### Security Considerations

1. **Never commit private keys** to version control
2. **Validate all user inputs** in smart contracts
3. **Use proper access controls** for admin functions
4. **Audit dependencies** regularly
5. **Test edge cases** thoroughly

### Performance Optimization

1. **Minimize bundle size** with code splitting
2. **Optimize React renders** with memo and useMemo
3. **Cache API responses** appropriately
4. **Use efficient smart contract patterns**
5. **Monitor gas usage** and optimize

## Getting Help

### Where to get support?

1. **GitHub Issues** - Report bugs and request features
2. **GitHub Discussions** - Ask questions and discuss ideas
3. **Documentation** - Check docs/ directory for guides
4. **Code Examples** - Look at existing component implementations

### How to report bugs?

When reporting bugs, include:

1. **Steps to reproduce** the issue
2. **Expected vs actual behavior**
3. **Error messages** and stack traces
4. **Environment details** (OS, browser, Node.js version)
5. **Screenshots** if relevant

### Contributing back

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Setting up development environment
- Code standards and guidelines
- Pull request process
- Testing requirements

## Roadmap

### Short-term (1-3 months)
- Production deployment to Filecoin mainnet
- Security audit and vulnerability assessment
- Performance optimization and caching
- Mobile app development

### Medium-term (3-6 months)
- Cross-chain integration (Ethereum, Polygon)
- Advanced AI query capabilities
- Enterprise API offerings
- Partnership with research institutions

### Long-term (6-12 months)
- DAO governance implementation
- Automated compliance tools
- Machine learning-powered recommendations
- Global marketplace expansion

---

**Still have questions?** Check our [documentation](./), browse [GitHub Discussions](https://github.com/your-repo/discussions), or open an [issue](https://github.com/your-repo/issues)!