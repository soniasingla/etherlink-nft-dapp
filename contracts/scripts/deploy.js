async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const EtherlinkNFT = await ethers.getContractFactory("EtherlinkNFT");
  const token = await EtherlinkNFT.deploy();

  console.log("EtherlinkNFT address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });