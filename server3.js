const express = require('express');
const { ethers } = require('hardhat');
const hre = require('hardhat');

const { INFURA_PROJECT_ID, WALLET_PRIVATE_KEY } = process.env;

const server = express();

const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/' + INFURA_PROJECT_ID, 11155111);
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

server.post('/deploy', async (req, res) => {
    var arg1 = ["0x07128963Cafd50de0E338b3234ECe7C6D4F100D5", "0xCeA31A284AE1Be036c4c3383D19393438f2ACaF5"]
    var arg2 = 1

    const gasLimit = 1500000;

    const MyContract = await ethers.getContractFactory('MultiSigWallet');
    const deployerAddress = wallet.address; // Get the address from the wallet

    const transactionParameters = {
        from: deployerAddress,
        gasLimit: gasLimit,
        nonce: 0,
    };

    const myContract = await MyContract.deploy(arg1, arg2, transactionParameters);

    await myContract.deployed();
    console.log('Contract deployed to address:', myContract.address);

    res.send({
        address: myContract.address,
        etherscan: "https://sepolia.etherscan.io/address/" + myContract.address,
        abi: MyContract.interface.format('json')
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});