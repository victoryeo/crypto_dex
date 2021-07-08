const Token = artifacts.require('Token')
const SimpleSwap = artifacts.require('SimpleSwap')

require('chai')
//require('chai-as-promised')
const { should } = require('chai');
should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether')
}

contract('SimpleSwap', ([deployer, investor]) => {
    let token, simpleSwap

    before(async () => {
        token = await Token.new("hello","world")
        simpleSwap = await SimpleSwap.new(token.address)
        // Transfer all tokens to simpleSwap (1 million)
        await token.transfer(simpleSwap.address, tokens('1000000'))
    })

    describe('Token deployment', async () => {
        it('contract has a name', async () => {
          const name = await token.name()
          assert.equal(name, 'Test Token')
        })
    })

    describe('SimpleSwap deployment', async () => {  
        it('contract has tokens', async () => {
          let balance = await token.balanceOf(simpleSwap.address)
          assert.equal(balance.toString(), tokens('1000000'))
        })
    })
})  