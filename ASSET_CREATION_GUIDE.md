# Asset Creation Guide

## Overview

To create a Real-World Asset (RWA) in Automae, you need to deploy an ERC20 token that represents ownership shares, then register the asset in the AssetRegistry contract.

## Prerequisites

- MetaMask connected to Cronos Testnet
- TCRO tokens for gas fees (get from [Cronos Faucet](https://cronos.org/faucet))
- Foundry installed (for deploying token contracts)

## Step-by-Step Guide

### Step 1: Deploy an AssetToken (ERC20)

Each RWA needs its own ERC20 token to represent ownership shares.

#### Option A: Deploy via Command Line

1. Navigate to the contracts directory:
```bash
cd contracts
```

2. Edit the token parameters in `script/DeployAssetToken.s.sol`:
```solidity
string memory tokenName = "Your Asset Name Token";
string memory tokenSymbol = "YANT";
uint256 totalSupply = 1000000; // Number of shares
uint256 assetId = 1; // Temporary ID
string memory assetName = "Your Asset Name";
```

3. Deploy the token:
```bash
forge script script/DeployAssetToken.s.sol:DeployAssetToken \
  --rpc-url https://evm-t3.cronos.org \
  --broadcast \
  --slow
```

4. Copy the deployed token address from the output.

#### Option B: Use Existing ERC20 Token

For testing purposes, you can use any existing ERC20 token on Cronos Testnet.

### Step 2: Prepare Asset Information

Gather the following information:

1. **Asset Type**:
   - Real Estate (0)
   - Equipment (1)
   - Invoice (2)
   - Supply Chain (3)
   - Other (4)

2. **Asset Name**: e.g., "Luxury Apartment Downtown"

3. **Physical Address**: e.g., "123 Main Street, New York, NY 10001"

4. **Token Address**: The ERC20 token you deployed in Step 1

5. **Total Shares**: Number of ownership shares (should match token supply)

6. **Treasury Address**: Use the deployed AssetTreasury contract:
   ```
   0x07E081136fD1990F1ddECF6d3F44cDACbAf8274f
   ```
   Or deploy a new AssetTreasury for production use.

7. **Metadata URI** (Optional): IPFS link to asset documents/photos

### Step 3: Create Asset via Dashboard

1. Open the Automae Dashboard at http://localhost:3000

2. Connect your wallet (top right corner)

3. Navigate to "Assets" page

4. Click "Create New Asset" button

5. Fill in the form with the information from Step 2

6. Click "Create Asset"

7. Confirm the transaction in MetaMask

8. Wait for transaction confirmation

### Step 4: Verify Asset Creation

1. The asset should appear in your Assets list

2. Check the transaction on [Cronos Testnet Explorer](https://explorer.cronos.org/testnet)

3. Verify the asset details match your input

## Example: Creating a Demo Asset

Here's a complete example for testing:

### 1. Deploy Token
```bash
cd contracts

# Edit script/DeployAssetToken.s.sol with these values:
# tokenName: "Luxury Apartment Token"
# tokenSymbol: "LAT"
# totalSupply: 1000000
# assetName: "Luxury Apartment Downtown"

forge script script/DeployAssetToken.s.sol:DeployAssetToken \
  --rpc-url https://evm-t3.cronos.org \
  --broadcast \
  --slow
```

Output example:
```
AssetToken deployed at: 0x1234567890123456789012345678901234567890
```

### 2. Create Asset in Dashboard

**Form Values:**
- Asset Type: Real Estate
- Asset Name: Luxury Apartment Downtown
- Physical Address: 123 Main Street, New York, NY 10001
- Token Address: 0x1234567890123456789012345678901234567890 (from Step 1)
- Total Shares: 1000000
- Treasury Address: 0x07E081136fD1990F1ddECF6d3F44cDACbAf8274f
- Metadata URI: ipfs://QmExampleHash (optional)

## Troubleshooting

### Error: "Invalid token address"
- Ensure the token address is a valid Ethereum address
- Verify the token is deployed on Cronos Testnet
- Check the address has no typos

### Error: "Invalid treasury address"
- Use the deployed AssetTreasury address: `0x07E081136fD1990F1ddECF6d3F44cDACbAf8274f`
- Or deploy a new AssetTreasury contract

### Transaction Fails
- Ensure you have enough TCRO for gas
- Check that you're connected to Cronos Testnet
- Verify all addresses are valid

### Asset Not Appearing
- Wait a few seconds for the transaction to confirm
- Refresh the page
- Check the browser console for errors

## Advanced: Deploying Custom AssetTreasury

For production use, each asset should have its own treasury:

```bash
cd contracts

forge create src/AssetTreasury.sol:AssetTreasury \
  --rpc-url https://evm-t3.cronos.org \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --constructor-args 1 $YOUR_WALLET_ADDRESS
```

Where:
- `1` is the asset ID (will be updated later)
- `$YOUR_WALLET_ADDRESS` is the treasury owner address

## Next Steps

After creating an asset:

1. **Deploy AI Agents** - Set up agents to manage the asset lifecycle
2. **Configure Workflows** - Define automated operations (rent collection, expense payments, etc.)
3. **Distribute Tokens** - Send tokens to shareholders
4. **Monitor Performance** - Track asset metrics in the dashboard

## Contract Addresses

**Cronos Testnet:**
- AssetRegistry: `0x5e5E90EaC14983d0BaB3b869BA48c7Fe8B42B076`
- DividendDistribution: `0xd4870F305C44226A4F235161E5bcBa66e2C65545`
- AssetTreasury (Sample): `0x07E081136fD1990F1ddECF6d3F44cDACbAf8274f`

## Resources

- [Cronos Testnet Explorer](https://explorer.cronos.org/testnet)
- [Cronos Faucet](https://cronos.org/faucet)
- [Automae Documentation](./docs/)
- [Smart Contracts Source](./contracts/src/)

---

**Need Help?**

Check the [README.md](./README.md) or open an issue on GitHub.
