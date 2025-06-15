import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';

export default function Layout({ children }) {
  const [address, setAddress] = useState('');
  const [connecting, setConnecting] = useState(false);
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return;
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this dApp!');
      return;
    }
    
    setConnecting(true);
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      if (chainId !== '0x1F45B') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1F45B' }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x1F45B',
                  chainName: 'Etherlink Testnet',
                  nativeCurrency: {
                    name: 'Tez',
                    symbol: 'TEZ',
                    decimals: 18,
                  },
                  rpcUrls: ['https://node.ghostnet.etherlink.com'],
                  blockExplorerUrls: ['https://testnet.explorer.etherlink.com'],
                },
              ],
            });
          }
        }
      }
      
      setAddress(accounts[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setConnecting(false);
    }
  };
  
  const truncateAddress = (address) => {
    if (!address) return '';
    return address.slice(0, 6) + '...' + address.slice(-4);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {}
      <header className="bg-gray-900 shadow-lg">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-clip-text">
            Etherlink NFT
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-purple-400 transition-colors">
              Home
            </Link>
            <Link href="/collection" className="text-white hover:text-purple-400 transition-colors">
              My NFTs
            </Link>
            <Link href="/mint" className="text-white hover:text-purple-400 transition-colors">
              Mint
            </Link>
            <Link href="/transfer" className="text-white hover:text-purple-400 transition-colors">
              Transfer
            </Link>
            
            {address ? (
              <div className="px-4 py-2 bg-gray-800 rounded-full text-white">
                {truncateAddress(address)}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="btn-primary"
              >
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </nav>
        </div>
      </header>
      
      {}
      <main className="flex-grow container mx-auto py-8">
        {children}
      </main>
      
      {}
    </div>
  );
}