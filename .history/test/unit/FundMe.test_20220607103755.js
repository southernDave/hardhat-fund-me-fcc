const {deployments, ethers, getNamedAccounts } = require("hardhat")
const {assert, expect } = require("chai")

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
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    
    describe("fund", async function() {
        it("fails if you don't send enough ETH", async function(){
            await expect(fundMe.fund()).to.be.revertedWith("you need to spend more ETH") 
        })
    })
    it("updated the amount funded data structure", async function() {
        await fundMe.fund({value: sendValue})
        const response = await fundMe.addressToAmountFunded(
            deployer.address
        )
        assert.equal(response.toString(), sendValue.toString())
    })
})