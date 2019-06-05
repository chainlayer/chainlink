const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const setup = require('./setup');

const provider = new Web3.providers.HttpProvider(setup.infuraURL);
const web3 = new Web3(provider);

const privateKey = Buffer.from(setup.privateKey, 'hex');
const abi = [{"constant":true,"inputs":[],"name":"getChainlinkToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"changeDay","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_requestId","type":"bytes32"},{"name":"_market","type":"bytes32"}],"name":"fulfillEthereumLastMarket","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_jobId","type":"string"}],"name":"requestEthereumChange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawLink","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_requestId","type":"bytes32"},{"name":"_price","type":"uint256"}],"name":"fulfillEthereumPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"currentPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_requestId","type":"bytes32"},{"name":"_change","type":"int256"}],"name":"fulfillEthereumChange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_jobId","type":"string"}],"name":"requestEthereumPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"lastMarket","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_jobId","type":"string"}],"name":"requestEthereumLastMarket","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"requestId","type":"bytes32"},{"indexed":true,"name":"price","type":"uint256"}],"name":"RequestEthereumPriceFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"requestId","type":"bytes32"},{"indexed":true,"name":"change","type":"int256"}],"name":"RequestEthereumChangeFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"requestId","type":"bytes32"},{"indexed":true,"name":"market","type":"bytes32"}],"name":"RequestEthereumLastMarket","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"}],"name":"ChainlinkRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"}],"name":"ChainlinkFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"}],"name":"ChainlinkCancelled","type":"event"}];

const contract = new web3.eth.Contract(abi, setup.contractAddress, {
  from: setup.account,
  gasLimit: 3000000,
});

const contractFunction = contract.methods.requestEthereumPrice(setup.oracleAddress, setup.jobid);

const functionAbi = contractFunction.encodeABI();

let estimatedGas;
let nonce;

console.log("Getting gas estimate");

contractFunction.estimateGas({from: setup.account}).then((gasAmount) => {
  estimatedGas = gasAmount.toString(16);

  console.log("Estimated gas: " + estimatedGas);

  web3.eth.getTransactionCount(setup.account).then(_nonce => {
    nonce = _nonce.toString(16);

    console.log("Nonce: " + nonce);
    const txParams = {
      gasPrice: '0x02184e72a0',
      gasLimit: 200000,
      to: setup.contractAddress,
      data: functionAbi,
      from: setup.account,
      nonce: '0x' + nonce,
      value: 0
    };

    const tx = new Tx(txParams);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', receipt => {
      console.log(receipt.status);
      process.exit()
    })
  });
});

