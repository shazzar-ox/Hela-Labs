import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// require('@nomiclabs/hardhat-waffle')
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
// require('ethereum-waffle')
import "@nomicfoundation/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-deploy";
import "solidity-coverage";
import "hardhat-gas-reporter";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-contract-sizer";
require("dotenv").config();

const sepoliaUrl = process.env.SEPOLIA_RPC_URL || "";
const sepoliaPrivateKey = process.env.SEPOLIA_PRIVATE_KEY || "key";
const coinMarketCapKey = process.env.COINMARKETCAP_KEY || "key";
const etherscan = process.env.ETHERSCAN_KEY || "key";
const arbitrumurl = process.env.ARBITRUM_RPC_URL || "key";
const maiNetKey = process.env.ETHEREUM_MAINET_RPC || "key";
const goerliUrl = process.env.GOERLI_RPC_URL || "";

const config: HardhatUserConfig = {
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			chainId: 31337,
			forking: {
				url: maiNetKey,
			},
		},
		// hardhat: {
		//   chainId: 31337,
		//   // gasPrice: 130000000000,
		// },
		sepolia: {
			url: sepoliaUrl,
			accounts: [sepoliaPrivateKey],
			chainId: 11155111,
			// blockConfirmations : 3,
		},
		arbitrum: {
			url: arbitrumurl,
			accounts: [sepoliaPrivateKey],
			chainId: 42161,
			// blockConfirmations: 3,
		},
		goerli: {
			url: goerliUrl,
			accounts: [sepoliaPrivateKey],
			chainId: 5,
			// blockConfirmations: 3,
		},
	},
	solidity: {
		compilers: [
			{ version: "0.8.20" },
			{ version: "0.4.19" },
			{ version: "0.6.12" },
			{ version: "0.6.6" },
			{ version: "0.8.7" },
			{ version: "0.5.0" },
		],
	},

	namedAccounts: {
		deployer: {
			default: 0,
		},
		player: {
			default: 1,
		},
	},
	etherscan: {
		// yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
		apiKey: {
			sepolia: etherscan,
			goerli: etherscan,
			// polygon: POLYGONSCAN_API_KEY,
		},
	},
	gasReporter: {
		enabled: false,
		outputFile: "gas-report.txt",
		noColors: true,
		currency: "USD",
		// coinmarketcap: coinMarketCapKey,
		token: "MATIC",
		gasPriceApi:
			"https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
	},
	mocha: {
		timeout: 200000, // 200sec
	},
	contractSizer: {
		runOnCompile: false,
		only: ["Raffle"],
	},
};

export default config;
