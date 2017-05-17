const Web3 = require("web3");
global.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
global.eth = global.web3.eth;
require('./ens/ensutils');

global.u = require('./utils.js');
global.a = require('./accounts.js');

