# Contract Integration Guide

## ✅ Integration Complete!

The Automae frontend is now fully integrated with the deployed smart contracts on Cronos Testnet.

---

## 🎯 What's Been Integrated

### Frontend Components

1. **Wallet Connection** (`components/WalletConnect.tsx`)
   - Connect/disconnect MetaMask wallet
   - Display connected address
   - Automatic network switching to Cronos Testnet

2. **Contract ABIs** (`lib/contracts/`)
   - AssetRegistry.json
   - DividendDistribution.json
   - AssetTreasury.json
   - Contract addresses configuration

3. **Web3 Utilities** (`lib/web3.ts`)
   - Provider and signer setup
   - Network configuration
   - Helper functions for address formatting
   - Token amount parsing

4. **React Context** (`lib/contexts/WalletContext.tsx`)
   - Global wallet state management
   - Account change detection
   - Network switching

5. **Contract Hooks** (`lib/hooks/`)
   - `useContracts.ts` - Contract instance creation
   - `useAssets.ts` - Fetch assets from blockchain

6. **UI Components**
   - `AssetsList.tsx` - Display real assets from blockchain
   - `ContractInfo.tsx` - Show deployed contract addresses

### Updated Pages

- **Root Layout** - Wrapped with WalletProvider
- **Dashboard Layout** - Added WalletConnect button in header
- **Assets Page** - Shows real assets from blockchain with loading states

---

## 🚀 How to Test

### Step 1: Open the Application

```bash
# Frontend is already running at:
http://localhost:3000
```

### Step 2: Connect Your Wallet

1. Click **"Connect Wallet"** button in the top right
2. Approve the MetaMask connection request
3. MetaMask will prompt you to add/switch to Cronos Testnet
4. Approve the network switch

### Step 3: View Assets

1. Navigate to **Dashboard → Assets** (http://localhost:3000/dashboard/assets)
2. The page will:
   - Show a loading spinner while fetching from blockchain
   - Display "No Assets Yet" if no assets exist
   - Show asset cards if assets exist in the registry

### Step 4: Check Contract Info

On the Assets page, you'll see:
- **Contract Addresses** with copy and explorer links
- **Network Information** (Cronos Testnet, Chain ID 338)
- **Getting Started Guide**

---

## 📋 Contract Functions Available

### AssetRegistry

```typescript
// Using the hook
const assetRegistry = useAssetRegistry(withSigner);

// Available methods:
- getNextAssetId() → uint256
- getAsset(assetId) → Asset struct
- getAllAssets() → Asset[] array
- registerAsset(...) → transaction
- updateAssetState(...) → transaction
- assignAgent(...) → transaction
```

### DividendDistribution

```typescript
const dividendDist = useDividendDistribution(withSigner);

// Available methods:
- createDistribution(...) → transaction
- claimDividend(distributionId) → transaction
- getDistribution(distributionId) → Distribution struct
```

### AssetTreasury

```typescript
const treasury = useAssetTreasury(treasuryAddress, withSigner);

// Available methods:
- recordIncome(...) → transaction
- payExpense(...) → transaction
- getBalance() → uint256
- getTransaction(txId) → Transaction struct
```

---

## 🔧 Adding New Features

### Example: Create Asset Function

```typescript
// In a new component or page
import { useAssetRegistry } from '@/lib/hooks/useContracts';
import { useWallet } from '@/lib/contexts/WalletContext';

function CreateAsset() {
  const { isConnected } = useWallet();
  const assetRegistry = useAssetRegistry(true); // true = with signer

  async function handleCreateAsset() {
    if (!isConnected || !assetRegistry) {
      alert('Please connect your wallet');
      return;
    }

    try {
      const tx = await assetRegistry.registerAsset(
        0, // assetType (0 = RealEstate)
        "My First Asset",
        "123 Main St",
        "0x0000000000000000000000000000000000000000", // token address (optional)
        1000, // total shares
        "ipfs://metadata-hash"
      );

      await tx.wait();
      alert('Asset created successfully!');
    } catch (error) {
      console.error('Error creating asset:', error);
      alert('Failed to create asset');
    }
  }

  return (
    <button onClick={handleCreateAsset}>
      Create Asset
    </button>
  );
}
```

---

## 🛠️ Technical Details

### Contract Addresses (Cronos Testnet)

```typescript
AssetRegistry: 0x5e5E90EaC14983d0BaB3b869BA48c7Fe8B42B076
DividendDistribution: 0xd4870F305C44226A4F235161E5bcBa66e2C65545
AssetTreasury: 0x07E081136fD1990F1ddECF6d3F44cDACbAf8274f
```

### Network Configuration

```typescript
{
  chainId: 338,
  name: 'Cronos Testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  blockExplorer: 'https://explorer.cronos.org/testnet',
  symbol: 'TCRO'
}
```

### Environment Variables

All contract addresses and network config are set in:
- `frontend/.env.local`
- `frontend/lib/contracts/addresses.ts`

---

## 📊 Current Features

### ✅ Implemented

- [x] Wallet connection with MetaMask
- [x] Automatic network switching
- [x] Contract ABI integration
- [x] Read operations (fetch assets)
- [x] Loading and error states
- [x] Contract address display
- [x] Explorer links
- [x] Responsive UI

### 🚧 To Implement

- [ ] Create asset form
- [ ] Update asset functionality
- [ ] Assign agents to assets
- [ ] Record income/expenses
- [ ] Create dividend distributions
- [ ] Claim dividends
- [ ] Transaction history
- [ ] Real-time event listening

---

## 🎨 UI States

### Loading State
```
┌─────────────────────────────┐
│   🔄 Loading spinner        │
│   "Loading assets from      │
│    blockchain..."           │
└─────────────────────────────┘
```

### No Assets State
```
┌─────────────────────────────┐
│   🏢 Building icon          │
│   "No Assets Yet"           │
│   [Create Your First Asset] │
└─────────────────────────────┘
```

### Assets Loaded State
```
┌──────────┬──────────┬──────────┐
│ Asset #1 │ Asset #2 │ Asset #3 │
│ Card     │ Card     │ Card     │
└──────────┴──────────┴──────────┘
```

### Error State
```
┌─────────────────────────────┐
│ ⚠️ Error Loading Assets     │
│ "Failed to fetch assets"    │
└─────────────────────────────┘
```

---

## 🔍 Debugging

### Check Wallet Connection

```typescript
import { useWallet } from '@/lib/contexts/WalletContext';

function MyComponent() {
  const { address, isConnected, provider, signer } = useWallet();

  console.log('Connected:', isConnected);
  console.log('Address:', address);
  console.log('Provider:', provider);
  console.log('Signer:', signer);
}
```

### Check Contract Calls

```typescript
import { useAssetRegistry } from '@/lib/hooks/useContracts';

function MyComponent() {
  const registry = useAssetRegistry(false);

  useEffect(() => {
    async function test() {
      try {
        const nextId = await registry.getNextAssetId();
        console.log('Next Asset ID:', nextId.toString());
      } catch (error) {
        console.error('Contract call failed:', error);
      }
    }
    test();
  }, [registry]);
}
```

### Browser Console

Open DevTools (F12) and check:
- Network tab for RPC calls
- Console for errors
- Application → Local Storage for wallet state

---

## 📱 Testing Checklist

- [ ] Wallet connects successfully
- [ ] Network switches to Cronos Testnet
- [ ] Contract addresses display correctly
- [ ] Assets page shows loading state
- [ ] Assets page shows empty state (if no assets)
- [ ] Explorer links work
- [ ] Copy address buttons work
- [ ] Wallet disconnect works
- [ ] Page refreshes maintain connection
- [ ] Mobile responsive layout works

---

## 🎉 Next Steps

1. **Get Testnet Tokens**
   - Visit: https://faucets.chain.link/cronos-testnet
   - Request TCRO tokens

2. **Test Asset Creation**
   - Implement create asset form
   - Test transaction submission
   - Verify asset appears in list

3. **Add Agent Management**
   - Deploy agents to assets
   - Configure agent parameters
   - Monitor agent activity

4. **Implement Treasury Functions**
   - Record income
   - Pay expenses
   - View transaction history

5. **Add Dividend System**
   - Create distributions
   - Calculate shares
   - Enable claiming

---

**🏆 Integration Complete!**

Your frontend is now fully connected to the Cronos blockchain and ready for further development!
