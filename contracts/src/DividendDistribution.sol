// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DividendDistribution
 * @notice Handles proportional dividend distribution to token holders
 * @dev Distributes profits based on token ownership percentage
 */
contract DividendDistribution is AccessControl, ReentrancyGuard {
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");

    // Distribution Structure
    struct Distribution {
        uint256 id;
        uint256 assetId;
        uint256 totalAmount;
        uint256 amountPerShare;
        uint256 timestamp;
        uint256 recipientCount;
        bool completed;
        string period;              // e.g., "2024-01", "Q1-2024"
        string metadataURI;         // IPFS hash for distribution details
    }

    // Claim tracking
    struct Claim {
        uint256 distributionId;
        address holder;
        uint256 amount;
        uint256 claimedAt;
    }

    // State Variables
    uint256 private _nextDistributionId;
    mapping(uint256 => Distribution) public distributions;
    mapping(uint256 => mapping(address => bool)) public hasClaimed;
    mapping(uint256 => mapping(address => uint256)) public claimableAmount;
    mapping(uint256 => Claim[]) public distributionClaims;

    // Asset to token mapping
    mapping(uint256 => address) public assetTokens;

    // Events
    event DistributionCreated(
        uint256 indexed distributionId,
        uint256 indexed assetId,
        uint256 totalAmount,
        uint256 amountPerShare,
        string period
    );

    event DividendClaimed(
        uint256 indexed distributionId,
        address indexed holder,
        uint256 amount
    );

    event DistributionCompleted(
        uint256 indexed distributionId,
        uint256 totalDistributed,
        uint256 recipientCount
    );

    event AssetTokenRegistered(
        uint256 indexed assetId,
        address indexed tokenAddress
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _nextDistributionId = 1;
    }

    /**
     * @notice Register token address for an asset
     */
    function registerAssetToken(uint256 assetId, address tokenAddress)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(tokenAddress != address(0), "Invalid token address");
        require(assetTokens[assetId] == address(0), "Token already registered");

        assetTokens[assetId] = tokenAddress;

        emit AssetTokenRegistered(assetId, tokenAddress);
    }

    /**
     * @notice Create a new dividend distribution
     * @param assetId The asset ID
     * @param totalAmount Total amount to distribute
     * @param holders Array of token holder addresses
     * @param shares Array of share amounts for each holder
     * @param period Time period for this distribution
     * @param metadataURI IPFS hash for distribution details
     */
    function createDistribution(
        uint256 assetId,
        uint256 totalAmount,
        address[] memory holders,
        uint256[] memory shares,
        string memory period,
        string memory metadataURI
    ) external payable onlyRole(AGENT_ROLE) nonReentrant returns (uint256) {
        require(totalAmount > 0, "Amount must be positive");
        require(msg.value == totalAmount, "Sent value must match total amount");
        require(holders.length == shares.length, "Arrays length mismatch");
        require(holders.length > 0, "No holders specified");
        require(assetTokens[assetId] != address(0), "Asset token not registered");

        // Calculate total shares
        uint256 totalShares = 0;
        for (uint256 i = 0; i < shares.length; i++) {
            totalShares += shares[i];
        }
        require(totalShares > 0, "Total shares must be positive");

        uint256 distributionId = _nextDistributionId++;
        uint256 amountPerShare = totalAmount / totalShares;

        distributions[distributionId] = Distribution({
            id: distributionId,
            assetId: assetId,
            totalAmount: totalAmount,
            amountPerShare: amountPerShare,
            timestamp: block.timestamp,
            recipientCount: holders.length,
            completed: false,
            period: period,
            metadataURI: metadataURI
        });

        // Set claimable amounts for each holder
        for (uint256 i = 0; i < holders.length; i++) {
            uint256 holderAmount = shares[i] * amountPerShare;
            claimableAmount[distributionId][holders[i]] = holderAmount;
        }

        emit DistributionCreated(
            distributionId,
            assetId,
            totalAmount,
            amountPerShare,
            period
        );

        return distributionId;
    }

    /**
     * @notice Claim dividend for a specific distribution
     */
    function claimDividend(uint256 distributionId) external nonReentrant {
        Distribution storage dist = distributions[distributionId];
        require(dist.id > 0, "Distribution does not exist");
        require(!hasClaimed[distributionId][msg.sender], "Already claimed");

        uint256 amount = claimableAmount[distributionId][msg.sender];
        require(amount > 0, "No claimable amount");

        hasClaimed[distributionId][msg.sender] = true;

        // Record claim
        distributionClaims[distributionId].push(Claim({
            distributionId: distributionId,
            holder: msg.sender,
            amount: amount,
            claimedAt: block.timestamp
        }));

        // Transfer funds
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit DividendClaimed(distributionId, msg.sender, amount);
    }

    /**
     * @notice Batch claim multiple distributions
     */
    function batchClaimDividends(uint256[] memory distributionIds) external nonReentrant {
        uint256 totalAmount = 0;

        for (uint256 i = 0; i < distributionIds.length; i++) {
            uint256 distributionId = distributionIds[i];
            Distribution storage dist = distributions[distributionId];

            if (dist.id > 0 && !hasClaimed[distributionId][msg.sender]) {
                uint256 amount = claimableAmount[distributionId][msg.sender];

                if (amount > 0) {
                    hasClaimed[distributionId][msg.sender] = true;
                    totalAmount += amount;

                    distributionClaims[distributionId].push(Claim({
                        distributionId: distributionId,
                        holder: msg.sender,
                        amount: amount,
                        claimedAt: block.timestamp
                    }));

                    emit DividendClaimed(distributionId, msg.sender, amount);
                }
            }
        }

        require(totalAmount > 0, "No claimable dividends");

        // Transfer total
        (bool success, ) = payable(msg.sender).call{value: totalAmount}("");
        require(success, "Transfer failed");
    }

    /**
     * @notice Mark distribution as completed (agent only)
     */
    function markDistributionCompleted(uint256 distributionId)
        external
        onlyRole(AGENT_ROLE)
    {
        Distribution storage dist = distributions[distributionId];
        require(dist.id > 0, "Distribution does not exist");
        require(!dist.completed, "Already completed");

        dist.completed = true;

        emit DistributionCompleted(
            distributionId,
            dist.totalAmount,
            dist.recipientCount
        );
    }

    /**
     * @notice Get distribution details
     */
    function getDistribution(uint256 distributionId)
        external
        view
        returns (Distribution memory)
    {
        require(distributions[distributionId].id > 0, "Distribution does not exist");
        return distributions[distributionId];
    }

    /**
     * @notice Check if holder has claimed
     */
    function hasHolderClaimed(uint256 distributionId, address holder)
        external
        view
        returns (bool)
    {
        return hasClaimed[distributionId][holder];
    }

    /**
     * @notice Get claimable amount for holder
     */
    function getClaimableAmount(uint256 distributionId, address holder)
        external
        view
        returns (uint256)
    {
        if (hasClaimed[distributionId][holder]) {
            return 0;
        }
        return claimableAmount[distributionId][holder];
    }

    /**
     * @notice Get all claims for a distribution
     */
    function getDistributionClaims(uint256 distributionId)
        external
        view
        returns (Claim[] memory)
    {
        return distributionClaims[distributionId];
    }

    /**
     * @notice Get total distributions count
     */
    function getTotalDistributions() external view returns (uint256) {
        return _nextDistributionId - 1;
    }

    /**
     * @notice Grant agent role
     */
    function grantAgentRole(address agent) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(AGENT_ROLE, agent);
    }

    /**
     * @notice Revoke agent role
     */
    function revokeAgentRole(address agent) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(AGENT_ROLE, agent);
    }

    // Allow contract to receive CRO
    receive() external payable {}
}
