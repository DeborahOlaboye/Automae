'use client';

import { CONTRACT_ADDRESSES, CRONOS_TESTNET } from '@/lib/contracts/addresses';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContractInfo() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (address: string, name: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(name);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const contracts = [
    { name: 'AssetRegistry', address: CONTRACT_ADDRESSES.AssetRegistry },
    { name: 'DividendDistribution', address: CONTRACT_ADDRESSES.DividendDistribution },
    { name: 'AssetTreasury', address: CONTRACT_ADDRESSES.AssetTreasury },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Contract Addresses</h3>
      <div className="space-y-3">
        {contracts.map((contract) => (
          <div key={contract.name} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-900">{contract.name}</div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => copyToClipboard(contract.address, contract.name)}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy address"
                >
                  {copiedAddress === contract.name ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                <a
                  href={`${CRONOS_TESTNET.blockExplorer}/address/${contract.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                  title="View on explorer"
                >
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                </a>
              </div>
            </div>
            <div className="text-xs font-mono text-gray-600 break-all">{formatAddress(contract.address)}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Network:</span>
          <span className="font-medium text-gray-900">{CRONOS_TESTNET.name}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Chain ID:</span>
          <span className="font-medium text-gray-900">{CRONOS_TESTNET.chainId}</span>
        </div>
      </div>
    </div>
  );
}
