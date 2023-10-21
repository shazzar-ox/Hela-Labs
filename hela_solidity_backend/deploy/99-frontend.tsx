import fs from "fs";
import { ethers, deployments, network } from "hardhat";
const contractAddressPath: string =
	"../server/constants/contractAddress.json";
const abiPath: string = "../server/constants/abi.json";
const chainId = network.config.chainId;
module.exports = async () => {
	const { get } = deployments;
	const fruitFactory = await get("FruitVoting");
	console.log("writing abi...");

	fs.writeFileSync(abiPath, JSON.stringify(fruitFactory.abi));

	console.log("writing address...");

	let contractAddress = JSON.parse(
		fs.readFileSync(contractAddressPath, "utf-8")
	);
	if(chainId as number in contractAddress){
		if (contractAddress[chainId as number] != fruitFactory.address) {
			contractAddress[chainId as number]=fruitFactory.address;
		}
	}
	 else {
		contractAddress[chainId as number] = fruitFactory.address;
	}

	fs.writeFileSync(contractAddressPath, JSON.stringify(contractAddress));
};
