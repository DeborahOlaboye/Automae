# Automae - Autonomous RWA Lifecycle Manager

**AI Agents That Manage Real-World Assets End-to-End**

Automae uses AI agents and x402 to autonomously manage the entire operational lifecycle of real-world assets, making the $16 trillion RWA market actually usable.

## Project Status

Currently in development for Cronos x402 Paytech Hackathon (December 12, 2025 - January 23, 2026)

## The Problem

Real-world assets (RWAs) are being tokenized, but ALL the operational complexity still happens off-chain:
- Manual rent collection and dividend distribution
- Manual expense management and bill payments
- Manual maintenance scheduling and payments
- Manual compliance reporting and tax filing

**Tokenization without automation = lipstick on a pig**

## The Solution

Automae deploys specialized AI agents that autonomously manage the ENTIRE operational lifecycle of RWAs using x402:
- **Rent Collection Agent**: Automatic rent collection, late fees, notifications
- **Expense Manager Agent**: Automatic bill payments, budget monitoring
- **Dividend Distribution Agent**: Automatic profit distribution to token holders
- **Maintenance Agent**: Scheduled maintenance, emergency response, escrow payments
- **Compliance Agent**: Automatic reporting, regulatory filing, audit trails

## Architecture

```
automae/
├── contracts/           # Foundry smart contracts (Solidity)
│   ├── src/            # Asset Registry, Treasury, Dividend contracts
│   ├── script/         # Deployment scripts
│   └── test/           # Contract tests
├── backend/            # Node.js + TypeScript + Express
│   ├── src/
│   │   ├── agents/     # AI agent implementations
│   │   ├── api/        # REST API endpoints
│   │   ├── config/     # Configuration
│   │   ├── db/         # Database models and migrations
│   │   ├── services/   # Business logic services
│   │   └── utils/      # Utility functions
│   └── tests/          # Backend tests
├── frontend/           # Next.js 14+ React dashboard
│   └── automae-dashboard/
└── docs/               # Documentation
```

## Tech Stack

- **Smart Contracts**: Foundry (Solidity)
- **Backend**: Node.js, TypeScript, Express
- **Frontend**: Next.js 14+, React, TailwindCSS
- **Database**: PostgreSQL
- **Blockchain**: Cronos (EVM-compatible)
- **Payments**: x402 Facilitator SDK
- **Storage**: IPFS (documents)
- **AI/Agents**: Custom agent orchestration system

## Getting Started

### Prerequisites

- Node.js 18+
- Foundry (for smart contracts)
- PostgreSQL 14+
- Cronos wallet with TCRO (testnet)

### Installation

```bash
# Install Foundry (if not installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install contract dependencies
cd contracts
forge install

# Install backend dependencies
cd ../backend
npm install

# Install frontend dependencies
cd ../frontend/automae-dashboard
npm install
```

### Configuration

1. Copy `.env.example` to `.env` and configure:
   - Cronos RPC endpoints
   - x402 API credentials
   - Database connection
   - Private keys (for deployment)

2. Set up PostgreSQL database:
```bash
createdb automae_dev
```

### Development

```bash
# Terminal 1: Start Postgres
# (or use your preferred method)

# Terminal 2: Run smart contract tests
cd contracts
forge test

# Terminal 3: Start backend API
cd backend
npm run dev

# Terminal 4: Start frontend
cd frontend/automae-dashboard
npm run dev
```

## Features

### Core Infrastructure
- ✅ Asset registry smart contracts
- ✅ Agent orchestrator
- ✅ x402 payment engine
- ✅ Dashboard UI

### AI Agents (MVP)
- ✅ Rent Collection Agent
- ✅ Expense Manager Agent
- ✅ Dividend Distribution Agent

### Key Workflows
- ✅ Monthly rent collection with late fees
- ✅ Automated expense payments
- ✅ Proportional dividend distribution
- ✅ Compliance reporting

## Demo Use Case: Tokenized Rental Property

A $500K rental property tokenized into 1000 shares with 10 token holders:

**Month 1 Autonomous Operations:**
1. **Day 1**: Rent Collection Agent charges tenant $2,000 via x402
2. **Day 5**: Expense Manager pays property tax ($400), insurance ($150), HOA ($200)
3. **Day 8**: Maintenance Agent schedules AC filter replacement, pays contractor $150
4. **Day 15**: Dividend Agent distributes $1,100 net income to 10 token holders
5. **Day 30**: Compliance Agent generates monthly report, files on-chain

**All autonomous. All via x402. Zero human intervention.**

## Hackathon Submission

- **Tracks**: Main Track, Best x402 AI Agentic Finance Solution
- **Innovation**: First autonomous RWA operations platform
- **Market**: Unlocks $16 trillion RWA market
- **Platform**: Works for any asset type (real estate, equipment, invoices, supply chain)

## Roadmap

### Post-Hackathon (Months 1-3)
- Onboard 10 real properties
- Expand to equipment leasing
- Mobile app for stakeholders
- Advanced analytics

### Enterprise (Months 4-6)
- Institutional-grade security
- KYC/AML compliance automation
- Multi-jurisdiction support
- White-label solution

### Scale (Months 7-9)
- 1000+ assets under management
- Multiple asset classes
- AI-powered optimization
- Developer platform & marketplace

## License

MIT

## Contact

- GitHub: [automae](https://github.com/DeborahOlaboye/Automae)
- Twitter: [@AutomaeRWA](https://twitter.com/Automae)
- Website: automae.ai (coming soon)

---

**Built for Cronos x402 Paytech Hackathon**
*"Making RWAs Actually Usable"*
