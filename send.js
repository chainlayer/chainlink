const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const setup = require('./setup');

const provider = new Web3.providers.HttpProvider(setup.infuraURL);
const web3 = new Web3(provider);

const privateKey = Buffer.from(setup.privateKey, 'hex');
const abi = [{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"type":"function"}]

// Get ERC20 Token contract instance
let contract = new web3.eth.Contract(abi, setup.tokenAddress);
// call transfer function
const contractFunction = contract.methods.transfer(setup.contractAddress, '0xde0b6b3a7640000');

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
      to: setup.tokenAddress,
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
