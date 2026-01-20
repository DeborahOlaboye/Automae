# Automae Contracts - Deployment Information

## ✅ Deployed to Cronos Testnet

**Deployment Date:** January 9, 2026
**Chain ID:** 338
**Network:** Cronos Testnet
**Deployer Address:** `0x2c8D82a53f11B0E9B527a111B2f53C5D5E809806`
**Verification Status:** ⚠️ Deployed but not verified (see VERIFICATION_GUIDE.md)

---

## 📝 Deployed Contracts

### AssetRegistry
- **Address:** `0x5e5E90EaC14983d0BaB3b869BA48c7Fe8B42B076`
- **Explorer:** https://explorer.cronos.org/testnet/address/0x5e5E90EaC14983d0BaB3b869BA48c7Fe8B42B076
- **Purpose:** Central registry for all Real-World Assets (RWAs)
- **Features:**
  - Asset registration and lifecycle management
  - Ownership tracking via ERC20 tokens
  - Agent assignment and management
  - Metadata storage (IPFS integration)

### DividendDistribution
- **Address:** `0xd4870F305C44226A4F235161E5bcBa66e2C65545`
- **Explorer:** https://explorer.cronos.org/testnet/address/0xd4870F305C44226A4F235161E5bcBa66e2C65545
- **Purpose:** Handles proportional dividend distribution to token holders
- **Features:**
  - Automated dividend calculations based on token ownership
  - Claim tracking and management
  - Support for multiple distribution periods
  - Agent-controlled distributions

### AssetTreasury
- **Address:** `0x07E081136fD1990F1ddECF6d3F44cDACbAf8274f`
- **Explorer:** https://explorer.cronos.org/testnet/address/0x07E081136fD1990F1ddECF6d3F44cDACbAf8274f
- **Purpose:** Manages funds for individual assets
- **Features:**
  - Income collection (rent, lease payments)
  - Expense management (bills, taxes, maintenance)
  - Transaction tracking and history
  - Role-based access control (agents, owners)
  - Reference-based payment processing

---

## 🔧 Network Configuration

### Add to MetaMask

```
Network Name: Cronos Testnet
RPC URL: https://evm-t3.cronos.org
Chain ID: 338
Currency Symbol: TCRO
Block Explorer: https://explorer.cronos.org/testnet
```

### Foundry Configuration

The contracts use the following settings:
- **Solidity Version:** 0.8.23
- **Optimizer:** Enabled (200 runs)
- **EVM Version:** Shanghai
- **Via IR:** Enabled (for complex contracts)

---

## 🎯 Frontend Integration

### Contract ABIs

The compiled ABIs are located in:
```
contracts/out/AssetRegistry.sol/AssetRegistry.json
contracts/out/DividendDistribution.sol/DividendDistribution.json
contracts/out/AssetTreasury.sol/AssetTreasury.json
```

### Environment Variables for Frontend

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_CRONOS_TESTNET_RPC=https://evm-t3.cronos.org
NEXT_PUBLIC_CHAIN_ID=338

# Contract Addresses
NEXT_PUBLIC_ASSET_REGISTRY=0x5e5E90EaC14983d0BaB3b869BA48c7Fe8B42B076
NEXT_PUBLIC_DIVIDEND_DISTRIBUTION=0xd4870F305C44226A4F235161E5bcBa66e2C65545
NEXT_PUBLIC_ASSET_TREASURY=0x07E081136fD1990F1ddECF6d3F44cDACbAf8274f
```

---

## 🔐 Security Notes

- All contracts use OpenZeppelin's audited libraries
- Role-based access control (RBAC) implemented
- ReentrancyGuard protection on financial functions
- Owner can manage assets and assign agents
- Agents have limited permissions for specific operations

---

## 🚀 Next Steps

1. **Get Test Tokens:**
   - Visit: https://faucets.chain.link/cronos-testnet
   - Or: https://thirdweb.com/cronos-testnet (scroll to Faucet section)

2. **Interact with Contracts:**
   - Use the frontend dashboard at http://localhost:3000
   - Or use Foundry's cast commands
   - Or interact directly via the block explorer

3. **Deploy Additional Treasuries:**
   ```bash
   forge script script/Deploy.s.sol:DeployScript --rpc-url cronos_testnet --broadcast --legacy
   ```

4. **Test Agent Operations:**
   - Register new assets via AssetRegistry
   - Simulate income/expense transactions
   - Test dividend distributions

---

## 📚 Contract Documentation

### Key Functions

#### AssetRegistry
- `registerAsset()` - Create new RWA
- `assignAgent()` - Assign AI agent to asset
- `updateAssetState()` - Change asset lifecycle state
- `getAsset()` - Retrieve asset details

#### DividendDistribution
- `createDistribution()` - Initialize new distribution
- `claimDividend()` - Token holders claim their share
- `registerAssetToken()` - Link asset to its token

#### AssetTreasury
- `recordIncome()` - Log incoming payments
- `payExpense()` - Execute expense payments
- `getBalance()` - Check current treasury balance
- `getTransactionHistory()` - View all transactions

---

## 📞 Support

For issues or questions:
- Check the contracts source code in `contracts/src/`
- View deployment transactions on Cronos explorer
- Review the frontend integration code

---

**Built for Cronos x402 Paytech Hackathon 2026** 🏆
