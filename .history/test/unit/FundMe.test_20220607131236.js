const {deployments, ethers, getNamedAccounts } = require("hardhat")
const {assert, expect } = require("chai")

 !developmentChains.includes(network.name)
    ? describe.skip 
    : describe('fundme', async function () {

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
    it("adds funder to array of funders", async function(){
        await fundMe.fund({value: sendValue})
        const funder = await fundMe.funders(0)
        assert.equal(funder, deployer)
    })
    describe('withdraw', async function(){
        beforeEach(async function (){
            await fundMe.fund({value: sendValue})
        })

        it("withdraw ETH from a single founder", async function(){
            //arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeploymentBalance = await fundMe.provider.getBalance(
                deployer
            )
            //act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const {gasUsed, effectiveGasPrice} = transactionReceipt

            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)

            const endingDeployerBalance  = await fundMe.provider.getBalance(deployer)

            
            
            //assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance),
                 endingDeployerBalance.add(gasCost).toString()
            )
        })
        it("allows us to withdraw with multuple funders", async function(){
            const accounts = await ethers.getSigner()
            for (let i = 1; i < 6; i ++){
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
               await fundMeConnectedContract.fund({value: sendValue})
            }

            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeploymentBalance = await fundMe.provider.getBalance(
                deployer
            )

            //act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const {gasUsed, effectiveGasPrice} = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)
            //assert
            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)

            const endingDeployerBalance  = await fundMe.provider.getBalance(deployer)

            
            
            //assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance),
                 endingDeployerBalance.add(gasCost).toString()
            )

            //make sure that the funders are reset properly
            await expect(fundMe.funders(0)).to.be.reverted

            for( i = 1; i < 6; i++){
                assert.equal(await fundMe.addressToAmountFunded(accounts[1].address)
                ,0
                )
            }
        })
    })

    it("only allows the owner to withdraw", async function() {
        const accounts = ethers.getSigners()
        const attacker = accounts[1]
        const attackerConnectedContract = await fundMe.connect(attacker)
        await expect(attackerConnectedContract.withdraw()).to.be.revertedWith("FundMe__NotOwner")
    })
})