const { network } = require("hardhat");
const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

    const tokenAddress = "0x0.."
    const arguments_presale = [1500, tokenAddress]; // 15%
    const Presale = await deploy("Presale", {
        from: deployer,
        args: arguments_presale,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });
    // Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...Presale");
        await verify(Presale.address, arguments_presale);
    }
}

main()