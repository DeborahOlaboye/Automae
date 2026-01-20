'use client';

import { Bot, Plus } from 'lucide-react';
import { useWallet } from '@/lib/contexts/WalletContext';

export default function AgentsPage() {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-12 text-center">
          <Bot className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Wallet Not Connected</h2>
          <p className="text-gray-600">
            Connect your wallet to manage AI agents
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
            <p className="text-gray-600 mt-1">Autonomous agents managing your RWA operations</p>
          </div>
          <button
            disabled
            className="flex items-center space-x-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            <span>Deploy New Agent (Not Implemented)</span>
          </button>
        </div>
      </div>

      {/* Not Implemented Notice */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-12 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bot className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Agent System Not Yet Implemented</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          The AI agent deployment and management system will allow you to:
        </p>
        <div className="max-w-md mx-auto text-left space-y-3 mb-8">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              1
            </div>
            <p className="text-gray-700">Deploy agents to manage specific assets</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              2
            </div>
            <p className="text-gray-700">Configure automation rules and schedules</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              3
            </div>
            <p className="text-gray-700">Monitor agent activity and performance</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              4
            </div>
            <p className="text-gray-700">Pause, resume, or remove agents</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-gray-600">
            <strong className="text-gray-900">To implement:</strong> You'll need to add agent assignment
            functions to the AssetRegistry contract and build the UI for agent configuration.
          </p>
        </div>
      </div>
    </div>
  );
}
