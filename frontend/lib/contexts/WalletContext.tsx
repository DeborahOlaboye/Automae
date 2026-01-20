'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { connectWallet, isWalletConnected, switchToCronosTestnet } from '../web3';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', () => window.location.reload());
      };
    }
  }, []);

  async function checkConnection() {
    const connected = await isWalletConnected();
    if (connected) {
      try {
        const result = await connectWallet();
        setAddress(result.address);
        setProvider(result.provider);
        setSigner(result.signer);
        setIsConnected(true);
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  }

  async function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAddress(accounts[0]);
    }
  }

  async function connect() {
    setIsConnecting(true);
    try {
      const result = await connectWallet();
      setAddress(result.address);
      setProvider(result.provider);
      setSigner(result.signer);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }

  function disconnect() {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
  }

  async function switchNetwork() {
    try {
      await switchToCronosTestnet();
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  }

  const value = {
    address,
    isConnected,
    isConnecting,
    provider,
    signer,
    connect,
    disconnect,
    switchNetwork,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
