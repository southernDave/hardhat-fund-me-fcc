//function deployFunc(hre) {
  //  console.log("hi");
//}

const { networks } = require("../hardhat.config")

//module.exports.default = deployFunc
//module.exports = async (hre) => {
  //  const { getNamedAccount, deployments } = hre
//}

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const {deployer} = await getNamedAccounts()
  const chainId = networks.config.chainId
}