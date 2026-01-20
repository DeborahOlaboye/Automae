// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AssetToken
 * @notice ERC20 token representing ownership shares of a Real-World Asset
 * @dev Simple token for asset tokenization - one token per asset
 */
contract AssetToken is ERC20, Ownable {
    uint256 public assetId;
    string public assetName;

    /**
     * @notice Creates a new asset token
     * @param name Token name (e.g., "Luxury Apartment Token")
     * @param symbol Token symbol (e.g., "LAT")
     * @param initialSupply Total number of tokens (shares)
     * @param _assetId Associated asset ID from AssetRegistry
     * @param _assetName Human-readable asset name
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _assetId,
        string memory _assetName
    ) ERC20(name, symbol) Ownable(msg.sender) {
        assetId = _assetId;
        assetName = _assetName;
        _mint(msg.sender, initialSupply);
    }

    /**
     * @notice Allows owner to mint additional tokens if needed
     * @param to Address to receive tokens
     * @param amount Number of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Allows owner to burn tokens
     * @param amount Number of tokens to burn
     */
    function burn(uint256 amount) external onlyOwner {
        _burn(msg.sender, amount);
    }
}
