const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
    const {deployer} = await getNamedAccounts()
    const fundMe = await ethers.getContract("fundMe", deployer)
    console.log("funding...");
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log("got it back!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });