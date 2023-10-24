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

    const bodyreq_signers = await req.body.signers;
    if (typeof bodyreq_signers != "object") {
        res.send({
            error: "Invalid argument type of signers",
        });
        return res.end();
    }
    if (bodyreq_signers.length < 2 || bodyreq_signers.length > 10) {
        res.send({
            error: "Invalid number of signers, expected between 2 and 10",
        });
        return res.end();
    }
    for (let i = 0; i < bodyreq_signers.length; i++) {
        if (typeof bodyreq_signers[i] != "string" || bodyreq_signers[i].length != 42 || bodyreq_signers[i].slice(0, 2) != "0x") {
            res.send({
                error: "Invalid argument type of signers at index " + i + " (current argument at index " + i + " : \'" + bodyreq_signers[i] + "\')",
            });
            return res.end();
        } else {
            for (let j = 2; j < 42; j++) {
                if (bodyreq_signers[i][j] < "0" || bodyreq_signers[i][j] > "9") {
                    if (bodyreq_signers[i][j] < "A" || bodyreq_signers[i][j] > "F") {
                        if (bodyreq_signers[i][j] < "a" || bodyreq_signers[i][j] > "f") {
                            res.send({
                                error: "Invalid character at index " + j + " of signers at index " + i + " (current character at index " + j + " : \'" + bodyreq_signers[i][j] + "\')",
                            });
                            return res.end();
                        }
                    }
                }
            }
        }
    }

    const bodyreq_required = await req.body.required;
    if (typeof bodyreq_required != "number") {
        res.send({
            error: "Invalid argument type of required",
        });
        return res.end();
    }
    if (bodyreq_required < 1 || bodyreq_required > bodyreq_signers.length) {
        res.send({
            error: "Invalid number of required, expected between 1 and the number of signers (in your request : " + bodyreq_signers.length + " signers)",
        });
        return res.end();
    }

    console.log("preparing the transaction data");

    const provider = new ethers.JsonRpcProvider(RPCurl);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

    const nonce = await wallet.getNonce();

    const contractArtifact = await hre.artifacts.readArtifact('MultiSigWallet');
    const contractBytecode = contractArtifact.bytecode;
    const contractABI = contractArtifact.abi;

    const contractFactory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);

    const constructorArgs = [bodyreq_signers, bodyreq_required];
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
    const network = await provider.getNetwork();
    res.send({
        success: "Transaction sent successfully",
        sendTxResponse: sendTxResponse.hash,
        network: network,
    });
    console.log("API response sent");
    return res.end();
});

server.get('/contractAddress', async (req, res) => {
    const txhash = await req.body.txhash;
    if (typeof txhash != "string" || txhash.length != 66 || txhash.slice(0, 2) != "0x") {
        res.send({
            error: "Invalid argument type or format of txhash",
        });
        return res.end();
    } else {
        for (let i = 2; i < 66; i++) {
            if (txhash[i] < "0" || txhash[i] > "9") {
                if (txhash[i] < "A" || txhash[i] > "F") {
                    if (txhash[i] < "a" || txhash[i] > "f") {
                        res.send({
                            error: "Invalid character at index " + i + " of txhash (current character at index " + i + " : \'" + txhash[i] + "\')",
                        });
                        return res.end();
                    }
                }
            }
        }
    }

    const provider = new ethers.JsonRpcProvider(RPCurl);

    try {
        const tx = await provider.getTransaction(txhash);
        if (tx == null) {
            res.send({
                error: "Transaction not found or not mined yet",
            });
            return res.end();
        }
    } catch (error) {
        res.send({
            error: "Invalid txhash",
            errorMessage: error.message,
        });
        return res.end();
    }

    try {
        const receipt = await provider.getTransactionReceipt(txhash);

        if (receipt.contractAddress) {
            res.send({
                contractAddress: receipt.contractAddress,
            });
            return res.end();
        } else {
            res.send({
                error: "No contract address found for this transaction, please verify that the transaction corresponds to a contract deployment",
            });
            return res.end();
        }
    } catch (error) {
        res.send({
            error: "Transaction not found or not mined yet",
            errorMessage: error.message,
        });
        return res.end();
    }
});

server.post('/requestOwnership', async (req, res) => {
    const futureOwner = await req.body.futureOwner;
    if (typeof futureOwner != "string" || futureOwner.length != 42 || futureOwner.slice(0, 2) != "0x") {
        res.send({
            error: "Invalid argument type or format of futureOwner",
        });
        return res.end();
    } else {
        for (let i = 2; i < 42; i++) {
            if (futureOwner[i] < "0" || futureOwner[i] > "9") {
                if (futureOwner[i] < "A" || futureOwner[i] > "F") {
                    if (futureOwner[i] < "a" || futureOwner[i] > "f") {
                        res.send({
                            error: "Invalid character at index " + i + " of futureOwner (current character at index " + i + " : \'" + futureOwner[i] + "\')",
                        });
                        return res.end();
                    }
                }
            }
        }
    }

    const contractAddress = await req.body.contractAddress;
    if (typeof contractAddress != "string" || contractAddress.length != 42 || contractAddress.slice(0, 2) != "0x") {
        res.send({
            error: "Invalid argument type or format of contractAddress",
        });
        return res.end();
    } else {
        for (let i = 2; i < 42; i++) {
            if (contractAddress[i] < "0" || contractAddress[i] > "9") {
                if (contractAddress[i] < "A" || contractAddress[i] > "F") {
                    if (contractAddress[i] < "a" || contractAddress[i] > "f") {
                        res.send({
                            error: "Invalid character at index " + i + " of contractAddress (current character at index " + i + " : \'" + contractAddress[i] + "\')",
                        });
                        return res.end();
                    }
                }
            }
        }
    }

    const provider = new ethers.JsonRpcProvider(RPCurl);

    const contractArtifact = await hre.artifacts.readArtifact('MultiSigWallet');
    const contractABI = contractArtifact.abi;

    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    try {
        await contract.owner();
    } catch (error) {
        res.send({
            error: "Invalid contract address",
            errorMessage: error.message,
        });
        return res.end();
    }

    const verif = await contract.owner();
    if (verif != wallet.address) {
        res.send({
            error: "We are not the owner of this contract",
            contractOwner: verif,
        });
        return res.end();
    }

    try {
        const tx = await contract.transferOwnership(futureOwner);
        res.send({
            tx: tx,
        });
        return res.end();
    } catch (error) {
        res.send({
            error: "Transaction reverted",
            errorMessage: error.message,
        });
        return res.end();
    }
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
