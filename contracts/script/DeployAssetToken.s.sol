// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/AssetToken.sol";

/**
 * @title DeployAssetToken
 * @notice Script to deploy a new AssetToken for a real-world asset
 * @dev Usage: forge script script/DeployAssetToken.s.sol:DeployAssetToken --rpc-url cronos_testnet --broadcast
 */
contract DeployAssetToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        // Asset configuration - modify these values before deploying
        string memory tokenName = "Luxury Apartment Token";
        string memory tokenSymbol = "LAT";
        uint256 totalSupply = 1000000; // 1 million shares
        uint256 assetId = 1; // Will be updated after AssetRegistry creation
        string memory assetName = "Luxury Apartment Downtown";

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying AssetToken...");
        console.log("Token Name:", tokenName);
        console.log("Token Symbol:", tokenSymbol);
        console.log("Total Supply:", totalSupply);
        console.log("Asset ID:", assetId);
        console.log("");

        AssetToken token = new AssetToken(
            tokenName,
            tokenSymbol,
            totalSupply,
            assetId,
            assetName
        );

        console.log("=== Deployment Complete ===");
        console.log("AssetToken deployed at:", address(token));
        console.log("");
        console.log("Use this address when creating your asset in the dashboard!");
        console.log("");
        console.log("Explorer URL:");
        console.log("https://explorer.cronos.org/testnet/address/", vm.toString(address(token)));

        vm.stopBroadcast();
    }
}
