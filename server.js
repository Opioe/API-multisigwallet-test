const express = require('express');
const ethers = require('hardhat');

const server = express();

server.post('/deploy', async (req, res) => {
    var arg1 = ["0x07128963Cafd50de0E338b3234ECe7C6D4F100D5", "0xCeA31A284AE1Be036c4c3383D19393438f2ACaF5"]
    var arg2 = 1

    const MyContract = await ethers.getContractFactory('MultiSigWallet');
    const myContract = await MyContract.deploy(arg1, arg2);

    console.log('Contract deployed to address:', myContract.address);

    res.send({
        address: myContract.address,
        etherscan : "https://sepolia.etherscan.io/address/" + myContract.address,
        abi: MyContract.interface.format('json')
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});