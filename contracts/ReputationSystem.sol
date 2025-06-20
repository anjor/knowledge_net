// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./KnowledgeMarketplace.sol";

contract ReputationSystem is Ownable {
    
    struct UserReputation {
        uint256 contributorScore;
        uint256 validatorScore;
        uint256 dataQualitySum;
        uint256 datasetsContributed;
        uint256 validationsPerformed;
        uint256 totalEarnings;
        uint256 lastActivity;
        bool blacklisted;
    }

    struct ReputationBadge {
        string name;
        string description;
        uint256 threshold;
        bool active;
    }

    // State variables
    mapping(address => UserReputation) public userReputations;
    mapping(string => ReputationBadge) public badges;
    mapping(address => string[]) public userBadges;
    
    string[] public availableBadges;
    address public marketplaceContract;
    
    // Reputation thresholds
    uint256 public constant TRUSTED_CONTRIBUTOR_THRESHOLD = 500;
    uint256 public constant EXPERT_VALIDATOR_THRESHOLD = 1000;
    uint256 public constant DATA_SCIENTIST_THRESHOLD = 2000;
    
    // Events
    event ReputationUpdated(address indexed user, uint256 contributorScore, uint256 validatorScore);
    event BadgeEarned(address indexed user, string badgeName);
    event UserBlacklisted(address indexed user, string reason);
    event UserWhitelisted(address indexed user);

    constructor(address _marketplaceContract) Ownable(msg.sender) {
        marketplaceContract = _marketplaceContract;
        _initializeBadges();
    }

    /**
     * Initialize reputation badges
     */
    function _initializeBadges() internal {
        badges["PIONEER"] = ReputationBadge({
            name: "Pioneer",
            description: "First 100 contributors to the platform",
            threshold: 1,
            active: true
        });
        
        badges["TRUSTED_CONTRIBUTOR"] = ReputationBadge({
            name: "Trusted Contributor",
            description: "Contributed high-quality datasets consistently",
            threshold: TRUSTED_CONTRIBUTOR_THRESHOLD,
            active: true
        });
        
        badges["EXPERT_VALIDATOR"] = ReputationBadge({
            name: "Expert Validator",
            description: "Performed accurate validations with high reputation",
            threshold: EXPERT_VALIDATOR_THRESHOLD,
            active: true
        });
        
        badges["DATA_SCIENTIST"] = ReputationBadge({
            name: "Data Scientist",
            description: "Top-tier contributor with exceptional data quality",
            threshold: DATA_SCIENTIST_THRESHOLD,
            active: true
        });

        availableBadges.push("PIONEER");
        availableBadges.push("TRUSTED_CONTRIBUTOR");
        availableBadges.push("EXPERT_VALIDATOR");
        availableBadges.push("DATA_SCIENTIST");
    }

    /**
     * Update user reputation after dataset contribution
     */
    function updateContributorReputation(
        address _user,
        uint256 _qualityScore,
        uint256 _earnings
    ) external {
        require(msg.sender == marketplaceContract, "Only marketplace can update reputation");
        
        UserReputation storage reputation = userReputations[_user];
        
        // Update contributor metrics
        reputation.dataQualitySum += _qualityScore;
        reputation.datasetsContributed++;
        reputation.totalEarnings += _earnings;
        reputation.lastActivity = block.timestamp;
        
        // Calculate new contributor score
        reputation.contributorScore = _calculateContributorScore(reputation);
        
        // Check for new badges
        _checkAndAwardBadges(_user);
        
        emit ReputationUpdated(_user, reputation.contributorScore, reputation.validatorScore);
    }

    /**
     * Update user reputation after validation
     */
    function updateValidatorReputation(
        address _user,
        bool _accurateValidation
    ) external {
        require(msg.sender == marketplaceContract, "Only marketplace can update reputation");
        
        UserReputation storage reputation = userReputations[_user];
        
        // Update validator metrics
        reputation.validationsPerformed++;
        reputation.lastActivity = block.timestamp;
        
        // Calculate new validator score based on accuracy
        if (_accurateValidation) {
            reputation.validatorScore = (reputation.validatorScore * 95 + 100 * 5) / 100;
        } else {
            // Penalize inaccurate validations
            reputation.validatorScore = reputation.validatorScore * 90 / 100;
        }
        
        // Check for new badges
        _checkAndAwardBadges(_user);
        
        emit ReputationUpdated(_user, reputation.contributorScore, reputation.validatorScore);
    }

    /**
     * Calculate contributor reputation score
     */
    function _calculateContributorScore(
        UserReputation memory _reputation
    ) internal pure returns (uint256) {
        if (_reputation.datasetsContributed == 0) return 0;
        
        uint256 avgQuality = _reputation.dataQualitySum / _reputation.datasetsContributed;
        uint256 volumeBonus = _reputation.datasetsContributed * 10;
        uint256 earningsBonus = _reputation.totalEarnings / 1 ether; // 1 point per FIL earned
        
        return avgQuality + volumeBonus + earningsBonus;
    }

    /**
     * Check and award badges to user
     */
    function _checkAndAwardBadges(address _user) internal {
        UserReputation memory reputation = userReputations[_user];
        
        // Check Pioneer badge (first 100 contributors)
        if (!_hasBadge(_user, "PIONEER") && reputation.datasetsContributed >= 1) {
            // This would need additional logic to track first 100 users
            if (reputation.datasetsContributed >= 1) { // Simplified for demo
                userBadges[_user].push("PIONEER");
                emit BadgeEarned(_user, "Pioneer");
            }
        }
        
        // Check Trusted Contributor badge
        if (!_hasBadge(_user, "TRUSTED_CONTRIBUTOR") && 
            reputation.contributorScore >= TRUSTED_CONTRIBUTOR_THRESHOLD) {
            userBadges[_user].push("TRUSTED_CONTRIBUTOR");
            emit BadgeEarned(_user, "Trusted Contributor");
        }
        
        // Check Expert Validator badge
        if (!_hasBadge(_user, "EXPERT_VALIDATOR") && 
            reputation.validatorScore >= EXPERT_VALIDATOR_THRESHOLD) {
            userBadges[_user].push("EXPERT_VALIDATOR");
            emit BadgeEarned(_user, "Expert Validator");
        }
        
        // Check Data Scientist badge
        if (!_hasBadge(_user, "DATA_SCIENTIST") && 
            reputation.contributorScore >= DATA_SCIENTIST_THRESHOLD) {
            userBadges[_user].push("DATA_SCIENTIST");
            emit BadgeEarned(_user, "Data Scientist");
        }
    }

    /**
     * Check if user has specific badge
     */
    function _hasBadge(address _user, string memory _badgeName) internal view returns (bool) {
        string[] memory userBadgeList = userBadges[_user];
        for (uint256 i = 0; i < userBadgeList.length; i++) {
            if (keccak256(bytes(userBadgeList[i])) == keccak256(bytes(_badgeName))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Blacklist user for malicious behavior
     */
    function blacklistUser(address _user, string memory _reason) external onlyOwner {
        userReputations[_user].blacklisted = true;
        emit UserBlacklisted(_user, _reason);
    }

    /**
     * Remove user from blacklist
     */
    function whitelistUser(address _user) external onlyOwner {
        userReputations[_user].blacklisted = false;
        emit UserWhitelisted(_user);
    }

    /**
     * Get user reputation details
     */
    function getUserReputation(address _user) 
        external 
        view 
        returns (UserReputation memory) 
    {
        return userReputations[_user];
    }

    /**
     * Get user badges
     */
    function getUserBadges(address _user) 
        external 
        view 
        returns (string[] memory) 
    {
        return userBadges[_user];
    }

    /**
     * Check if user is blacklisted
     */
    function isBlacklisted(address _user) external view returns (bool) {
        return userReputations[_user].blacklisted;
    }

    /**
     * Get reputation ranking position
     */
    function getReputationRank(address _user) external view returns (uint256) {
        // This would require maintaining a sorted list or using additional indexing
        // For MVP, return a simplified rank based on contributor score
        uint256 userScore = userReputations[_user].contributorScore;
        uint256 rank = 1;
        
        // This is inefficient but works for demo purposes
        // In production, use a more efficient ranking system
        return rank;
    }

    /**
     * Get platform-wide reputation statistics
     */
    function getReputationStats() external view returns (
        uint256 totalUsers,
        uint256 avgContributorScore,
        uint256 avgValidatorScore,
        uint256 totalBadgesAwarded
    ) {
        // This would require maintaining aggregate statistics
        // For MVP, return simplified stats
        totalUsers = 0;
        avgContributorScore = 0;
        avgValidatorScore = 0;
        totalBadgesAwarded = 0;
    }

    /**
     * Update marketplace contract address
     */
    function updateMarketplaceContract(address _newContract) external onlyOwner {
        marketplaceContract = _newContract;
    }

    /**
     * Add new reputation badge
     */
    function addBadge(
        string memory _badgeId,
        string memory _name,
        string memory _description,
        uint256 _threshold
    ) external onlyOwner {
        badges[_badgeId] = ReputationBadge({
            name: _name,
            description: _description,
            threshold: _threshold,
            active: true
        });
        availableBadges.push(_badgeId);
    }

    /**
     * Deactivate badge
     */
    function deactivateBadge(string memory _badgeId) external onlyOwner {
        badges[_badgeId].active = false;
    }
}