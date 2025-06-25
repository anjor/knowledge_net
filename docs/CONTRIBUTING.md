# Contributing to KnowledgeNet

Thank you for your interest in contributing to KnowledgeNet! This guide will help you get started with contributing to the decentralized AI knowledge marketplace.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Architecture Overview](#architecture-overview)
- [Contributing Areas](#contributing-areas)
- [Submission Guidelines](#submission-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful** and inclusive of all contributors
- **Be constructive** in feedback and discussions
- **Focus on what's best** for the community and project
- **Use welcoming and inclusive language**
- **Be patient** with newcomers and questions

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js 18+** installed
- **Git** for version control
- **MetaMask** with Filecoin testnet configured
- **Test FIL** tokens for blockchain interaction
- **Code editor** (VS Code recommended)

### Setup Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/knowledgenet
   cd knowledgenet
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```
5. **Configure environment** (see QUICKSTART.md)
6. **Start development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

We use **GitHub Flow**:

- `main` - Production-ready code
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation updates

### Making Changes

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commit with descriptive messages**:
   ```bash
   git commit -m "Add: new dataset validation feature"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Commit Message Format

Use clear, descriptive commit messages:

```
Type: Brief description

Detailed explanation if needed

Types:
- Add: New features
- Fix: Bug fixes  
- Update: Improvements to existing features
- Remove: Deleted features
- Docs: Documentation changes
- Test: Testing changes
- Refactor: Code restructuring
```

Examples:
```
Add: dataset quality scoring algorithm
Fix: wallet connection timeout issue
Update: improve IPFS upload performance
Docs: add API endpoint documentation
```

## Architecture Overview

Understanding the project structure will help you contribute effectively:

```
├── contracts/              # Smart contracts (Solidity)
│   ├── KnowledgeMarketplace.sol
│   └── ReputationSystem.sol
├── docs/                   # Documentation
├── scripts/                # Deployment and utility scripts
├── src/
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Next.js pages and API routes
│   ├── utils/             # Utility functions and services
│   └── styles/            # CSS and styling
├── test/                  # Test files
└── public/                # Static assets
```

### Key Technologies

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Blockchain**: Solidity, Ethers.js, Hardhat
- **Storage**: IPFS, Filecoin
- **Testing**: Jest, Hardhat tests

## Contributing Areas

### 🎨 Frontend Development

**Opportunities:**
- Improve UI/UX components
- Add new marketplace features
- Enhance mobile responsiveness
- Create data visualization components

**Files to focus on:**
- `src/components/` - React components
- `src/pages/` - Page components
- `src/styles/` - Styling

**Example contribution:**
```typescript
// Add a new dataset filter component
export const DatasetFilter: React.FC<FilterProps> = ({ onFilter }) => {
  // Implementation
};
```

### ⛓️ Smart Contract Development

**Opportunities:**
- Add new marketplace features
- Improve gas efficiency
- Enhance security features
- Add governance mechanisms

**Files to focus on:**
- `contracts/` - Solidity contracts
- `scripts/` - Deployment scripts
- `test/` - Contract tests

**Example contribution:**
```solidity
// Add bulk dataset registration
function submitDatasetBatch(
    DatasetSubmission[] memory datasets
) external nonReentrant {
    // Implementation
}
```

### 🔗 API Development

**Opportunities:**
- Add new API endpoints
- Improve query processing
- Add caching layers
- Enhance AI integration

**Files to focus on:**
- `src/pages/api/` - API routes
- `src/utils/` - API utilities

**Example contribution:**
```typescript
// Add dataset recommendation endpoint
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Implementation
}
```

### 📚 Documentation

**Opportunities:**
- Improve existing documentation
- Add code examples
- Create tutorials
- Translate documentation

**Files to focus on:**
- `docs/` - Documentation files
- `README.md` - Main project README
- Code comments

### 🧪 Testing

**Opportunities:**
- Add unit tests
- Create integration tests
- Improve test coverage
- Add performance tests

**Files to focus on:**
- `test/` - Test files
- `*.test.ts` - Component tests

**Example contribution:**
```typescript
describe('DatasetCard', () => {
  it('should display dataset information correctly', () => {
    // Test implementation
  });
});
```

### 🛠️ DevOps & Infrastructure

**Opportunities:**
- Improve build processes
- Add CI/CD pipelines
- Enhance deployment scripts
- Add monitoring

**Files to focus on:**
- `.github/workflows/` - GitHub Actions
- `scripts/` - Build and deployment scripts
- `package.json` - NPM scripts

## Submission Guidelines

### Pull Request Process

1. **Ensure your branch is up to date**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Write clear PR description**:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement

   ## Testing
   - [ ] Tests pass locally
   - [ ] Added new tests for changes
   - [ ] Manual testing completed

   ## Screenshots (if applicable)
   ```

3. **Ensure all checks pass**:
   - Code builds successfully
   - Tests pass
   - Linting passes
   - No security vulnerabilities

4. **Request review** from maintainers

### Code Standards

#### TypeScript/JavaScript
```typescript
// Use TypeScript for type safety
interface DatasetProps {
  id: string;
  metadata: DatasetMetadata;
}

// Use meaningful variable names
const isDatasetVerified = dataset.verified;

// Add JSDoc comments for public functions
/**
 * Calculates the quality score for a dataset
 * @param validations Array of validation results
 * @returns Quality score between 0-100
 */
function calculateQualityScore(validations: Validation[]): number {
  // Implementation
}
```

#### Solidity
```solidity
// Follow Solidity style guide
contract KnowledgeMarketplace {
    // Use descriptive variable names
    mapping(string => Dataset) public datasets;
    
    // Add NatSpec comments
    /// @notice Submit a new dataset to the marketplace
    /// @param _id Unique dataset identifier
    /// @param _ipfsHash IPFS content hash
    function submitDataset(
        string memory _id,
        string memory _ipfsHash
    ) external nonReentrant {
        // Implementation
    }
}
```

#### React Components
```typescript
// Use functional components with hooks
export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
  const [loading, setLoading] = useState(false);
  
  // Use meaningful component structure
  return (
    <div className="dataset-card">
      <header>{dataset.metadata.name}</header>
      <main>{/* Content */}</main>
      <footer>{/* Actions */}</footer>
    </div>
  );
};
```

### Performance Guidelines

- **Optimize bundle size** - Use dynamic imports for large components
- **Minimize re-renders** - Use React.memo and useMemo appropriately  
- **Efficient state management** - Avoid unnecessary state updates
- **Gas optimization** - Minimize contract storage operations

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- DatasetCard.test.ts

# Run with coverage
npm test -- --coverage

# Run contract tests
npx hardhat test
```

### Writing Tests

#### Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { DatasetCard } from '../DatasetCard';

describe('DatasetCard', () => {
  const mockDataset = {
    id: 'test-dataset',
    metadata: { name: 'Test Dataset' }
  };

  it('renders dataset name', () => {
    render(<DatasetCard dataset={mockDataset} />);
    expect(screen.getByText('Test Dataset')).toBeInTheDocument();
  });
});
```

#### Contract Tests
```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("KnowledgeMarketplace", () => {
  it("Should register a new dataset", async () => {
    const marketplace = await ethers.deployContract("KnowledgeMarketplace");
    
    await marketplace.submitDataset(
      "test-dataset",
      "QmTestHash",
      "QmMetadataHash",
      ethers.parseEther("0.1")
    );
    
    const dataset = await marketplace.getDataset("test-dataset");
    expect(dataset.id).to.equal("test-dataset");
  });
});
```

## Documentation

### Writing Documentation

- **Use clear, concise language**
- **Include code examples**
- **Add screenshots for UI changes**
- **Keep documentation up to date with code changes**

### Documentation Standards

- Use Markdown for all documentation
- Include table of contents for long documents
- Add cross-references between related docs
- Use consistent formatting and style

## Community

### Getting Help

- **GitHub Discussions** - Ask questions and discuss features
- **GitHub Issues** - Report bugs and request features
- **Discord** - Real-time chat and community support
- **Email** - Contact maintainers directly

### Mentorship

New contributors are welcome! We provide:

- **Good first issues** labeled for beginners
- **Mentorship pairing** with experienced contributors
- **Code review guidance** to help you improve
- **Regular community calls** to discuss progress

## Recognition

Contributors will be recognized through:

- **Contributors list** in README
- **Release notes** mentioning significant contributions
- **Social media shoutouts** for major features
- **Conference speaking opportunities** for core contributors

## Legal

By contributing to KnowledgeNet, you agree that:

- Your contributions will be licensed under the project's MIT license
- You have the right to submit the work under this license
- You understand the project is open source and publicly available

---

Thank you for contributing to KnowledgeNet! Your efforts help build the future of decentralized AI data access. 🚀