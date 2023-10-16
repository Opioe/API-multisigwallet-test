const express = require('express');
const { ethers } = require('hardhat');
const dotenv = require('dotenv');
const server = express();

const { INFURA_API_KEY, WALLET_PRIVATE_KEY } = process.env;

const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/' + INFURA_API_KEY)
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);


var arg1 = ["0x07128963Cafd50de0E338b3234ECe7C6D4F100D5", "0xCeA31A284AE1Be036c4c3383D19393438f2ACaF5"]
var arg2 = 1

const MyContract = ethers.getContractFactory('MultiSigWallet');
const myContract = MyContract.deploy(arg1, arg2, { from: wallet });
myContract.deployed();
console.log('Contract deployed to address:', myContract.address);

res.send({
    address: myContract.address,
    etherscan: "https://sepolia.etherscan.io/address/" + myContract.address,
    abi: MyContract.interface.format('json')
});