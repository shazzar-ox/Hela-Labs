import { ethers } from "ethers"
import fs from "fs"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const providerUrl = process.env.SEPOLIA_RPC_URL || "key" // provider url
const provider = new ethers.JsonRpcProvider(providerUrl) // connect url to json rpc


//  get the path to the contract address and abi
const contractAddressPath =
    "./constants/contractAddress.json";
const abiPath = "./constants/abi.json";


const abi = JSON.parse(fs.readFileSync(abiPath, "utf-8")) // fs module to read data abi

const contractAddress = JSON.parse(fs.readFileSync(contractAddressPath, "utf-8")) // fs module to read contract address


const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "key", provider) // connect to a wallet 

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
        const ethBalance = parseInt(getEthBalance.data.result) / 1e18 // current eth balance of wallet address

        const contractInterface = contractFactory.interface.encodeFunctionData("voteForFruit", [fruit]) // interacts with the function voteForFruits from the interfaces with the value of fruits

        const getEtimatedGas = await axios.post(providerUrl, {
            jsonrpc: "2.0",
            method: 'eth_estimateGas',
            params: [{ from: wallet.address, to: contractFactory.target, data: contractInterface }],
            id: chainId
        })

        const estimatedGas = parseInt(getEtimatedGas.data.result) / 1e18 // cuurent estimated gaz fee for the transaction....

        console.log(ethBalance > estimatedGas)


        // check if available balance is greater than estimated gas fee
        if (ethBalance > estimatedGas) {

            const transaction = await contractFactory.connect(wallet).voteForFruit(fruit) //voteFOrFruit function is called...

            // wait one transaction block
            await transaction.wait(1)
            res.status(200).json({ success: true, data: { data: fruit, message: "Vote Succesful", hash: transaction.hash } })
        }
        else {
            res.status(400).json({ success: false, data: { data: fruit, message: "Vote Unsuccesful", message: "Insufficient Balance" } })
        }
    } catch (error) {
        console.log(error.shortMessage)
        res.status(400).json({ success: false, data: { data: fruit, message: "Vote Unsuccesful", message: error } })
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