# Chainlink scripts by Chainlayer.io

This repository contains some simple scripts to generate traffic to your ChainLink Oracle.

## Prerequisites

Follow the guide in https://docs.chain.link/docs/example-walkthrough. The scripts depend on you using the private key of an account so create a new metamask account first with a fresh seedphrase you don't need anymore. If you don't want to use metamask but truffle or something else to deploy your contracts you can just get LINK here https://docs.chain.link/docs/acquire-link

Follow the instructions https://docs.chain.link/docs/running-a-chainlink-node and https://docs.chain.link/docs/fulfilling-requests to manually check your setup.

## Using the scripts

During the instructions you created two contracts: An Oracle contract and a TestnetConsumer contract.

Edit the setup.js file and fill in the contract addresses and account address you used to create the contracts. If you used metamask you can retrieve the private key by entering your seed in https://iancoleman.io/bip39/. (Don't do that with a production seed!). The scripts use an infura node for which you will need to register and get a key. Finally enter the jobid for the EthUint256 job to setup.js.

Once filled in, simply run run.sh to use your Oracle. There are three scripts run sequentially:
* send.js --> Sends 1 LINK from your account to the TestnetConsumer (to pay for the query)
* query.js --> Send a query to the Oracle (paying 1 LINK in the process)
* withdraw --> Withdraw any LINK available from the Oracle account to your Account.
