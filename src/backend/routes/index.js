const express = require('express')

const router = express.Router()
const app = express()

const Web3 = require('web3')
const contract = require('@truffle/contract')
const path = require('path')

const web3Prov = new Web3.providers.HttpProvider("http://localhost:9545")
const web3Inst = new Web3(web3Prov)

let contractABI = 
  require(path.join(__dirname, '../../../build/contracts/SimpleSwap.json'))
let swapContract = contract(contractABI)
swapContract.setProvider(web3Prov)

const deploy = async () => {
    accounts =  await web3Inst.eth.getAccounts()
    console.log('Attempt to deploy from account', accounts[0])

    console.log("gas price:" + await web3Inst.eth.getGasPrice())

    /*dexContract = await new web3Inst.eth.Contract(
        contractABI.abi
    )  
    .deploy({ data: contractABI.bytecode, arguments: [0] })
    .send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: '0',
    })*/
    let conInstance = await swapContract.deployed()

    console.log('Contract deployed to ', conInstance.address)
}
deploy()

module.exports = router