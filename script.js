const { ethers } = require("hardhat");
const hre = require('hardhat');

var arg1 = ["0x07128963Cafd50de0E338b3234ECe7C6D4F100D5", "0xCeA31A284AE1Be036c4c3383D19393438f2ACaF5"];
var arg2 = 1;

async function deployContract() {
    const MyContract = await hre.ethers.getContractFactory('MultiSigWallet');
    const myContract = await MyContract.deploy(arg1, arg2);

    console.log('Contract deployed to address:', myContract.address);

    return {
        address: myContract.address,
        etherscan: "https://sepolia.etherscan.io/address/" + myContract.address,
        abi: MyContract.interface.format('json')
    };
}

deployContract()
    .then((result) => {
        // Do something with the deployment result, e.g., send it as a response.
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });
