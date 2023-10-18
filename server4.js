const ethers = require("ethers");
const dotenv = require('dotenv');
const hre = require('hardhat');
dotenv.config();
const { INFURA_API_KEY, WALLET_PRIVATE_KEY, QUICKNODE_API_KEY } = process.env;

const RPCurl = 'https://attentive-convincing-pallet.matic-testnet.quiknode.pro/' + QUICKNODE_API_KEY + '/';


async function main() {
    console.log("preparing the transaction data");

    const provider = new ethers.JsonRpcProvider(RPCurl);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

    const contractArtifact = await hre.artifacts.readArtifact('MultiSigWallet');
    const contractBytecode = contractArtifact.bytecode;
    const contractABI = contractArtifact.abi;
    const arg1 = ["0x07128963Cafd50de0E338b3234ECe7C6D4F100D5", "0x31236F42F4d3c052cc4720Da7CFFc74C9A1dA2B0"];
    const arg2 = 1;
    console.log(contractBytecode);
    console.log(contractABI);

    const contractFactory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);

    const constructorArgs = [arg1, arg2];
    const data = contractBytecode + contractFactory.interface.encodeDeploy(constructorArgs);

    console.log("deploying with transaction data");
    const tx = {
        nonce: 12,
        to: null,
        value: 0,
        gasPrice: 79520000000000,
        gasLimit: 3150,
        data: data,
        chainId: 80001,
    };
    const sendTxResponse = await wallet.sendTransaction(tx);
    console.log(sendTxResponse);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });