import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import NFTCard from '../components/NFTCard';
import { getNFTsForAddress } from '../utils/ethers';
import toast from 'react-hot-toast';

export default function CollectionPage() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const checkConnectionAndFetchNFTs = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
            fetchNFTs(accounts[0]);
          } else {
            setIsConnected(false);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    checkConnectionAndFetchNFTs();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
          fetchNFTs(accounts[0]);
        } else {
          setIsConnected(false);
          setNfts([]);
        }
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);
  
  const fetchNFTs = async (walletAddress) => {
    setLoading(true);
    
    try {
      const userNFTs = await getNFTsForAddress(walletAddress);
      setNfts(userNFTs);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      toast.error('Failed to fetch NFTs. See console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = () => {
    if (address) {
      fetchNFTs(address);
    }
  };
  
  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My NFT Collection</h1>
          
          {isConnected && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`btn-secondary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          )}
        </div>
        
        {!isConnected ? (
          <div className="card p-6 text-center">
            <p className="text-xl mb-4">Please connect your wallet to view your NFT collection.</p>
            <p className="text-gray-400">
              You'll need a wallet like MetaMask connected to the Etherlink testnet.
            </p>
          </div>
        ) : loading ? (
          <div className="nft-grid">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-64 bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : nfts.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-xl mb-4">You don't have any NFTs yet.</p>
            <p className="text-gray-400 mb-6">
              Head over to the Mint page to create your first NFT!
            </p>
            <a href="/mint" className="btn-primary inline-block">
              Mint Your First NFT
            </a>
          </div>
        ) : (
          <div className="nft-grid">
            {nfts.map((nft) => (
              <NFTCard
                key={nft.id}
                id={nft.id}
                tokenURI={nft.tokenURI}
                owner={nft.owner}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}