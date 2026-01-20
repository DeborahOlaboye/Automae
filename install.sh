#!/bin/bash

# Automae Installation Script
# This script sets up the development environment

set -e

echo "🏗️  Automae - Autonomous RWA Lifecycle Manager"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Foundry is installed
echo "📦 Checking prerequisites..."
if ! command -v forge &> /dev/null; then
    echo -e "${YELLOW}Foundry not found. Installing...${NC}"
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
else
    echo -e "${GREEN}✓ Foundry installed${NC}"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org/${NC}"
    exit 1
else
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}✗ Node.js version must be 18 or higher. Current: $(node -v)${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js $(node -v) installed${NC}"
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠ PostgreSQL not found. Please install PostgreSQL 14+ from https://www.postgresql.org/download/${NC}"
    echo "  Continuing without database setup..."
else
    echo -e "${GREEN}✓ PostgreSQL installed${NC}"
fi

echo ""
echo "📦 Installing Smart Contract Dependencies..."
cd contracts

# Install OpenZeppelin contracts
echo "Installing OpenZeppelin contracts..."
if [ ! -d "lib/openzeppelin-contracts" ]; then
    forge install OpenZeppelin/openzeppelin-contracts --no-commit
    echo -e "${GREEN}✓ OpenZeppelin contracts installed${NC}"
else
    echo -e "${GREEN}✓ OpenZeppelin contracts already installed${NC}"
fi

# Copy environment file
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠ Created contracts/.env - Please update with your private keys!${NC}"
else
    echo -e "${GREEN}✓ contracts/.env exists${NC}"
fi

# Build contracts
echo "Building smart contracts..."
forge build
echo -e "${GREEN}✓ Smart contracts compiled${NC}"

cd ..

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend

# Install npm packages
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Copy environment file
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠ Created backend/.env - Please update with your configuration!${NC}"
else
    echo -e "${GREEN}✓ backend/.env exists${NC}"
fi

cd ..

echo ""
echo "✅ Installation Complete!"
echo ""
echo "📝 Next Steps:"
echo "  1. Update contracts/.env with your Cronos testnet private key"
echo "  2. Get testnet TCRO from: https://cronos.org/faucet"
echo "  3. Update backend/.env with your database and API credentials"
echo "  4. Create PostgreSQL database: createdb automae_dev"
echo "  5. Deploy contracts: cd contracts && forge script script/Deploy.s.sol --broadcast"
echo "  6. Start backend: cd backend && npm run dev"
echo ""
echo "📖 Documentation:"
echo "  - Getting Started: docs/GETTING_STARTED.md"
echo "  - Project Status: PROJECT_STATUS.md"
echo "  - Build Plan: build.md"
echo ""
echo "🚀 Ready to build Automae!"
