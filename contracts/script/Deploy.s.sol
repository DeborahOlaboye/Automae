// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/AssetRegistry.sol";
import "../src/AssetTreasury.sol";
import "../src/DividendDistribution.sol";

contract DeployScript is Script {
    function run() external {
        // Get deployment configuration from environment
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address initialOwner = vm.envAddress("INITIAL_OWNER");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying Automae contracts to Cronos Testnet...");
        console.log("Deployer:", deployer);
        console.log("Initial Owner:", initialOwner);
        console.log("");

        // Deploy AssetRegistry (no constructor parameters - uses msg.sender as owner)
        console.log("Deploying AssetRegistry...");
        AssetRegistry assetRegistry = new AssetRegistry();
        console.log("AssetRegistry deployed at:", address(assetRegistry));
        console.log("");

        // Deploy DividendDistribution
        console.log("Deploying DividendDistribution...");
        DividendDistribution dividendDistribution = new DividendDistribution();
        console.log("DividendDistribution deployed at:", address(dividendDistribution));
        console.log("");

        // Deploy a sample AssetTreasury for demonstration
        console.log("Deploying sample AssetTreasury...");
        AssetTreasury assetTreasury = new AssetTreasury(1, initialOwner); // Asset ID 1, owner
        console.log("AssetTreasury deployed at:", address(assetTreasury));
        console.log("");

        console.log("=== Deployment Summary ===");
        console.log("AssetRegistry:", address(assetRegistry));
        console.log("DividendDistribution:", address(dividendDistribution));
        console.log("AssetTreasury (sample):", address(assetTreasury));
        console.log("");
        console.log("Save these addresses for frontend integration!");

        vm.stopBroadcast();
    }
}
