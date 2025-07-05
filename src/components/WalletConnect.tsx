import React, { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const { userAddress, isConnecting, connectWallet: contextConnectWallet, disconnectWallet: contextDisconnectWallet } = useWallet();
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    if (userAddress) {
      onConnect(userAddress);
      updateBalance(userAddress);
    }
  }, [userAddress, onConnect]);


  const connectWallet = async () => {
    await contextConnectWallet();
  };


  const updateBalance = async (address: string) => {
    try {
      if (window.ethereum) {
        const balanceWei = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        
        // Convert from Wei to FIL (same as ETH conversion)
        const balanceFIL = parseInt(balanceWei, 16) / Math.pow(10, 18);
        setBalance(balanceFIL.toFixed(4));
      }
    } catch (error) {
      console.error('Error getting balance:', error);
      setBalance('0');
    }
  };

  const disconnectWallet = () => {
    contextDisconnectWallet();
    setBalance('0');
    onConnect('');
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (userAddress) {
    return (
      <div className="flex items-center space-x-4">
        {/* Balance Display */}
        <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            {balance} FIL
          </span>
        </div>

        {/* Connected Address */}
        <div className="relative group">
          <button className="flex items-center space-x-2 bg-green-100 text-green-800 rounded-lg px-4 py-2 hover:bg-green-200 transition">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">{formatAddress(userAddress)}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-3 border-b">
              <p className="text-sm text-gray-500">Connected Account</p>
              <p className="font-mono text-sm text-gray-900 break-all">{userAddress}</p>
              <p className="text-sm text-gray-600 mt-1">{balance} FIL</p>
            </div>
            <div className="p-2">
              <button
                onClick={() => navigator.clipboard.writeText(userAddress)}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Address
              </button>
              <button
                onClick={() => updateBalance(userAddress)}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Balance
              </button>
              <hr className="my-2" />
              <button
                onClick={disconnectWallet}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
        isConnecting
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isConnecting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Connect Wallet
        </>
      )}
    </button>
  );
};