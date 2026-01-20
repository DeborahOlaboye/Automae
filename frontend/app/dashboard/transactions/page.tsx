'use client';

import { Activity } from 'lucide-react';
import { useWallet } from '@/lib/contexts/WalletContext';

export default function TransactionsPage() {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-12 text-center">
          <Activity className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Wallet Not Connected</h2>
          <p className="text-gray-600">
            Connect your wallet to view transactions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-1">All payments, collections, and transfers</p>
      </div>

      {/* Not Implemented Notice */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-12 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Activity className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Transaction History Not Yet Implemented</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          The transaction history will fetch data from your asset treasury contracts to display:
        </p>
        <div className="max-w-md mx-auto text-left space-y-3 mb-8">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              •
            </div>
            <p className="text-gray-700">Income transactions (rent, lease payments)</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              •
            </div>
            <p className="text-gray-700">Expense payments (bills, taxes, maintenance)</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              •
            </div>
            <p className="text-gray-700">Dividend distributions to token holders</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              •
            </div>
            <p className="text-gray-700">On-chain transaction links and details</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              •
            </div>
            <p className="text-gray-700">Filtering and search capabilities</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-gray-600">
            <strong className="text-gray-900">To implement:</strong> Query the AssetTreasury contract's
            transaction mapping and events to build a complete transaction history for each asset.
          </p>
        </div>
      </div>
    </div>
  );
}
