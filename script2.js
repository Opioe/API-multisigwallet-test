const { ethers } = require("hardhat");
const hre = require('hardhat');
const { isMainThread } = require("worker_threads");

var arg1 = ["0x07128963Cafd50de0E338b3234ECe7C6D4F100D5", "0xCeA31A284AE1Be036c4c3383D19393438f2ACaF5"];
var arg2 = 1;

function main() {
    const artifact = hre.artifacts.readArtifactSync('MultiSigWallet');
    console.log(artifact.bytecode);
}

main().then((result) => {
    console.log(result);
})
    .catch((error) => {
        console.error(error);
    });
