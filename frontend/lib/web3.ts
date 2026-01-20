import { ethers } from 'ethers';
import { CRONOS_TESTNET } from './contracts/addresses';

// Get provider (read-only)
export function getProvider() {
  return new ethers.JsonRpcProvider(CRONOS_TESTNET.rpcUrl);
}

// Get signer (requires wallet connection)
export async function getSigner() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No Web3 wallet found. Please install MetaMask.');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer;
}

// Check if wallet is connected
export async function isWalletConnected(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.listAccounts();
    return accounts.length > 0;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
}

// Connect wallet
export async function connectWallet() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No Web3 wallet found. Please install MetaMask.');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);

    // Switch to Cronos Testnet if not already
    await switchToCronosTestnet();

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return { provider, signer, address };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

// Switch to Cronos Testnet
export async function switchToCronosTestnet() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No Web3 wallet found.');
  }

  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CRONOS_TESTNET.chainIdHex }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: CRONOS_TESTNET.chainIdHex,
              chainName: CRONOS_TESTNET.name,
              nativeCurrency: CRONOS_TESTNET.nativeCurrency,
              rpcUrls: [CRONOS_TESTNET.rpcUrl],
              blockExplorerUrls: [CRONOS_TESTNET.blockExplorer],
            },
          ],
        });
      } catch (addError) {
        console.error('Error adding Cronos Testnet:', addError);
        throw addError;
      }
    } else {
      throw switchError;
    }
  }
}

// Format address for display
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format token amount
export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  return ethers.formatUnits(amount, decimals);
}

// Parse token amount
export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  return ethers.parseUnits(amount, decimals);
}

// Add ethereum types to window
declare global {
  interface Window {
    ethereum?: any;
  }
}
