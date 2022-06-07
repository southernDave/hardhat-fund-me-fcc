const { ethers } = require("ethers")
const {deployments} = require("hardhat")

describe('fundme', async function () {

    let fundMe
    beforeEach( async function () {
        //deploy our fundMe contract
        //using hardhat-deploy
        //const accounts = await ethers.getSigners()
        //const accountZero = accounts[0]
        const { deployer } = await getNamedAccounts
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
    })
    describe("constructor", async function() {
    })
})