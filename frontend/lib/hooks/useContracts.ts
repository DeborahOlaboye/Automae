import { useMemo } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../contexts/WalletContext';
import { CONTRACT_ADDRESSES } from '../contracts/addresses';
import { getProvider } from '../web3';

import AssetRegistryABIModule from '../contracts/AssetRegistry.json';
import DividendDistributionABIModule from '../contracts/DividendDistribution.json';
import AssetTreasuryABIModule from '../contracts/AssetTreasury.json';

// Handle both ESM default exports and direct JSON imports
const AssetRegistryABI = (AssetRegistryABIModule as any).default || AssetRegistryABIModule;
const DividendDistributionABI = (DividendDistributionABIModule as any).default || DividendDistributionABIModule;
const AssetTreasuryABI = (AssetTreasuryABIModule as any).default || AssetTreasuryABIModule;

export function useAssetRegistry(withSigner: boolean = false) {
  const { signer } = useWallet();

  return useMemo(() => {
    if (withSigner && !signer) {
      return null;
    }

    const providerOrSigner = withSigner ? signer : getProvider();

    return new ethers.Contract(
      CONTRACT_ADDRESSES.AssetRegistry,
      AssetRegistryABI,
      providerOrSigner
    );
  }, [signer, withSigner]);
}

export function useDividendDistribution(withSigner: boolean = false) {
  const { signer } = useWallet();

  return useMemo(() => {
    if (withSigner && !signer) {
      return null;
    }

    const providerOrSigner = withSigner ? signer : getProvider();
    return new ethers.Contract(
      CONTRACT_ADDRESSES.DividendDistribution,
      DividendDistributionABI,
      providerOrSigner
    );
  }, [signer, withSigner]);
}

export function useAssetTreasury(address?: string, withSigner: boolean = false) {
  const { signer } = useWallet();

  return useMemo(() => {
    if (!address) return null;
    if (withSigner && !signer) return null;

    const providerOrSigner = withSigner ? signer : getProvider();
    return new ethers.Contract(
      address,
      AssetTreasuryABI,
      providerOrSigner
    );
  }, [address, signer, withSigner]);
}
