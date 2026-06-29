import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  generateWallet,
  importWallet,
  saveWallet,
  loadWallet,
  removeWallet,
  getBalance,
  getBlockNumber,
} from '../services/genlayerSDK';

interface WalletState {
  // Connection state
  isConnected: boolean;
  isLoading: boolean;
  
  // Account info
  address: string | null;
  privateKey: string | null;
  balance: string;
  blockNumber: number;
  
  // Actions
  createWallet: () => void;
  importWalletFromKey: (privateKey: string) => boolean;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  
  // Error
  error: string | null;
}

const WalletContext = createContext<WalletState>({
  isConnected: false,
  isLoading: false,
  address: null,
  privateKey: null,
  balance: '0',
  blockNumber: 0,
  createWallet: () => {},
  importWalletFromKey: () => false,
  disconnect: () => {},
  refreshBalance: async () => {},
  error: null,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [blockNumber, setBlockNumber] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (address) {
      try {
        const bal = await getBalance(address);
        setBalance(bal);
      } catch (err) {
        console.error('Failed to get balance:', err);
      }
    }
  }, [address]);

  // Create new wallet
  const createWallet = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      const wallet = generateWallet();
      saveWallet(wallet.privateKey);
      setAddress(wallet.address);
      setPrivateKey(wallet.privateKey);
      setIsConnected(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create wallet');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Import wallet from private key
  const importWalletFromKey = useCallback((pk: string): boolean => {
    setIsLoading(true);
    setError(null);
    
    try {
      const wallet = importWallet(pk);
      saveWallet(wallet.privateKey);
      setAddress(wallet.address);
      setPrivateKey(wallet.privateKey);
      setIsConnected(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Invalid private key');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    removeWallet();
    setAddress(null);
    setPrivateKey(null);
    setBalance('0');
    setIsConnected(false);
    setError(null);
  }, []);

  // Auto-load wallet on mount
  useEffect(() => {
    const wallet = loadWallet();
    if (wallet) {
      setAddress(wallet.address);
      setPrivateKey(wallet.privateKey);
      setIsConnected(true);
    }
  }, []);

  // Refresh balance periodically
  useEffect(() => {
    if (!address || !isConnected) return;

    refreshBalance();
    const interval = setInterval(refreshBalance, 15000);
    return () => clearInterval(interval);
  }, [address, isConnected, refreshBalance]);

  // Refresh block number periodically
  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const bn = await getBlockNumber();
        setBlockNumber(bn);
      } catch {
        // ignore
      }
    };

    fetchBlock();
    const interval = setInterval(fetchBlock, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isLoading,
        address,
        privateKey,
        balance,
        blockNumber,
        createWallet,
        importWalletFromKey,
        disconnect,
        refreshBalance,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
