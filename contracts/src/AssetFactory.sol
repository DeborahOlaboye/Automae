// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./AssetRegistry.sol";
import "./AssetToken.sol";
import "./AssetTreasury.sol";

/**
 * @title AssetFactory
 * @notice One-click asset creation - deploys token, treasury, and registers asset
 * @dev Simplifies asset creation to a single transaction
 */
contract AssetFactory {
    AssetRegistry public immutable assetRegistry;

    event AssetCreatedComplete(
        uint256 indexed assetId,
        address indexed owner,
        address tokenAddress,
        address treasuryAddress,
        string name
    );

    constructor(address _assetRegistry) {
        assetRegistry = AssetRegistry(_assetRegistry);
    }

    /**
     * @notice Create a complete asset with token and treasury in one transaction
     * @param assetType Type of asset (0=RealEstate, 1=Equipment, etc.)
     * @param name Asset name
     * @param physicalAddress Physical location/address
     * @param totalShares Total number of ownership shares
     * @param metadataURI IPFS hash for asset metadata
     * @param tokenName Name for the ERC20 token
     * @param tokenSymbol Symbol for the ERC20 token
     * @return assetId The created asset ID
     * @return tokenAddress The deployed token address
     * @return treasuryAddress The deployed treasury address
     */
    function createCompleteAsset(
        AssetRegistry.AssetType assetType,
        string memory name,
        string memory physicalAddress,
        uint256 totalShares,
        string memory metadataURI,
        string memory tokenName,
        string memory tokenSymbol
    ) external returns (
        uint256 assetId,
        address tokenAddress,
        address treasuryAddress
    ) {
        // First, create the asset in the registry to get the asset ID
        // Use a temporary address for token and treasury
        assetId = assetRegistry.createAsset(
            assetType,
            name,
            physicalAddress,
            address(this), // Temporary token address
            totalShares,
            address(this), // Temporary treasury address
            metadataURI
        );

        // Deploy the token with the actual asset ID
        AssetToken token = new AssetToken(
            tokenName,
            tokenSymbol,
            totalShares,
            assetId,
            name
        );
        tokenAddress = address(token);

        // Deploy the treasury with the asset ID and user as owner
        AssetTreasury treasury = new AssetTreasury(
            assetId,
            msg.sender
        );
        treasuryAddress = address(treasury);

        // Update the asset with the actual addresses
        assetRegistry.updateAssetAddresses(assetId, tokenAddress, treasuryAddress);

        // Transfer token ownership to the user
        token.transferOwnership(msg.sender);

        emit AssetCreatedComplete(
            assetId,
            msg.sender,
            tokenAddress,
            treasuryAddress,
            name
        );

        return (assetId, tokenAddress, treasuryAddress);
    }

    /**
     * @notice Get the addresses for a created asset
     * @param assetId The asset ID
     * @return asset The asset data
     */
    function getAsset(uint256 assetId) external view returns (AssetRegistry.Asset memory) {
        return assetRegistry.getAsset(assetId);
    }
}
