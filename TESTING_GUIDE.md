# Automae - Testing Guide

## 🎯 What's Real vs What's Mock

**ALL MOCK DATA HAS BEEN REMOVED** - The frontend now only shows real blockchain data or clearly states "Not Implemented"

---

## ✅ What Actually Works (Real Blockchain Integration)

### 1. Wallet Connection
**Status**: ✅ FULLY FUNCTIONAL

**Test Steps**:
1. Open http://localhost:3000/dashboard
2. Click "Connect Wallet" in top right
3. Approve MetaMask connection
4. Approve network switch to Cronos Testnet

**What You'll See**:
- Your wallet address displayed (shortened)
- Green "Connected" indicator
- Network automatically switches to Cronos Testnet

**What's Real**:
- Actual wallet connection via ethers.js
- Real Cronos Testnet RPC communication
- Your actual wallet address

---

### 2. Asset Count from Blockchain
**Status**: ✅ FULLY FUNCTIONAL

**Test Steps**:
1. Connect your wallet
2. Go to http://localhost:3000/dashboard
3. Look at the first stat card "Total Assets"

**What You'll See**:
- "..." while loading
- A number (currently "0" if no assets exist)
- Label says "(On-Chain)" to indicate it's real data

**What's Real**:
- Fetched from AssetRegistry contract: `0x5e5E90EaC14983d0BaB3b869BA48c7Fe8B42B076`
- Calls `getNextAssetId()` function
- Shows actual count of assets in the contract

**Contract Call**:
```javascript
// This is what happens under the hood:
const nextId = await assetRegistry.getNextAssetId();
const assetCount = Number(nextId);
// If nextId = 1, there are 0 assets (IDs start at 1)
// If nextId = 3, there are 2 assets (IDs 1 and 2)
```

---

### 3. Assets Page - Real Blockchain Data
**Status**: ✅ FULLY FUNCTIONAL

**Test Steps**:
1. Connect your wallet
2. Go to http://localhost:3000/dashboard/assets
3. Wait for loading to complete

**What You'll See** (if no assets exist):
- Blue info box saying "No Assets Yet"
- Clear call-to-action to create first asset

**What You'll See** (if assets exist):
- Asset cards with real data from blockchain
- Asset ID, name, type, location
- Token address, total shares, treasury address
- Created timestamp

**What's Real**:
- All data from AssetRegistry contract
- Fetches each asset using `getAsset(assetId)`
- Shows only assets where `exists = true`

**Asset Data Structure**:
```typescript
{
  id: number              // From blockchain
  name: string            // From blockchain
  assetType: number       // 0=RealEstate, 1=Equipment, etc.
  state: number           // 0=Draft, 1=Active, etc.
  physicalAddress: string // Location from blockchain
  tokenAddress: string    // ERC20 token address
  totalShares: bigint     // Number of shares
  treasuryAddress: string // Treasury contract address
  createdAt: bigint       // Unix timestamp
  metadataURI: string     // IPFS hash (if set)
}
```

---

### 4. Contract Information
**Status**: ✅ FULLY FUNCTIONAL

**Test Steps**:
1. Go to http://localhost:3000/dashboard/assets
2. Look at the right sidebar "Contract Addresses"

**What You'll See**:
- AssetRegistry address
- DividendDistribution address
- AssetTreasury address
- Copy buttons (click to copy address)
- Explorer links (click to view on Cronos Explorer)

**What's Real**:
- Actual deployed contract addresses
- Links to Cronos Testnet block explorer
- Network info (Chain ID 338, etc.)

---

### 5. Network & Wallet Settings
**Status**: ✅ FULLY FUNCTIONAL

**Test Steps**:
1. Connect your wallet
2. Go to http://localhost:3000/dashboard/settings

**What You'll See**:
- Your full wallet address
- Shortened wallet address
- Network: Cronos Testnet
- Chain ID: 338
- Currency: TCRO
- RPC URL
- Block Explorer URL

**What's Real**:
- Your actual connected wallet address
- Real network configuration
- Actual Cronos Testnet settings

---

## ❌ What's NOT Implemented

### Dashboard Page
- ❌ Monthly Income (shows "-")
- ❌ Total Value (shows "-")
- ❌ Active Agents count (shows "-")

### Assets Page
- ❌ Create Asset button (not functional)
- ❌ Search functionality
- ❌ Filters

### Agents Page
- ❌ Everything (shows "Not Implemented" notice)
- No agents exist in contracts yet

### Analytics Page
- ❌ Everything (shows "Not Implemented" notice)
- Needs to aggregate treasury data

### Transactions Page
- ❌ Everything (shows "Not Implemented" notice)
- Needs to query treasury transactions

### Settings Page
- ❌ Profile settings
- ❌ Notifications
- ❌ Security settings
- ✅ Wallet info (working)
- ✅ Network info (working)

---

## 🧪 How to Test the Integration

### Test 1: Wallet Connection
```
1. Open http://localhost:3000/dashboard
2. Click "Connect Wallet"
3. Verify MetaMask popup appears
4. Approve connection
5. Verify wallet address appears in header
6. Verify you're on Cronos Testnet (Chain ID 338)
```

**Expected Result**: ✅ Wallet connects, address shown

---

### Test 2: Asset Count from Blockchain
```
1. Ensure wallet is connected
2. Go to http://localhost:3000/dashboard
3. Look at "Total Assets" card
4. Note the number shown
```

**Expected Result**: ✅ Shows "0" (or number of assets if you've created any)

**Verify It's Real**:
- Open browser DevTools (F12)
- Go to Network tab
- Filter by "evm-t3.cronos.org"
- You'll see actual RPC calls to Cronos Testnet

---

### Test 3: Assets Page Loading
```
1. Ensure wallet is connected
2. Go to http://localhost:3000/dashboard/assets
3. Watch for loading spinner
4. Wait for content to load
```

**Expected Result**:
- ✅ Shows loading spinner
- ✅ Shows "No Assets Yet" (if no assets exist)
- ✅ Shows asset cards (if assets exist)

---

### Test 4: Contract Address Copy
```
1. Go to http://localhost:3000/dashboard/assets
2. Find "Contract Addresses" section
3. Click copy button next to AssetRegistry
4. Paste somewhere to verify
```

**Expected Result**: ✅ Address `0x5e5E90EaC14983d0BaB3b869BA48c7Fe8B42B076` copied

---

### Test 5: Explorer Links
```
1. Go to http://localhost:3000/dashboard/assets
2. Find "Contract Addresses" section
3. Click the external link icon next to AssetRegistry
```

**Expected Result**: ✅ Opens Cronos Testnet Explorer showing the contract

---

### Test 6: Wallet Disconnect & Reconnect
```
1. Connect wallet (if not connected)
2. Click disconnect button (logout icon)
3. Verify wallet disconnects
4. Click "Connect Wallet" again
5. Verify reconnection works
```

**Expected Result**: ✅ Clean disconnect and reconnect

---

## 🔍 Debugging Tips

### Check if Data is from Blockchain

**Open Browser Console** (F12 → Console):
```javascript
// The frontend uses these hooks:
// useAssets() - fetches from blockchain
// useAssetRegistry() - creates contract instance

// You can see the calls in Network tab:
// Filter: evm-t3.cronos.org
// Method: POST (JSON-RPC calls)
```

### Check Contract Calls

**Network Tab**:
1. Open DevTools (F12)
2. Go to Network tab
3. Filter: "evm-t3.cronos.org"
4. Look for POST requests
5. Click to see request/response

**Example Request**:
```json
{
  "method": "eth_call",
  "params": [
    {
      "to": "0x5e5E90EaC14983d0BaB3b869BA48c7Fe8B42B076",
      "data": "0x..." // Encoded function call
    }
  ]
}
```

---

## 📊 What Each Page Shows

### Dashboard (`/dashboard`)
- ✅ Real: Asset count from blockchain
- ✅ Real: Your wallet address
- ❌ Mock: None (removed)
- ❌ Not Impl: Income, value, agents

### Assets (`/dashboard/assets`)
- ✅ Real: Asset list from blockchain
- ✅ Real: Contract addresses
- ✅ Real: Network info
- ❌ Mock: None (removed)
- ❌ Not Impl: Create asset, search, filters

### Agents (`/dashboard/agents`)
- ❌ Not Impl: Everything
- Shows clear "Not Implemented" notice

### Analytics (`/dashboard/analytics`)
- ❌ Not Impl: Everything
- Shows clear "Not Implemented" notice

### Transactions (`/dashboard/transactions`)
- ❌ Not Impl: Everything
- Shows clear "Not Implemented" notice

### Settings (`/dashboard/settings`)
- ✅ Real: Wallet address
- ✅ Real: Network configuration
- ❌ Not Impl: Profile, notifications, security

---

## 🎯 Summary

### Currently Working:
1. ✅ Wallet connection with MetaMask
2. ✅ Network switching to Cronos Testnet
3. ✅ Fetch asset count from AssetRegistry
4. ✅ Fetch asset details from AssetRegistry
5. ✅ Display contract addresses
6. ✅ Show network configuration
7. ✅ Loading and error states
8. ✅ Wallet disconnect/reconnect

### Not Working (Intentionally):
1. ❌ Creating assets (needs implementation)
2. ❌ Agent management (needs implementation)
3. ❌ Treasury queries (needs implementation)
4. ❌ Transaction history (needs implementation)
5. ❌ Analytics (needs implementation)
6. ❌ Profile settings (needs implementation)

### How to Know What's Real:
- **Has data**: From blockchain ✅
- **Says "Not Implemented"**: Not built yet ❌
- **Shows "-"**: Placeholder for future feature
- **Shows "On-Chain"**: Explicitly from blockchain
- **Shows address**: Real contract/wallet address

---

## 🚀 Next Steps to Test More

To test creating assets and seeing real data:

1. **Get testnet tokens**: https://faucets.chain.link/cronos-testnet
2. **Implement create asset function** (see INTEGRATION_GUIDE.md)
3. **Create a test asset on-chain**
4. **Refresh the assets page**
5. **See your asset appear** ✨

---

**Everything marked as working is REAL blockchain data. Everything else clearly states "Not Implemented".**
