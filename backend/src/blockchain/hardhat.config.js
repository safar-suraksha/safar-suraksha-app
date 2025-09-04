import "@nomiclabs/hardhat-ethers";
import dotenv from "dotenv";
dotenv.config();

export default {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    local: {
      url: "http://127.0.0.1:8545"
    },
    testnet: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};

