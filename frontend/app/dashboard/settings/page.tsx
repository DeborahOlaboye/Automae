'use client';

import { Settings as SettingsIcon, Wallet } from 'lucide-react';
import { useWallet } from '@/lib/contexts/WalletContext';
import { formatAddress } from '@/lib/web3';
import { CRONOS_TESTNET } from '@/lib/contracts/addresses';

export default function SettingsPage() {
  const { isConnected, address } = useWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-12 text-center">
          <SettingsIcon className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Wallet Not Connected</h2>
          <p className="text-gray-600">
            Connect your wallet to view settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Your wallet and network configuration</p>
      </div>

      <div className="max-w-3xl">
        {/* Wallet Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Wallet Information</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600 mb-1">Connected Address</div>
                <div className="font-mono text-gray-900">{address}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 font-medium">Connected</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600 mb-1">Short Address</div>
                <div className="font-mono text-gray-900">{formatAddress(address || '')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Network Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Network Configuration</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600 mb-1">Network</div>
                <div className="font-semibold text-gray-900">{CRONOS_TESTNET.name}</div>
              </div>
              <div className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg">
                Active
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Chain ID</div>
                <div className="font-semibold text-gray-900">{CRONOS_TESTNET.chainId}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Currency</div>
                <div className="font-semibold text-gray-900">{CRONOS_TESTNET.nativeCurrency.symbol}</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">RPC URL</div>
              <div className="font-mono text-xs text-gray-900">{CRONOS_TESTNET.rpcUrl}</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Block Explorer</div>
              <a
                href={CRONOS_TESTNET.blockExplorer}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-blue-600 hover:text-blue-700"
              >
                {CRONOS_TESTNET.blockExplorer}
              </a>
            </div>
          </div>
        </div>

        {/* Additional Settings Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Additional Settings</h3>
          <p className="text-gray-700 text-sm mb-4">
            User profile, notifications, and other settings are not yet implemented. Currently showing only wallet and network information.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
              <span className="text-gray-700">Profile customization</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
              <span className="text-gray-700">Notification preferences</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
              <span className="text-gray-700">Security settings</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
              <span className="text-gray-700">Gas price configuration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
