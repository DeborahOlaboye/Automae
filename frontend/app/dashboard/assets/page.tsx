'use client';

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import AssetsList from '@/components/AssetsList';
import ContractInfo from '@/components/ContractInfo';
import CreateAssetModal from '@/components/CreateAssetModal';
import { useWallet } from '@/lib/contexts/WalletContext';

export default function AssetsPage() {
  const { isConnected } = useWallet();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAssetCreated = () => {
    // Trigger a refresh of the assets list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-8 max-w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Assets</h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor your tokenized real-world assets on Cronos
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Asset</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets by name, type, or location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Filters</span>
          </button>
        </div>
      </div>

      {/* Connection Warning */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <h3 className="text-yellow-800 font-semibold mb-2">Wallet Not Connected</h3>
          <p className="text-yellow-700 text-sm">
            Connect your wallet to view and manage your assets. Click "Connect Wallet" in the top right corner.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6 max-w-full">
        {/* Assets List */}
        <div className="lg:col-span-3 min-w-0">
          <AssetsList key={refreshTrigger} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6 min-w-0">
          <ContractInfo />

          {/* Network Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Getting Started</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.</span>
                <span>Connect your wallet to Cronos Testnet</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.</span>
                <span>Get testnet tokens from faucet</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">3.</span>
                <span>Create your first RWA asset</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">4.</span>
                <span>Deploy AI agents to manage it</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create Asset Modal */}
      <CreateAssetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleAssetCreated}
      />
    </div>
  );
}
