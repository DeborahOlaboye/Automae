import { useState, useEffect } from 'react';
import { useAssetRegistry } from './useContracts';

export interface Asset {
  id: number;
  name: string;
  assetType: number;
  state: number;
  physicalAddress: string;
  tokenAddress: string;
  totalShares: bigint;
  treasuryAddress: string;
  createdAt: bigint;
  updatedAt: bigint;
  metadataURI: string;
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const assetRegistry = useAssetRegistry(false);

  useEffect(() => {
    async function fetchAssets() {
      if (!assetRegistry) return;

      try {
        setLoading(true);
        setError(null);

        // Get the total number of assets
        const totalAssets = await assetRegistry.getTotalAssets();
        const assetCount = Number(totalAssets);

        // Fetch all assets (asset IDs start from 1)
        const assetPromises = [];
        for (let i = 1; i <= assetCount; i++) {
          assetPromises.push(assetRegistry.getAsset(i));
        }

        const assetData = await Promise.all(assetPromises);

        // Filter out assets that don't exist and map to our Asset interface
        const validAssets = assetData
          .filter((asset) => asset.exists)
          .map((asset) => ({
            id: Number(asset.id),
            name: asset.name,
            assetType: Number(asset.assetType),
            state: Number(asset.state),
            physicalAddress: asset.physicalAddress,
            tokenAddress: asset.tokenAddress,
            totalShares: asset.totalShares,
            treasuryAddress: asset.treasuryAddress,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt,
            metadataURI: asset.metadataURI,
          }));

        setAssets(validAssets);
      } catch (err) {
        console.error('Error fetching assets:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch assets');
      } finally {
        setLoading(false);
      }
    }

    fetchAssets();
  }, [assetRegistry]);

  return { assets, loading, error };
}

export function useAsset(assetId: number) {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const assetRegistry = useAssetRegistry(false);

  useEffect(() => {
    async function fetchAsset() {
      if (!assetRegistry || !assetId) return;

      try {
        setLoading(true);
        setError(null);

        const assetData = await assetRegistry.getAsset(assetId);

        if (!assetData.exists) {
          setError('Asset not found');
          setAsset(null);
          return;
        }

        setAsset({
          id: Number(assetData.id),
          name: assetData.name,
          assetType: Number(assetData.assetType),
          state: Number(assetData.state),
          physicalAddress: assetData.physicalAddress,
          tokenAddress: assetData.tokenAddress,
          totalShares: assetData.totalShares,
          treasuryAddress: assetData.treasuryAddress,
          createdAt: assetData.createdAt,
          updatedAt: assetData.updatedAt,
          metadataURI: assetData.metadataURI,
        });
      } catch (err) {
        console.error('Error fetching asset:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch asset');
      } finally {
        setLoading(false);
      }
    }

    fetchAsset();
  }, [assetRegistry, assetId]);

  return { asset, loading, error };
}
