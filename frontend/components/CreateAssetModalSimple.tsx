'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useWallet } from '@/lib/contexts/WalletContext';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { ethers } from 'ethers';
import AssetFactoryABI from '@/lib/contracts/AssetFactory.json';

interface CreateAssetModalSimpleProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAssetModalSimple({ isOpen, onClose, onSuccess }: CreateAssetModalSimpleProps) {
  const { signer, isConnected } = useWallet();

  const [formData, setFormData] = useState({
    assetType: '0', // RealEstate
    name: '',
    physicalAddress: '',
    totalShares: '',
    metadataURI: '',
    tokenName: '',
    tokenSymbol: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    assetId: string;
    tokenAddress: string;
    treasuryAddress: string;
  } | null>(null);

  const assetTypes = [
    { value: '0', label: 'Real Estate' },
    { value: '1', label: 'Equipment' },
    { value: '2', label: 'Invoice' },
    { value: '3', label: 'Supply Chain' },
    { value: '4', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !signer) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create contract instance
      const factory = new ethers.Contract(
        CONTRACT_ADDRESSES.AssetFactory,
        AssetFactoryABI,
        signer
      );

      // Call createCompleteAsset - it will deploy token and treasury automatically
      const tx = await factory.createCompleteAsset(
        parseInt(formData.assetType),
        formData.name,
        formData.physicalAddress,
        ethers.parseUnits(formData.totalShares, 0),
        formData.metadataURI || '',
        formData.tokenName || `${formData.name} Token`,
        formData.tokenSymbol || 'AST'
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // Extract the AssetCreatedComplete event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = factory.interface.parseLog(log);
          return parsed?.name === 'AssetCreatedComplete';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = factory.interface.parseLog(event);
        setSuccess({
          assetId: parsed?.args[0].toString(),
          tokenAddress: parsed?.args[2],
          treasuryAddress: parsed?.args[3],
        });
      }

      // Reset form
      setFormData({
        assetType: '0',
        name: '',
        physicalAddress: '',
        totalShares: '',
        metadataURI: '',
        tokenName: '',
        tokenSymbol: '',
      });

      // Wait a moment to show success before closing
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(null);
      }, 3000);
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

        {success ? (
          /* Success Message */
          <div className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-green-900 mb-2">Asset Created Successfully!</h3>
              <p className="text-green-700 mb-4">Your asset has been deployed with token and treasury.</p>
              <div className="space-y-2 text-sm text-left bg-white rounded-lg p-4">
                <div>
                  <span className="font-medium text-gray-700">Asset ID:</span>
                  <span className="font-mono text-gray-900 ml-2">{success.assetId}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Token:</span>
                  <span className="font-mono text-gray-900 ml-2 text-xs break-all">{success.tokenAddress}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Treasury:</span>
                  <span className="font-mono text-gray-900 ml-2 text-xs break-all">{success.treasuryAddress}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Form */
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
              <p className="text-xs text-gray-500 mt-1">
                Number of ownership tokens that will be created
              </p>
            </div>

            {/* Token Symbol (Optional) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token Symbol (Optional)
                </label>
                <input
                  type="text"
                  name="tokenSymbol"
                  value={formData.tokenSymbol}
                  onChange={handleChange}
                  placeholder="e.g., LAT"
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token Name (Optional)
                </label>
                <input
                  type="text"
                  name="tokenName"
                  value={formData.tokenName}
                  onChange={handleChange}
                  placeholder="Auto-generated"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
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

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>✨ One-Click Creation:</strong> The system will automatically deploy an ERC20 token and treasury contract for your asset. You own all the tokens initially and can distribute them to investors.
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
                    <span>Creating Asset...</span>
                  </>
                ) : (
                  <span>Create Asset</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
