require("@nomiclabs/hardhat-waffle");
require('dotenv').config()


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {
      url:"http://127.0.0.1:8545/"
    },
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts:[process.env.pk],
      gas: 2000000,
    },
    sphinx: {
        url: "https://dapps.shardeum.org/",
        accounts: [process.env.pk],
        gas: 20000000,
        }
  },

  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
        details: { yul: false },
      },
    }
  },
};