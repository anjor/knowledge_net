import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Web3Service } from '../utils/web3';
import { toast } from 'react-hot-toast';

interface WalletContextType {
  web3Service: Web3Service;
  userAddress: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [web3Service] = useState(() => new Web3Service());
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setUserAddress(accounts[0]);
            await web3Service.connectWallet();
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };
    checkConnection();
  }, [web3Service]);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const address = await web3Service.connectWallet();
      setUserAddress(address);
      toast.success('Wallet connected successfully');
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet: ' + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setUserAddress(null);
    toast.success('Wallet disconnected');
  };

  return (
    <WalletContext.Provider
      value={{
        web3Service,
        userAddress,
        isConnecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};