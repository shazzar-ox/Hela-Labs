import { ethers, deployments, getNamedAccounts, network } from "hardhat";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";
module.exports = async () => {
	const { get, log, deploy } = deployments;
	const { deployer } = await getNamedAccounts();
	const args: any[] = [];
	const fruitVoter = await deploy("FruitVoting", {
		from: deployer,
		log: true,
		args: [],
	});
	console.log("deploying contract.....");

	if (!developmentChains.includes(network.name)) {
		await verify(fruitVoter.address, args);
		console.log("verifying contract.....");
	}
};

module.exports.tags = ["all", "voteFruit"];
