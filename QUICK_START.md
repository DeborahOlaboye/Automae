# Automae Quick Start Guide

## Current Status ✅

All core systems are deployed and operational:

- ✅ Smart contracts deployed to Cronos Testnet
- ✅ Frontend running at http://localhost:3000
- ✅ Asset creation modal functional
- ✅ Contract addresses configured
- ✅ No console errors

## How to Create Your First Asset (2 Minutes)

### Quick Method: Deploy a Test Token

1. **Deploy an AssetToken:**
   ```bash
   cd contracts

   forge script script/DeployAssetToken.s.sol:DeployAssetToken \
     --rpc-url https://evm-t3.cronos.org \
     --broadcast \
     --slow
   ```

2. **Copy the token address** from the output

3. **Open Dashboard:** http://localhost:3000

4. **Click "Create New Asset"**

5. **Fill the form:**
   - Asset Type: Real Estate
   - Asset Name: Test Property
   - Physical Address: 123 Test St
   - Token Address: [paste from step 2]
   - Total Shares: 1000000
   - Treasury Address: `0x07E081136fD1990F1ddECF6d3F44cDACbAf8274f`
   - Metadata URI: (leave empty)

6. **Click "Create Asset"** and confirm in MetaMask

## What You've Built

### Smart Contracts (Deployed on Cronos Testnet)

| Contract | Address | Purpose |
|----------|---------|---------|
| AssetRegistry | `0x5e5E90EaC14983d0BaB3b869BA48c7Fe8B42B076` | Tracks all RWA assets |
| DividendDistribution | `0xd4870F305C44226A4F235161E5bcBa66e2C65545` | Manages dividend payments |
| AssetTreasury | `0x07E081136fD1990F1ddECF6d3F44cDACbAf8274f` | Holds asset funds |

### Frontend Features

- ✅ Wallet connection (MetaMask)
- ✅ Asset listing
- ✅ Asset creation modal
- ✅ Contract information display
- ✅ Responsive layout
- ✅ Network detection

### Backend (Ready for AI Agents)

The architecture is ready for deploying AI agents that will:
- Collect rent automatically
- Pay expenses via x402
- Distribute dividends
- Manage maintenance
- Generate compliance reports

## Next Steps (From build.md)

According to your build plan, you're in **Week 4-5** of development. Here's what's next:

### Immediate (This Week)
1. ✅ Asset creation - **DONE**
2. ⬜ Deploy AI agents infrastructure
3. ⬜ Integrate x402 payment engine
4. ⬜ Set up agent orchestrator

### Agents to Build (Week 4-5)
- Rent Collection Agent
- Expense Manager Agent
- Dividend Distribution Agent
- Maintenance Agent
- Compliance Agent

### Demo Preparation (Week 6)
- Complete monthly cycle simulation
- Edge case testing (late rent, emergency repairs)
- Video production
- Mainnet deployment

## Useful Commands

### Frontend
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Production build
```

### Contracts
```bash
cd contracts
forge build          # Compile contracts
forge test           # Run tests
forge script ...     # Deploy contracts
```

### Check Deployment
```bash
cast call 0x5e5E90EaC14983d0BaB3b869BA48c7Fe8B42B076 \
  "getTotalAssets()" \
  --rpc-url https://evm-t3.cronos.org
```

## Resources

- **Full Build Plan**: [build.md](./build.md)
- **Asset Creation Guide**: [ASSET_CREATION_GUIDE.md](./ASSET_CREATION_GUIDE.md)
- **Deployment Fix Log**: [DEPLOYMENT_FIX_SUMMARY.md](./DEPLOYMENT_FIX_SUMMARY.md)
- **Architecture**: [README.md](./README.md)

## Hackathon Timeline

**Cronos x402 Paytech Hackathon**
- Start: December 12, 2025
- End: January 23, 2026
- **Time Remaining**: ~2 weeks to submission

**Your Position**: Week 4-5 of 6-week plan - on track! 🎯

## Need Help?

1. Check browser console for errors
2. Verify wallet is on Cronos Testnet (Chain ID: 338)
3. Ensure you have TCRO for gas
4. Review [ASSET_CREATION_GUIDE.md](./ASSET_CREATION_GUIDE.md)

---

**You're ready to create assets! 🚀**

Next: Build the AI agents to make them autonomous.
