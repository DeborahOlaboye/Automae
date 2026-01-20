'use client';

import { useWallet } from '@/lib/contexts/WalletContext';
import { formatAddress } from '@/lib/web3';
import { Wallet, LogOut } from 'lucide-react';

export default function WalletConnect() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium text-sm flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>{formatAddress(address)}</span>
        </div>
        <button
          onClick={disconnect}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet className="w-5 h-5" />
      <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
    </button>
  );
}
