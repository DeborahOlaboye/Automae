'use client';

import { BarChart3 } from 'lucide-react';
import { useWallet } from '@/lib/contexts/WalletContext';

export default function AnalyticsPage() {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-12 text-center">
          <BarChart3 className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Wallet Not Connected</h2>
          <p className="text-gray-600">
            Connect your wallet to view analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Performance insights and financial analytics</p>
      </div>

      {/* Not Implemented Notice */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-12 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Analytics Not Yet Implemented</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          The analytics dashboard will aggregate data from your asset treasuries to show:
        </p>
        <div className="max-w-md mx-auto text-left space-y-3 mb-8">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              •
            </div>
            <p className="text-gray-700">Total revenue and expenses across all assets</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              •
            </div>
            <p className="text-gray-700">Net income and ROI calculations</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              •
            </div>
            <p className="text-gray-700">Performance trends over time</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              •
            </div>
            <p className="text-gray-700">Asset comparison and rankings</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              •
            </div>
            <p className="text-gray-700">Dividend distribution history</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-gray-600">
            <strong className="text-gray-900">To implement:</strong> Query each asset's treasury contract
            to get income, expenses, and transaction data, then aggregate and visualize the results.
          </p>
        </div>
      </div>
    </div>
  );
}
