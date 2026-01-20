// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title AssetRegistry
 * @notice Central registry for all Real-World Assets (RWAs) managed by Automae
 * @dev Stores asset metadata, ownership tracking, and lifecycle state
 */
contract AssetRegistry is Ownable {
    // Asset Types
    enum AssetType {
        RealEstate,
        Equipment,
        Invoice,
        SupplyChain,
        Other
    }

    // Asset Lifecycle States
    enum AssetState {
        Draft,          // Asset created but not active
        Active,         // Asset is operational
        Maintenance,    // Undergoing maintenance
        Disputed,       // In dispute resolution
        Suspended,      // Temporarily suspended
        Retired         // Permanently retired
    }

    // Asset Structure
    struct Asset {
        uint256 id;
        AssetType assetType;
        AssetState state;
        string name;
        string physicalAddress;
        address tokenAddress;      // ERC20 token representing ownership
        uint256 totalShares;
        address treasuryAddress;
        address[] agents;          // Deployed agent addresses
        uint256 createdAt;
        uint256 updatedAt;
        string metadataURI;        // IPFS hash for detailed metadata
        bool exists;
    }

    // State Variables
    uint256 private _nextAssetId;
    mapping(uint256 => Asset) private _assets;
    mapping(address => uint256[]) private _ownerAssets;
    mapping(uint256 => mapping(address => bool)) private _assetAgents;

    // Events
    event AssetCreated(
        uint256 indexed assetId,
        AssetType assetType,
        string name,
        address indexed owner,
        address tokenAddress
    );

    event AssetStateChanged(
        uint256 indexed assetId,
        AssetState oldState,
        AssetState newState,
        uint256 timestamp
    );

    event AgentDeployed(
        uint256 indexed assetId,
        address indexed agentAddress,
        string agentType
    );

    event AgentRemoved(
        uint256 indexed assetId,
        address indexed agentAddress
    );

    event MetadataUpdated(
        uint256 indexed assetId,
        string newMetadataURI
    );

    constructor() Ownable(msg.sender) {
        _nextAssetId = 1;
    }

    /**
     * @notice Create a new asset in the registry
     * @param assetType The type of asset
     * @param name Human-readable name
     * @param physicalAddress Physical location/address
     * @param tokenAddress ERC20 token address for ownership
     * @param totalShares Total number of shares
     * @param treasuryAddress Treasury contract for this asset
     * @param metadataURI IPFS hash for metadata
     * @return assetId The newly created asset ID
     */
    function createAsset(
        AssetType assetType,
        string memory name,
        string memory physicalAddress,
        address tokenAddress,
        uint256 totalShares,
        address treasuryAddress,
        string memory metadataURI
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(tokenAddress != address(0), "Invalid token address");
        require(treasuryAddress != address(0), "Invalid treasury address");
        require(totalShares > 0, "Total shares must be positive");

        uint256 assetId = _nextAssetId++;

        Asset storage newAsset = _assets[assetId];
        newAsset.id = assetId;
        newAsset.assetType = assetType;
        newAsset.state = AssetState.Draft;
        newAsset.name = name;
        newAsset.physicalAddress = physicalAddress;
        newAsset.tokenAddress = tokenAddress;
        newAsset.totalShares = totalShares;
        newAsset.treasuryAddress = treasuryAddress;
        newAsset.createdAt = block.timestamp;
        newAsset.updatedAt = block.timestamp;
        newAsset.metadataURI = metadataURI;
        newAsset.exists = true;

        _ownerAssets[msg.sender].push(assetId);

        emit AssetCreated(assetId, assetType, name, msg.sender, tokenAddress);

        return assetId;
    }

    /**
     * @notice Update asset state
     */
    function updateAssetState(uint256 assetId, AssetState newState) external {
        Asset storage asset = _assets[assetId];
        require(asset.exists, "Asset does not exist");
        require(asset.state != newState, "State already set");

        AssetState oldState = asset.state;
        asset.state = newState;
        asset.updatedAt = block.timestamp;

        emit AssetStateChanged(assetId, oldState, newState, block.timestamp);
    }

    /**
     * @notice Deploy an agent for an asset
     */
    function deployAgent(
        uint256 assetId,
        address agentAddress,
        string memory agentType
    ) external {
        Asset storage asset = _assets[assetId];
        require(asset.exists, "Asset does not exist");
        require(agentAddress != address(0), "Invalid agent address");
        require(!_assetAgents[assetId][agentAddress], "Agent already deployed");

        asset.agents.push(agentAddress);
        _assetAgents[assetId][agentAddress] = true;
        asset.updatedAt = block.timestamp;

        emit AgentDeployed(assetId, agentAddress, agentType);
    }

    /**
     * @notice Remove an agent from an asset
     */
    function removeAgent(uint256 assetId, address agentAddress) external {
        Asset storage asset = _assets[assetId];
        require(asset.exists, "Asset does not exist");
        require(_assetAgents[assetId][agentAddress], "Agent not deployed");

        // Remove from mapping
        _assetAgents[assetId][agentAddress] = false;

        // Remove from array
        for (uint256 i = 0; i < asset.agents.length; i++) {
            if (asset.agents[i] == agentAddress) {
                asset.agents[i] = asset.agents[asset.agents.length - 1];
                asset.agents.pop();
                break;
            }
        }

        asset.updatedAt = block.timestamp;

        emit AgentRemoved(assetId, agentAddress);
    }

    /**
     * @notice Update metadata URI
     */
    function updateMetadata(uint256 assetId, string memory newMetadataURI) external {
        Asset storage asset = _assets[assetId];
        require(asset.exists, "Asset does not exist");

        asset.metadataURI = newMetadataURI;
        asset.updatedAt = block.timestamp;

        emit MetadataUpdated(assetId, newMetadataURI);
    }

    /**
     * @notice Update asset token and treasury addresses (for factory pattern)
     */
    function updateAssetAddresses(
        uint256 assetId,
        address newTokenAddress,
        address newTreasuryAddress
    ) external {
        Asset storage asset = _assets[assetId];
        require(asset.exists, "Asset does not exist");
        require(newTokenAddress != address(0), "Invalid token address");
        require(newTreasuryAddress != address(0), "Invalid treasury address");

        asset.tokenAddress = newTokenAddress;
        asset.treasuryAddress = newTreasuryAddress;
        asset.updatedAt = block.timestamp;
    }

    /**
     * @notice Get asset details
     */
    function getAsset(uint256 assetId) external view returns (Asset memory) {
        require(_assets[assetId].exists, "Asset does not exist");
        return _assets[assetId];
    }

    /**
     * @notice Get all assets owned by an address
     */
    function getOwnerAssets(address owner) external view returns (uint256[] memory) {
        return _ownerAssets[owner];
    }

    /**
     * @notice Check if an agent is deployed for an asset
     */
    function isAgentDeployed(uint256 assetId, address agentAddress) external view returns (bool) {
        return _assetAgents[assetId][agentAddress];
    }

    /**
     * @notice Get all agents for an asset
     */
    function getAssetAgents(uint256 assetId) external view returns (address[] memory) {
        require(_assets[assetId].exists, "Asset does not exist");
        return _assets[assetId].agents;
    }

    /**
     * @notice Get total number of assets
     */
    function getTotalAssets() external view returns (uint256) {
        return _nextAssetId - 1;
    }
}
