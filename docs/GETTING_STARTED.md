# Getting Started with Automae

This guide will help you set up the Automae development environment and start building.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Foundry** (for smart contracts) - Install with:
  ```bash
  curl -L https://foundry.paradigm.xyz | bash
  foundryup
  ```
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** (for version control)

## Installation Steps

### 1. Smart Contracts Setup

```bash
# Navigate to contracts directory
cd contracts

# Install OpenZeppelin contracts
forge install OpenZeppelin/openzeppelin-contracts

# Copy environment file
cp .env.example .env

# Edit .env with your private keys (NEVER commit real keys!)
nano .env

# Compile contracts
forge build

# Run tests
forge test

# Run tests with gas report
forge test --gas-report
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Create PostgreSQL database
createdb automae_dev

# Run in development mode
npm run dev
```

The backend API will be available at `http://localhost:3001`

### 3. Frontend Setup (Coming Soon)

```bash
# Navigate to frontend directory
cd frontend/automae-dashboard

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=automae_dev
DB_USER=postgres
DB_PASSWORD=your_password

# Cronos Network
CRONOS_TESTNET_RPC=https://evm-t3.cronos.org
DEPLOYER_PRIVATE_KEY=your_private_key

# x402 (get from x402 dashboard)
X402_API_KEY=your_api_key
X402_API_SECRET=your_api_secret
```

### Contract Environment Variables

Edit `contracts/.env`:

```env
DEPLOYER_PRIVATE_KEY=0x...your_private_key
CRONOS_TESTNET_RPC=https://evm-t3.cronos.org
```

## Getting Test Tokens

### Cronos Testnet TCRO

1. Go to [Cronos Testnet Faucet](https://cronos.org/faucet)
2. Enter your wallet address
3. Request test tokens
4. Wait for confirmation

## Deploying Contracts

### Deploy to Cronos Testnet

```bash
cd contracts

# Deploy AssetRegistry
forge script script/DeployAssetRegistry.s.sol:DeployAssetRegistry \
  --rpc-url cronos_testnet \
  --broadcast \
  --verify

# Deploy AssetTreasury
forge script script/DeployAssetTreasury.s.sol:DeployAssetTreasury \
  --rpc-url cronos_testnet \
  --broadcast

# Deploy DividendDistribution
forge script script/DeployDividendDistribution.s.sol:DeployDividendDistribution \
  --rpc-url cronos_testnet \
  --broadcast
```

After deployment, update `backend/.env` with the deployed contract addresses.

## Running the Full Stack

### Terminal 1: Database
```bash
# Make sure PostgreSQL is running
# If using Postgres.app, it should be running already
# Otherwise:
pg_ctl start
```

### Terminal 2: Backend
```bash
cd backend
npm run dev
```

### Terminal 3: Frontend (when ready)
```bash
cd frontend/automae-dashboard
npm run dev
```

## Verifying Installation

### Check Backend Health
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

### Check API Routes
```bash
curl http://localhost:3001/api/v1
```

### Check Agent Orchestrator
```bash
curl http://localhost:3001/api/v1/agents/status/overview
```

## Development Workflow

1. **Smart Contracts**: Make changes in `contracts/src/`
2. **Compile**: Run `forge build`
3. **Test**: Run `forge test`
4. **Deploy**: Deploy to testnet
5. **Backend**: Update contract ABIs and addresses
6. **Test Integration**: Test agent interactions with contracts
7. **Frontend**: Build UI components

## Next Steps

- Read the [Architecture Documentation](./ARCHITECTURE.md)
- Review the [Build Plan](../build.md)
- Explore the [API Documentation](./API.md)
- Check out [Agent Development Guide](./AGENT_DEVELOPMENT.md)

## Troubleshooting

### Database Connection Fails
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -l | grep automae`

### Contract Deployment Fails
- Check you have test TCRO in your wallet
- Verify RPC endpoint is correct
- Ensure private key is valid (without '0x' prefix in some cases)

### Backend Won't Start
- Check all environment variables are set
- Ensure database is running and accessible
- Check Node.js version: `node --version` (should be 18+)

## Getting Help

- Review documentation in `docs/` directory
- Check build plan in `build.md`
- Review error logs in `backend/logs/`

## Security Notes

- **NEVER** commit `.env` files with real private keys
- **ALWAYS** use testnet for development
- **NEVER** share private keys or API secrets
- Keep your `.env` files in `.gitignore`
