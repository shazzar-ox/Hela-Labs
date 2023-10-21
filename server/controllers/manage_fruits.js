import { ethers } from "ethers"
import fs from "fs"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const providerUrl = process.env.SEPOLIA_RPC_URL || "key"
const provider = new ethers.JsonRpcProvider(providerUrl)
//  get the path to the contract address and abi
const contractAddressPath =
    "./constants/contractAddress.json";
const abiPath = "./constants/abi.json";

// fs module to read abi data
const abi = JSON.parse(fs.readFileSync(abiPath, "utf-8"))

const contractAddress = JSON.parse(fs.readFileSync(contractAddressPath, "utf-8"))

// connect to wallet provider
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "key", provider)

// voter function....
const voter = async (req, res) => {
    const { fruit, chainId } = req.body

    try {
        // create a contract instance....based on incoming chainId as contract can be deployed on multiple chains
        const contractFactory = new ethers.Contract(contractAddress[chainId], abi, provider)


        const getEthBalance = await axios.post(providerUrl, {
            jsonrpc: "2.0",
            method: 'eth_getBalance',
            params: [wallet.address, "latest"],
            id: chainId
        })
        const ethBalance = parseInt(getEthBalance.data.result) / 1e18
        const contractInterface = contractFactory.interface.encodeFunctionData("voteForFruit", [fruit])
        const getEtimatedGas = await axios.post(providerUrl, {
            jsonrpc: "2.0",
            method: 'eth_estimateGas',
            params: [{ from: wallet.address, to: contractFactory.target, data: contractInterface }],
            id: chainId
        })
        const estimatedGas = parseInt(getEtimatedGas.data.result) / 1e18
        console.log(ethBalance > estimatedGas)


        // chceck if available balance is greater than estimated gas fee
        if (ethBalance > estimatedGas) {
            // connect factory to wallet
            const transaction = await contractFactory.connect(wallet).voteForFruit(fruit)

            // wait one transaction block
            await transaction.wait(1)
            res.status(200).json({ success: true, data: { data: fruit, message: "Vote Succesful", hash: transaction.hash } })
        }
        else {
            res.status(400).json({ success: false, data: { data: fruit, message: "vote Unsuccesful", message: "Insufficient Balance" } })
        }
    } catch (error) {
        console.log(error.shortMessage)
        res.status(400).json({ success: false, data: { data: fruit, message: "vote Unsuccesful", message: error } })
    }
}

const result = async (req, res) => {
    const { fruit, chainId } = req.body
    try {
        // create a contract instance....based on incoming chainId as contract can be deployed on multiple chains
        const contractFactory = new ethers.Contract(contractAddress[chainId], abi, provider)
        const vote = await contractFactory.getVotes(fruit)
        console.log(vote)

        res.status(200).json({ success: true, data: { data: fruit, vote: vote.toString() } })
    } catch (error) {
        res.status(400).json({ success: true, data: { data: fruit, message: error } })

    }

}

export { voter, result }