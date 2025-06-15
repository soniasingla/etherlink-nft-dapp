import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            Etherlink NFT dApp
        </h1>

        <p className="text-xl text-gray-300 text-center max-w-3xl mb-10">
          Mint, transfer, and view NFTs on the Etherlink testnet.
          This simple DApp showcases how to interact with ERC-721 tokens on Etherlink.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full max-w-3xl">
          <Link href="/mint" className="group">
            <div className="card p-6 text-center hover:bg-gray-700 transition-colors">
              <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-400">Mint NFT</h2>
              <p className="text-gray-400">Create a new unique NFT to add to your collection</p>
            </div>
          </Link>
          
          <Link href="/collection" className="group">
            <div className="card p-6 text-center hover:bg-gray-700 transition-colors">
              <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-400">My Collection</h2>
              <p className="text-gray-400">View your NFT collection on the Etherlink testnet</p>
            </div>
          </Link>
          
          <Link href="/transfer" className="group">
            <div className="card p-6 text-center hover:bg-gray-700 transition-colors">
              <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-400">Transfer NFT</h2>
              <p className="text-gray-400">Send your NFTs to another wallet address</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}