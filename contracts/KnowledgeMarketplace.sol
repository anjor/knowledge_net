// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract KnowledgeMarketplace is ReentrancyGuard, Ownable {
    
    struct Dataset {
        string id;
        string ipfsHash;
        string metadataHash;
        address contributor;
        uint256 price;
        uint256 qualityScore;
        uint256 downloadCount;
        uint256 earnings;
        bool verified;
        uint256 timestamp;
    }

    struct Validator {
        address validatorAddress;
        uint256 stakedAmount;
        uint256 reputation;
        uint256 validationsCount;
        uint256 rewards;
        bool active;
    }

    struct Download {
        string datasetId;
        address buyer;
        uint256 amount;
        uint256 timestamp;
    }

    // State variables
    mapping(string => Dataset) public datasets;
    mapping(address => Validator) public validators;
    mapping(string => Download[]) public datasetDownloads;
    mapping(address => string[]) public contributorDatasets;
    mapping(address => uint256) public userEarnings;
    
    string[] public allDatasetIds;
    address[] public allValidators;
    
    // Configuration
    uint256 public constant VALIDATION_STAKE = 1 ether; // 1 FIL
    uint256 public constant QUALITY_THRESHOLD = 70;
    uint256 public constant VALIDATOR_REWARD_PERCENT = 5; // 5% of download fees
    uint256 public constant PLATFORM_FEE_PERCENT = 2; // 2% platform fee
    
    // Events
    event DatasetSubmitted(string indexed datasetId, address indexed contributor, string ipfsHash);
    event DatasetVerified(string indexed datasetId, address indexed validator, uint256 qualityScore);
    event DatasetPurchased(string indexed datasetId, address indexed buyer, uint256 amount);
    event ValidatorRegistered(address indexed validator, uint256 stakedAmount);
    event ValidatorSlashed(address indexed validator, uint256 amount);
    event EarningsClaimed(address indexed user, uint256 amount);

    constructor() {}

    /**
     * Submit a new dataset to the marketplace
     */
    function submitDataset(
        string memory _id,
        string memory _ipfsHash,
        string memory _metadataHash,
        uint256 _price
    ) external nonReentrant {
        require(bytes(_id).length > 0, "Dataset ID required");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        require(bytes(datasets[_id].id).length == 0, "Dataset already exists");
        require(_price > 0, "Price must be greater than 0");

        datasets[_id] = Dataset({
            id: _id,
            ipfsHash: _ipfsHash,
            metadataHash: _metadataHash,
            contributor: msg.sender,
            price: _price,
            qualityScore: 0,
            downloadCount: 0,
            earnings: 0,
            verified: false,
            timestamp: block.timestamp
        });

        allDatasetIds.push(_id);
        contributorDatasets[msg.sender].push(_id);

        emit DatasetSubmitted(_id, msg.sender, _ipfsHash);
    }

    /**
     * Register as a validator by staking FIL
     */
    function registerValidator() external payable nonReentrant {
        require(msg.value >= VALIDATION_STAKE, "Insufficient stake amount");
        require(!validators[msg.sender].active, "Already registered as validator");

        validators[msg.sender] = Validator({
            validatorAddress: msg.sender,
            stakedAmount: msg.value,
            reputation: 100, // Start with 100% reputation
            validationsCount: 0,
            rewards: 0,
            active: true
        });

        allValidators.push(msg.sender);

        emit ValidatorRegistered(msg.sender, msg.value);
    }

    /**
     * Validate a dataset (only registered validators)
     */
    function validateDataset(
        string memory _datasetId,
        uint256 _qualityScore
    ) external nonReentrant {
        require(validators[msg.sender].active, "Not an active validator");
        require(bytes(datasets[_datasetId].id).length > 0, "Dataset does not exist");
        require(!datasets[_datasetId].verified, "Dataset already verified");
        require(_qualityScore <= 100, "Quality score must be <= 100");

        datasets[_datasetId].qualityScore = _qualityScore;
        datasets[_datasetId].verified = _qualityScore >= QUALITY_THRESHOLD;

        validators[msg.sender].validationsCount++;

        // Update validator reputation based on validation quality
        if (_qualityScore >= QUALITY_THRESHOLD) {
            validators[msg.sender].reputation = 
                (validators[msg.sender].reputation * 95 + 100 * 5) / 100;
        }

        emit DatasetVerified(_datasetId, msg.sender, _qualityScore);
    }

    /**
     * Purchase access to a dataset
     */
    function purchaseDataset(string memory _datasetId) 
        external 
        payable 
        nonReentrant 
    {
        require(bytes(datasets[_datasetId].id).length > 0, "Dataset does not exist");
        require(datasets[_datasetId].verified, "Dataset not verified");
        require(msg.value >= datasets[_datasetId].price, "Insufficient payment");

        Dataset storage dataset = datasets[_datasetId];
        uint256 purchaseAmount = dataset.price;

        // Calculate fees
        uint256 platformFee = (purchaseAmount * PLATFORM_FEE_PERCENT) / 100;
        uint256 validatorReward = (purchaseAmount * VALIDATOR_REWARD_PERCENT) / 100;
        uint256 contributorEarnings = purchaseAmount - platformFee - validatorReward;

        // Update dataset stats
        dataset.downloadCount++;
        dataset.earnings += contributorEarnings;

        // Record download
        datasetDownloads[_datasetId].push(Download({
            datasetId: _datasetId,
            buyer: msg.sender,
            amount: purchaseAmount,
            timestamp: block.timestamp
        }));

        // Distribute payments
        userEarnings[dataset.contributor] += contributorEarnings;
        
        // Distribute validator rewards to active validators
        uint256 validatorCount = 0;
        for (uint256 i = 0; i < allValidators.length; i++) {
            if (validators[allValidators[i]].active) {
                validatorCount++;
            }
        }
        
        if (validatorCount > 0) {
            uint256 rewardPerValidator = validatorReward / validatorCount;
            for (uint256 i = 0; i < allValidators.length; i++) {
                if (validators[allValidators[i]].active) {
                    validators[allValidators[i]].rewards += rewardPerValidator;
                }
            }
        }

        // Refund excess payment
        if (msg.value > purchaseAmount) {
            payable(msg.sender).transfer(msg.value - purchaseAmount);
        }

        emit DatasetPurchased(_datasetId, msg.sender, purchaseAmount);
    }

    /**
     * Claim earnings (contributors and validators)
     */
    function claimEarnings() external nonReentrant {
        uint256 totalEarnings = userEarnings[msg.sender];
        
        if (validators[msg.sender].active) {
            totalEarnings += validators[msg.sender].rewards;
            validators[msg.sender].rewards = 0;
        }

        require(totalEarnings > 0, "No earnings to claim");

        userEarnings[msg.sender] = 0;
        payable(msg.sender).transfer(totalEarnings);

        emit EarningsClaimed(msg.sender, totalEarnings);
    }

    /**
     * Slash validator for malicious behavior
     */
    function slashValidator(
        address _validator,
        uint256 _slashAmount
    ) external onlyOwner {
        require(validators[_validator].active, "Validator not active");
        require(_slashAmount <= validators[_validator].stakedAmount, "Slash amount exceeds stake");

        validators[_validator].stakedAmount -= _slashAmount;
        validators[_validator].reputation = validators[_validator].reputation / 2; // Halve reputation

        if (validators[_validator].stakedAmount < VALIDATION_STAKE) {
            validators[_validator].active = false;
        }

        emit ValidatorSlashed(_validator, _slashAmount);
    }

    /**
     * Get dataset information
     */
    function getDataset(string memory _datasetId) 
        external 
        view 
        returns (Dataset memory) 
    {
        return datasets[_datasetId];
    }

    /**
     * Get all datasets by contributor
     */
    function getContributorDatasets(address _contributor) 
        external 
        view 
        returns (string[] memory) 
    {
        return contributorDatasets[_contributor];
    }

    /**
     * Get validator information
     */
    function getValidator(address _validatorAddress) 
        external 
        view 
        returns (Validator memory) 
    {
        return validators[_validatorAddress];
    }

    /**
     * Get total number of datasets
     */
    function getTotalDatasets() external view returns (uint256) {
        return allDatasetIds.length;
    }

    /**
     * Get dataset downloads
     */
    function getDatasetDownloads(string memory _datasetId) 
        external 
        view 
        returns (Download[] memory) 
    {
        return datasetDownloads[_datasetId];
    }

    /**
     * Check if user has purchased dataset
     */
    function hasPurchasedDataset(string memory _datasetId, address _user) 
        external 
        view 
        returns (bool) 
    {
        Download[] memory downloads = datasetDownloads[_datasetId];
        for (uint256 i = 0; i < downloads.length; i++) {
            if (downloads[i].buyer == _user) {
                return true;
            }
        }
        return false;
    }

    /**
     * Emergency withdrawal (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * Get marketplace statistics
     */
    function getMarketplaceStats() external view returns (
        uint256 totalDatasets,
        uint256 totalValidators,
        uint256 totalDownloads,
        uint256 totalEarnings
    ) {
        totalDatasets = allDatasetIds.length;
        totalValidators = allValidators.length;
        
        for (uint256 i = 0; i < allDatasetIds.length; i++) {
            totalDownloads += datasets[allDatasetIds[i]].downloadCount;
            totalEarnings += datasets[allDatasetIds[i]].earnings;
        }
    }
}