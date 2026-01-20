# Automae - Quick Start Guide

Get Automae up and running in 15 minutes.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed
- [ ] Foundry installed (or will auto-install)
- [ ] Cronos wallet with testnet TCRO

## 1. Automated Installation (5 minutes)

```bash
# Run the installation script
./install.sh
```

This will:
- Install Foundry (if needed)
- Install OpenZeppelin contracts
- Install backend dependencies
- Create .env files
- Compile smart contracts

## 2. Configuration (3 minutes)

### Get Testnet TCRO
1. Visit [Cronos Testnet Faucet](https://cronos.org/faucet)
2. Enter your wallet address
3. Request test tokens

### Configure Contracts
Edit `contracts/.env`:
```env
DEPLOYER_PRIVATE_KEY=your_private_key_here
CRONOS_TESTNET_RPC=https://evm-t3.cronos.org
```

### Configure Backend
Edit `backend/.env`:
```env
# Database (update if needed)
DB_HOST=localhost
DB_NAME=automae_dev
DB_USER=postgres
DB_PASSWORD=your_password

# Will update after contract deployment
CRONOS_TESTNET_RPC=https://evm-t3.cronos.org
DEPLOYER_PRIVATE_KEY=your_private_key_here
```

## 3. Database Setup (2 minutes)

```bash
# Create database
createdb automae_dev

# Database will auto-sync when backend starts
```

## 4. Deploy Contracts (3 minutes)

```bash
cd contracts

# Test compilation
forge build

# Run tests (optional)
forge test

# Deploy to Cronos testnet
forge script script/Deploy.s.sol \
  --rpc-url cronos_testnet \
  --broadcast

# Note the deployed addresses
```

Update `backend/.env` with deployed addresses:
```env
ASSET_REGISTRY_ADDRESS=0x...
TREASURY_ADDRESS=0x...
DIVIDEND_DISTRIBUTION_ADDRESS=0x...
```

## 5. Start Backend (1 minute)

```bash
cd backend

# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

Expected output:
```
Automae Backend Server running on port 3001
Environment: development
Health check: http://localhost:3001/health
```

## 6. Verify Installation (1 minute)

### Test Health Endpoint
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-09T...",
  "service": "automae-backend",
  "version": "0.1.0"
}
```

### Test API
```bash
curl http://localhost:3001/api/v1
```

### Check Agent Orchestrator
```bash
curl http://localhost:3001/api/v1/agents/status/overview
```

Expected response:
```json
{
  "success": true,
  "data": {
    "initialized": true,
    "totalAgents": 0,
    "agentsByStatus": { ... },
    "agentsByType": { ... }
  }
}
```

## 7. Next Steps

### Create Your First Asset
```bash
# Coming soon - use API to create asset
curl -X POST http://localhost:3001/api/v1/assets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "123 Main St Property",
    "assetType": "RealEstate",
    "totalShares": 1000
  }'
```

### Deploy Agents
```bash
# Coming soon - agents will be implemented
```

### View Dashboard
```bash
# Frontend coming in Week 4
cd frontend/automae-dashboard
npm run dev
```

## Troubleshooting

### Foundry Not Found
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### PostgreSQL Connection Failed
```bash
# Check PostgreSQL is running
pg_isready

# Check database exists
psql -l | grep automae

# Create database if missing
createdb automae_dev
```

### Contract Deployment Failed
- Ensure you have testnet TCRO
- Check private key format (no 0x prefix)
- Verify RPC URL is correct

### Backend Won't Start
```bash
# Check Node version
node -v  # Should be 18+

# Install dependencies
cd backend
rm -rf node_modules
npm install

# Check .env file exists
ls -la backend/.env
```

## Development Workflow

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Contract Work
```bash
cd contracts
forge test --watch
```

### Terminal 3: Commands
```bash
# Test API endpoints
curl http://localhost:3001/api/v1/...
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `contracts/src/*.sol` | Smart contracts |
| `backend/src/index.ts` | Backend entry point |
| `backend/src/agents/orchestrator.ts` | Agent manager |
| `backend/.env` | Backend configuration |
| `contracts/.env` | Contract configuration |
| `docs/GETTING_STARTED.md` | Detailed setup guide |
| `PROJECT_STATUS.md` | Development progress |

## Documentation

- 📖 [Getting Started Guide](docs/GETTING_STARTED.md) - Detailed setup
- 📊 [Project Status](PROJECT_STATUS.md) - Current progress
- 🏗️ [Build Plan](build.md) - Complete roadmap
- 📝 [Build Summary](INITIAL_BUILD_SUMMARY.md) - What's been built

## Support

Having issues? Check:
1. [Troubleshooting](#troubleshooting) section above
2. [Getting Started Guide](docs/GETTING_STARTED.md)
3. Error logs in `backend/logs/`
4. Contract error messages

## What's Working

✅ Smart contract compilation
✅ Backend API server
✅ Database connection
✅ Agent orchestrator
✅ Health checks
✅ API routing

## What's Next

🔜 Agent implementations (Rent, Expense, Dividend)
🔜 x402 payment integration
🔜 Frontend dashboard
🔜 Complete workflows

---

**Time to Working System**: ~15 minutes
**Ready for**: Agent implementation and x402 integration

🚀 **You're ready to build Automae!**
