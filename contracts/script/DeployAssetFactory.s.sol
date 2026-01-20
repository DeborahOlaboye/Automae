// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/AssetFactory.sol";

contract DeployAssetFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        // Use the newly deployed AssetRegistry address
        address assetRegistryAddress = 0x096d1137230f1578DB6530EAC969E24D0C00F198;

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying AssetFactory...");
        console.log("AssetRegistry:", assetRegistryAddress);

        AssetFactory factory = new AssetFactory(assetRegistryAddress);

        console.log("=== Deployment Complete ===");
        console.log("AssetFactory deployed at:", address(factory));
        console.log("");
        console.log("Explorer URL:");
        console.log("https://explorer.cronos.org/testnet/address/", vm.toString(address(factory)));

        vm.stopBroadcast();
    }
}
