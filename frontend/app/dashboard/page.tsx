'use client';

import { Building2, TrendingUp, DollarSign, Bot } from 'lucide-react';
import { useAssets } from '@/lib/hooks/useAssets';
import { useWallet } from '@/lib/contexts/WalletContext';
import Link from 'next/link';

export default function Dashboard() {
  const { assets, loading } = useAssets();
  const { isConnected, address } = useWallet();

  if (!isConnected) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-12 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Automae</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Connect your wallet to start managing your Real-World Assets on Cronos blockchain
          </p>
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl">
            <span>Click "Connect Wallet" in the top right corner</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back 👋
        </h1>
        <p className="text-gray-600">Connected: {address}</p>
      </div>

      {/* Stats Grid - Real Data from Blockchain */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {loading ? '...' : assets.length}
          </div>
          <div className="text-sm text-gray-600">Total Assets (On-Chain)</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">-</div>
          <div className="text-sm text-gray-600">Monthly Income (Not Implemented)</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">-</div>
          <div className="text-sm text-gray-600">Total Value (Not Implemented)</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">-</div>
          <div className="text-sm text-gray-600">Active Agents (Not Implemented)</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/assets"
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <Building2 className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">View Assets</h3>
            <p className="text-sm text-gray-600">
              See all your RWAs from the blockchain
            </p>
          </Link>

          <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <Bot className="w-8 h-8 text-gray-400 mb-3" />
            <h3 className="font-semibold text-gray-500 mb-2">Deploy Agent</h3>
            <p className="text-sm text-gray-400">
              Not yet implemented
            </p>
          </div>

          <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <TrendingUp className="w-8 h-8 text-gray-400 mb-3" />
            <h3 className="font-semibold text-gray-500 mb-2">View Analytics</h3>
            <p className="text-sm text-gray-400">
              Not yet implemented
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Real Blockchain Data</h3>
        <p className="text-gray-700 text-sm mb-4">
          The asset count above is fetched directly from the AssetRegistry contract on Cronos Testnet.
          Other metrics will be implemented as you interact with the contracts.
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-600">Contract:</span>
          <code className="px-2 py-1 bg-white rounded font-mono text-xs">
            0x5e5E...B076
          </code>
        </div>
      </div>
    </div>
  );
}
