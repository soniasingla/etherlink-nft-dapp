import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { transferNFT, getNFTsForAddress } from '../utils/ethers';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';

export default function TransferPage() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transferLoading, setTransferLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first!');
      return;
    }
    
    if (!selectedNFT) {
      toast.error('Please select an NFT to transfer');
      return;
    }
    
    if (!recipientAddress) {
      toast.error('Please enter a recipient address');
      return;
    }
    
    if (!ethers.utils.isAddress(recipientAddress)) {
      toast.error('Invalid recipient address');
      return;
    }
    
    setTransferLoading(true);
    
    try {
      const result = await transferNFT(recipientAddress, selectedNFT);
      
      if (result.success) {
        toast.success(result.status);
        setSelectedNFT('');
        setRecipientAddress('');
        
        setTimeout(() => {
          fetchNFTs(address);
        }, 2000);
      } else {
        toast.error(result.status);
      }
    } catch (error) {
      console.error('Error transferring NFT:', error);
      toast.error('Failed to transfer NFT. See console for details.');
    } finally {
      setTransferLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Transfer NFT</h1>
        
        {!isConnected ? (
          <div className="card p-6 text-center">
            <p className="text-xl mb-4">Please connect your wallet to transfer NFTs.</p>
            <p className="text-gray-400">
              You'll need a wallet like MetaMask connected to the Etherlink testnet.
            </p>
          </div>
        ) : loading ? (
          <div className="card p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-700 rounded"></div>
              <div className="h-24 bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
            </div>
          </div>
        ) : nfts.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-xl mb-4">You don't have any NFTs to transfer.</p>
            <p className="text-gray-400 mb-6">
              Head over to the Mint page to create your first NFT!
            </p>
            <a href="/mint" className="btn-primary inline-block">
              Mint Your First NFT
            </a>
          </div>
        ) : (
          <div className="card p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="nftSelect" className="block text-sm font-medium text-gray-300 mb-2">
                  Select NFT to Transfer
                </label>
                <select
                  id="nftSelect"
                  className="input"
                  value={selectedNFT}
                  onChange={(e) => setSelectedNFT(e.target.value)}
                  required
                >
                  <option value="">-- Select an NFT --</option>
                  {nfts.map((nft) => (
                    <option key={nft.id} value={nft.id}>
                      NFT #{nft.id}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-300 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  id="recipientAddress"
                  className="input"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  required
                />
                <p className="mt-2 text-sm text-gray-400">
                  Enter the Ethereum address of the recipient. Make sure the address is correct.
                </p>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={transferLoading || !isConnected}
                  className={`btn-primary w-full ${
                    (transferLoading || !isConnected) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {transferLoading ? 'Transferring...' : 'Transfer NFT'}
                </button>
              </div>
            </form>
          </div>
        )}
        

      </div>
    </Layout>
  );
}