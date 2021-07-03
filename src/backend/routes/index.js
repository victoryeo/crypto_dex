const express = require('express')

const router = express.Router()
const app = express()

const Web3 = require('web3')
const contract = require('@truffle/contract')
const path = require('path')

const web3Prov = new Web3.providers.HttpProvider("http://localhost:9545")
const web3Inst = new Web3(web3Prov)

let tokenContractABI =
  require(path.join(__dirname, '../../../build/contracts/Token.json'))
let swapContractABI =
  require(path.join(__dirname, '../../../build/contracts/SimpleSwap.json'))

/*let tokenContract = contract(tokenContractABI)
let swapContract = contract(swapContractABI)
swapContract.setProvider(web3Prov)
tokenContract.setProvider(web3Prov)*/

const deploy = async () => {
    accounts =  await web3Inst.eth.getAccounts()
    console.log('Attempt to deploy from account', accounts[0])

    console.log("gas price:" + await web3Inst.eth.getGasPrice())

    tokenInst = await new web3Inst.eth.Contract(
        tokenContractABI.abi
    )  
    .deploy({ data: tokenContractABI.bytecode, arguments: ["hello", "dex"] })
    .send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: '0',
    })
    console.log('Contract deployed to ', tokenInst._address)

    tokenInst.getPastEvents('OwnerSet', {}, {})
    .then(function(events){
      console.log("then")
      console.log(events)
    })

    let bala = await tokenInst.methods.balanceOf(accounts[0]).call()
    console.log(`balance ${bala.toString()}`)

    swapInst = await new web3Inst.eth.Contract(
        swapContractABI.abi
    )  
    .deploy({ data: swapContractABI.bytecode, arguments: [tokenInst._address] })
    .send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: '0',
    })
    console.log('Contract deployed to ', swapInst._address)
    let retVal = await tokenInst.methods.transfer(swapInst._address, 
        `${bala.toString()}`)
        .send({from: accounts[0]})
    console.log(retVal)

   /* let tokenInst = await tokenContract.deployed(accounts[0])
    console.log('Contract deployed to ', tokenInst.address)
    let bala = await tokenInst.balanceOf(accounts[0])
    console.log(bala.toString())
    let swapInst = await swapContract.deployed(tokenInst.address)
    console.log('Contract deployed to ', swapInst.address)*/

    //await tokenInst.transfer(swapInst.address, '1000000000000000000000000', {from: accounts[0]})
}
deploy()

module.exports = router