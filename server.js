const express = require('express');
const ethers = require("ethers");
const dotenv = require('dotenv');
const hre = require('hardhat');
dotenv.config();
const { WALLET_PRIVATE_KEY, QUICKNODE_API_KEY } = process.env;

const RPCurl = 'https://attentive-convincing-pallet.matic-testnet.quiknode.pro/' + QUICKNODE_API_KEY + '/';

const server = express();
server.use(express.json());

server.post('/deploy', async (req, res) => {
    console.log("controling the request");

    const arg1 = await req.body.signers;
    const arg2 = await req.body.required;

    console.log("preparing the transaction data");

    const provider = new ethers.JsonRpcProvider(RPCurl);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

    const nonce = await wallet.getNonce();

    const contractArtifact = await hre.artifacts.readArtifact('MultiSigWallet');
    const contractBytecode = contractArtifact.bytecode;
    const contractABI = contractArtifact.abi;

    const contractFactory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);

    const constructorArgs = [arg1, arg2];
    const encodeConstructorArgs = contractFactory.interface.encodeDeploy(constructorArgs);
    const data = contractBytecode + encodeConstructorArgs.slice(2);
    console.log("deploying with transaction data");
    const tx = {
        nonce: nonce,
        to: null,
        value: 0,
        gasPrice: 1860267955,
        gasLimit: 21000000,
        data: data,
        chainId: 80001,
    };
    const sendTxResponse = await wallet.sendTransaction(tx);
    console.log("deployed");

    res.send({
        sendTxResponse: sendTxResponse,
    });
    res.end();
    console.log("API response sent");
});

server.get('/contractAddress', async (req, res) => {
    const txhash = await req.body.txhash;
    const provider = new ethers.JsonRpcProvider(RPCurl);
    const tx = await provider.getTransaction(txhash);
    if (tx == null) {
        res.send({
            error: "Transaction not found or not mined yet",
        });
        res.end();
    }
    res.send({
        contractAddress: tx,
    });
    res.end();
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});