import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { mintNFT } from '../utils/ethers';
import toast from 'react-hot-toast';

export default function MintPage() {
  const [metadataURL, setMetadataURL] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          setIsConnected(accounts.length > 0);
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };
    
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setIsConnected(accounts.length > 0);
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first!');
      return;
    }
    
    if (!metadataURL) {
      toast.error('Please enter a metadata URL');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await mintNFT(metadataURL);
      
      if (result.success) {
        toast.success(result.status);
        setMetadataURL('');
      } else {
        toast.error(result.status);
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error('Failed to mint NFT. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mint New NFT</h1>
        
        <div className="card p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="metadataURL" className="block text-sm font-medium text-gray-300 mb-2">
                Metadata URL
              </label>
              <input
                type="text"
                id="metadataURL"
                className="input"
                placeholder="https://example.com/metadata.json or ipfs://..."
                value={metadataURL}
                onChange={(e) => setMetadataURL(e.target.value)}
                required
              />
              <p className="mt-2 text-sm text-gray-400">
                Provide a URL to a JSON file with your NFT metadata. This should be a publicly accessible URL or IPFS hash.
              </p>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading || !isConnected}
                className={`btn-primary w-full ${
                  (isLoading || !isConnected) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Minting...' : 'Mint NFT'}
              </button>
              
              {!isConnected && (
                <p className="mt-2 text-sm text-red-400">
                  Please connect your wallet first.
                </p>
              )}
            </div>
          </form>

        </div>
        

      </div>
    </Layout>
  );
}