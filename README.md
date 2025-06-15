# Etherlink NFT DApp

A simple NFT DApp built on Etherlink's testnet enabling users to mint, view, and transfer ERC-721 tokens through a clean, intuitive interface.

## Live Demo

<https://etherlink-nft-dapp-mocha.vercel.app/>

## Prerequisites

- Node.js (v16+)
- MetaMask or another Ethereum wallet

## Setup Instructions

1. Clone and install dependencies

```bash
git clone https://github.com/yourusername/etherlink-nft-dapp.git
cd etherlink-nft-dapp
npm install
```

2. Deploy Smart Contract

Navigate to the contracts folder:

```bash
cd contracts
npm install
```

> Update your private key in `hardhat.config.js` under `networks.etherlink.accounts`

Compile and deploy:

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network etherlink
```

Copy the deployed contract address and update `frontend/utils/constants.js`:

```js
export const NFT_CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";
```

3. Run Frontend Locally

Navigate to the frontend folder:

```bash
npm run dev
```

Open <http://localhost:3000> in your browser.

## How to Use

**Connect Wallet**

- Click Connect Wallet button
- If your wallet doesn’t have Etherlink testnet configured, add it manually:

| Field           | Value                                                                            |
| --------------- | -------------------------------------------------------------------------------- |
| Network Name    | Etherlink Testnet                                                                |
| RPC URL         | [https://node.ghostnet.etherlink.com](https://node.ghostnet.etherlink.com)       |
| Chain ID        | 128123                                                                           |
| Currency Symbol | TEZ                                                                              |
| Block Explorer  | [https://testnet.explorer.etherlink.com](https://testnet.explorer.etherlink.com) |

### Getting Testnet TEZ

Use the [Etherlink Faucet](https://faucet.etherlink.com/) to request testnet tokens required for deploying contracts and sending transactions.

### Mint NFTs

- Go to the Mint page
- Enter a valid metadata URL (see below for metadata format).

Your metadata JSON should look like this:

```json
{
  "name": "My NFT Name",
  "description": "Description here",
  "image": "https://example.com/image.png",
}
```

- Click Mint NFT and confirm the transaction in your wallet.
- Wait for confirmation; your NFT will then be minted to your wallet.

> Note: Ensure you have testnet TEZ tokens for gas. Get tokens from [Etherlink Faucet](https://faucet.etherlink.com/).

### View NFTs

- Go to My NFTs page
- Click Refresh to load your current NFTs

### Transfer NFTs

- Go to the Transfer page
- Select the NFT you want to send
- Enter recipient’s Ethereum address
- Click Transfer NFT and confirm the transaction

## FAQ / Troubleshooting

Common Issues

| Problem                            | Solution                                                                                              |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Compilation errors                 | Ensure Node.js v16+ installed. Delete `node_modules` and `package-lock.json`, then run `npm install`. |
| Deployment fails                   | Check sufficient testnet TEZ balance; confirm private key in `hardhat.config.js` is correct.          |
| Frontend can’t connect to contract | Verify contract address in `constants.js` and MetaMask network selection (Etherlink testnet).         |
| NFT metadata not displaying        | Confirm metadata URL is public and JSON format is correct.                                            |
