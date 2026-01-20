'use client';

import { useAssets } from '@/lib/hooks/useAssets';
import { Building2, Users, Bot, MapPin, TrendingUp } from 'lucide-react';
import { formatAddress } from '@/lib/web3';
import Link from 'next/link';

const ASSET_TYPE_LABELS = ['Real Estate', 'Equipment', 'Invoice', 'Supply Chain', 'Other'];
const ASSET_STATE_LABELS = ['Draft', 'Active', 'Maintenance', 'Disputed', 'Suspended', 'Retired'];

export default function AssetsList() {
  const { assets, loading, error } = useAssets();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assets from blockchain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Assets</h3>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
        <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Assets Yet</h3>
        <p className="text-gray-600 mb-4">
          Get started by creating your first Real-World Asset on the blockchain
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300">
          Create Your First Asset
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 card-hover"
        >
          {/* Asset Header */}
          <div className="h-32 bg-gradient-to-br from-blue-100 to-indigo-100 relative">
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-lg ${
                  asset.state === 1
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}
              >
                {ASSET_STATE_LABELS[asset.state]}
              </span>
            </div>
          </div>

          {/* Asset Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{asset.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{asset.physicalAddress || 'No location set'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                #{asset.id}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {ASSET_TYPE_LABELS[asset.assetType]}
              </span>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Token Address</span>
                <span className="text-sm font-semibold text-gray-900 font-mono">
                  {asset.tokenAddress !== '0x0000000000000000000000000000000000000000'
                    ? formatAddress(asset.tokenAddress)
                    : 'Not set'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Shares</span>
                <span className="text-sm font-semibold text-gray-900">
                  {asset.totalShares.toString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Treasury</span>
                <span className="text-sm font-semibold text-gray-900 font-mono">
                  {formatAddress(asset.treasuryAddress)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Created: {new Date(Number(asset.createdAt) * 1000).toLocaleDateString()}
              </div>
              <Link
                href={`/dashboard/assets/${asset.id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
