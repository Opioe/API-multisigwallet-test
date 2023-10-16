const express = require("express");
const { HardhatRuntimeEnvironment, ethers } = require("hardhat");


const app = express();
const port = 3000;

app.use(express.json());

app.post("/deploy", async (req, res) => {
    var arg1 = ["0x07128963Cafd50de0E338b3234ECe7C6D4F100D5", "0xCeA31A284AE1Be036c4c3383D19393438f2ACaF5"]
    var arg2 = 1


    const hre = HardhatRuntimeEnvironment;
    const [deployer] = await hre.ethers.getSigners();
    const Contract = await hre.ethers.getContractFactory("MultiSigWallet");
    const contract = await Contract.deploy(arg1, arg2);
    await contract.waitForDeployment();

    res.status(200).json({ address: contract.address });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
