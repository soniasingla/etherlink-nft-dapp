require("@nomiclabs/hardhat-ethers");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.17",
  networks: {
    etherlink: {
      url: "https://node.ghostnet.etherlink.com",
      accounts: ["00895a9fdf3fd1be820e202891ba033dd117d41598347b9fd422dd5724685929"], 
      chainId: 128123,
    },
  },
};