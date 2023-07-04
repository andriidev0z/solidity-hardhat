require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

// Your API key for Etherscan, obtain one at https://etherscan.io/
// const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL;
const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL;

const REPORT_GAS = process.env.REPORT_GAS || false;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BSC_MAINNET_RPC_URL = process.env.BSC_MAINNET_RPC_URL;
// const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // // If you want to do some forking, uncomment this
      forking: {
        url: "https://arb-mainnet.g.alchemy.com/v2/MW1gkKKa3RPT9oJ4bGPaXo3D2RMSWTdS", //rpc of the chain you wanna fork
      },
      // }

      chainId: 31337,
      gas: 3000000,
    },
    localhost: {
      chainId: 31337,
    },

    bscTestnet: {
      url: BSC_MAINNET_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 97,
      allowUnlimitedContractSize: true,
    },
    bsc: {
      url: BSC_MAINNET_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 56,
      allowUnlimitedContractSize: true,
    },
    mumbai: {
      url: POLYGON_MUMBAI_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 80001,
      allowUnlimitedContractSize: true,
    },
    ftmTestnet: {
      url: "https://rpc.ankr.com/fantom_testnet",
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 4002,
      allowUnlimitedContractSize: true,
    },
    arbGoerli: {
      url: "https://arbitrum-goerli.public.blastapi.io",
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 421613,
      allowUnlimitedContractSize: true,
    },
    arbitrumOne: {
      url: "https://arb-mainnet.g.alchemy.com/v2/MW1gkKKa3RPT9oJ4bGPaXo3D2RMSWTdS",
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 42161,
      allowUnlimitedContractSize: true,
    },
  },
  etherscan: {
    apiKey: {
      arbitrumGoerli: ETHERSCAN_API_KEY,
      arbitrumOne: ETHERSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  // contractSizer: {
  //   alphaSort: true,
  //   disambiguatePaths: false,
  //   runOnCompile: true,
  //   strict: true,
  //   only: ["Treasury22"],
  // },
  namedAccounts: {
    deployer: {
      default: 0,  // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    player: {
      default: 1,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          // See the solidity docs for advice about optimization and evmVersion
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.1",
        settings: {
          // See the solidity docs for advice about optimization and evmVersion
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
};