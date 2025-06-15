import { useState, useEffect } from 'react';

export default function NFTCard({ id, tokenURI, owner }) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        
        let url = tokenURI;
        if (tokenURI.startsWith('ipfs://')) {
          url = `https://ipfs.io/ipfs/${tokenURI.replace('ipfs://', '')}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch metadata');
        }
        
        const data = await response.json();
        setMetadata(data);
      } catch (err) {
        console.error('Error fetching metadata:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (tokenURI) {
      fetchMetadata();
    }
  }, [tokenURI]);
  
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${imageUrl.replace('ipfs://', '')}`;
    }
    return imageUrl;
  };
  
  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-64 bg-gray-700"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }
  
  if (error || !metadata) {
    return (
      <div className="card">
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">NFT #{id}</h3>
          <p className="text-red-500">Failed to load metadata</p>
          <p className="text-sm text-gray-400 mt-2">Owner: {formatAddress(owner)}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      {metadata.image ? (
        <img 
          src={formatImageUrl(metadata.image)} 
          alt={metadata.name || `NFT #${id}`}
          className="w-full h-64 object-cover"
        />
      ) : (
        <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">{metadata.name || `NFT #${id}`}</h3>
        
        {metadata.description && (
          <p className="text-gray-300 mb-3 text-sm">{metadata.description}</p>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-400">Token ID: {id}</span>
          <span className="text-sm text-gray-400">Owner: {formatAddress(owner)}</span>
        </div>
        
        {metadata.attributes && metadata.attributes.length > 0 && (
          <div className="mt-3 border-t border-gray-700 pt-3">
            <p className="text-sm font-bold mb-2">Attributes:</p>
            <div className="flex flex-wrap gap-2">
              {metadata.attributes.map((attr, index) => (
                <div key={index} className="bg-gray-700 rounded-lg px-2 py-1 text-xs">
                  <span className="font-bold">{attr.trait_type}:</span> {attr.value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}