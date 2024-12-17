const hre = require("hardhat");


async function main() {
    await hre.run('compile');
    const mycontract = await hre.ethers.deployContract("ZombieOwnership");
    await mycontract.waitForDeployment();
    console.log("Contract was deployed to: ", mycontract.address);

}

main().catch((error) => {
console.error(error);
process.exitCode = 1;
});