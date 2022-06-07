//function deployFunc(hre) {
  //  console.log("hi");
//}

const { networks } = require("../hardhat.config")

//module.exports.default = deployFunc
//module.exports = async (hre) => {
  //  const { getNamedAccount, deployments } = hre
//}

  const {networkConfig} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const {deployer} = await getNamedAccounts()
  const chainId = networks.config.chainId

  //if chainId is X use address Y
  //if chainId is Z use address A

  const ethUsdPriceFeedAddress = networkConfig(chainId)("ethUsdPriceFeed")

  //if the contract doesn't exist we deploy a minimal version for our local testing

  //well what happens when we want to change chains
  //when going for local host or hardhat network we want to use a mock

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [] // put priceFeed address
  })
}