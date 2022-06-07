const {deployments, ethers, getNamedAccounts } = require("hardhat")
const {assert} = require("chai")

describe('fundme', async function () {

    let fundMe
    let deployer
    let mockV3Aggregator
    beforeEach( async function () {
        //deploy our fundMe contract
        //using hardhat-deploy
        //const accounts = await ethers.getSigners()
        //const accountZero = accounts[0]
        const { deployer } = await getNamedAccounts
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
    })
    describe("constructor", async function() {
        it("sets the aggregatot addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
})