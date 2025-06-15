import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { NFT_CONTRACT_ADDRESS, abi } from "./constants";

export const getEthereumContract = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, signer);
  return contract;
};

export const getNFTsForAddress = async (address) => {
  try {
    const contract = await getEthereumContract();
    const totalSupply = await contract.totalSupply();
    const balance = await contract.balanceOf(address);
    const nfts = [];

    for (let i = 0; i < totalSupply; i++) {
      try {
        const owner = await contract.ownerOf(i);
        if (owner.toLowerCase() === address.toLowerCase()) {
          const tokenURI = await contract.tokenURI(i);
          nfts.push({
            id: i,
            owner,
            tokenURI,
          });
        }
      } catch (error) {
        console.error(`Error fetching token ${i}:`, error);
      }
    }
    
    return nfts;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};

export const mintNFT = async (uri) => {
  try {
    const contract = await getEthereumContract();
    const signer = await contract.signer.getAddress();
    const tx = await contract.safeMint(signer, uri);
    await tx.wait();
    
    return {
      success: true,
      status: "NFT minted successfully!",
    };
  } catch (error) {
    console.error("Error minting NFT:", error);
    return {
      success: false,
      status: `Error minting NFT: ${error.message}`,
    };
  }
};

export const transferNFT = async (to, tokenId) => {
  try {
    const contract = await getEthereumContract();
    const signer = await contract.signer.getAddress();
    const tx = await contract.transferFrom(signer, to, tokenId);
    await tx.wait();
    
    return {
      success: true,
      status: "NFT transferred successfully!",
    };
  } catch (error) {
    console.error("Error transferring NFT:", error);
    return {
      success: false,
      status: `Error transferring NFT: ${error.message}`,
    };
  }
};