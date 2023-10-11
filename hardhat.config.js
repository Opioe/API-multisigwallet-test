require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { INFURA_PROJECT_ID, WALLET_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",

  networks: {
    sepolia : {
      chainId: 11155111,
      url: "https://sepolia.infura.io/v3/" + INFURA_PROJECT_ID,
      accounts: ["0x" + WALLET_PRIVATE_KEY],
    }
  }
};
