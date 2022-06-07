const { getNamedAccounts, ethers } = require("hardhat")

describe('FundMe', async function () {
    let fundMe
    let deployer
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
    })
})