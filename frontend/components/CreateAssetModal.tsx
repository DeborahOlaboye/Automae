'use client';

import { useState } from 'react';
import { X, Loader2, Info } from 'lucide-react';
import { useAssetRegistry } from '@/lib/hooks/useContracts';
import { useWallet } from '@/lib/contexts/WalletContext';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { ethers } from 'ethers';

interface CreateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAssetModal({ isOpen, onClose, onSuccess }: CreateAssetModalProps) {
  const { address, isConnected } = useWallet();
  const assetRegistry = useAssetRegistry(true); // Use with signer

  const [formData, setFormData] = useState({
    assetType: '0', // RealEstate
    name: '',
    physicalAddress: '',
    tokenAddress: '',
    totalShares: '',
    treasuryAddress: '',
    metadataURI: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assetTypes = [
    { value: '0', label: 'Real Estate' },
    { value: '1', label: 'Equipment' },
    { value: '2', label: 'Invoice' },
    { value: '3', label: 'Supply Chain' },
    { value: '4', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !assetRegistry || !address) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Validate Ethereum addresses
      if (!ethers.isAddress(formData.tokenAddress)) {
        throw new Error('Invalid token address');
      }
      if (!ethers.isAddress(formData.treasuryAddress)) {
        throw new Error('Invalid treasury address');
      }

      // Create the asset
      const tx = await assetRegistry.createAsset(
        parseInt(formData.assetType),
        formData.name,
        formData.physicalAddress,
        formData.tokenAddress,
        ethers.parseUnits(formData.totalShares, 0), // Convert to BigInt
        formData.treasuryAddress,
        formData.metadataURI || ''
      );

      // Wait for transaction confirmation
      await tx.wait();

      // Reset form and close modal
      setFormData({
        assetType: '0',
        name: '',
        physicalAddress: '',
        tokenAddress: '',
        totalShares: '',
        treasuryAddress: '',
        metadataURI: '',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error creating asset:', err);
      setError(err.message || 'Failed to create asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Asset</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Asset Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asset Type *
            </label>
            <select
              name="assetType"
              value={formData.assetType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            >
              {assetTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Asset Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asset Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Luxury Apartment Downtown"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Physical Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Physical Address *
            </label>
            <input
              type="text"
              name="physicalAddress"
              value={formData.physicalAddress}
              onChange={handleChange}
              placeholder="e.g., 123 Main Street, New York, NY 10001"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Token Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token Address *
            </label>
            <input
              type="text"
              name="tokenAddress"
              value={formData.tokenAddress}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              required
              disabled={isSubmitting}
            />
            <div className="flex items-start space-x-2 mt-2 p-2 bg-amber-50 rounded-lg">
              <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-medium">You need to deploy an ERC20 token first</p>
                <p className="mt-1">Deploy an AssetToken contract with your desired supply, then paste its address here.</p>
                <p className="mt-1">For quick testing, you can use any existing ERC20 token address on Cronos Testnet.</p>
              </div>
            </div>
          </div>

          {/* Total Shares */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Shares *
            </label>
            <input
              type="number"
              name="totalShares"
              value={formData.totalShares}
              onChange={handleChange}
              placeholder="e.g., 1000000"
              min="1"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Treasury Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treasury Address *
            </label>
            <input
              type="text"
              name="treasuryAddress"
              value={formData.treasuryAddress}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              required
              disabled={isSubmitting}
            />
            <div className="flex items-start space-x-2 mt-2 p-2 bg-blue-50 rounded-lg">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium">For testing, you can use:</p>
                <p className="font-mono mt-1">{CONTRACT_ADDRESSES.AssetTreasury}</p>
                <p className="mt-1">Or deploy a new AssetTreasury contract for production use.</p>
              </div>
            </div>
          </div>

          {/* Metadata URI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metadata URI (Optional)
            </label>
            <input
              type="text"
              name="metadataURI"
              value={formData.metadataURI}
              onChange={handleChange}
              placeholder="ipfs://..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              IPFS URI for additional asset metadata and documentation
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !isConnected}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Asset</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
