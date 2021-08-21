require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

const { MNEMONIC, INFURA_API_KEY } = process.env;
const rinkebyUrl = `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`;

module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    rinkeby: {
      provider: () => new HDWalletProvider(MNEMONIC, rinkebyUrl),
      network_id: 4,
      networkCheckTimeout: 999999,
      gas: 4612388 // Gas limit used for deploys
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './build/contracts/',
};
