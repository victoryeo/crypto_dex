const Token = artifacts.require('Token')
const SimpleSwap = artifacts.require('SimpleSwap')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  console.log(n)
  let newvalue = web3.utils.toWei(n, 'ether')
  console.log(newvalue)
  return newvalue
}

contract('SimpleSwap', ([deployer, investor]) => {
    let token, simpleSwap

    before(async () => {
        token = await Token.new("Test Token","world")
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

    describe('buyTokens()', async () => {
        let result
    
        before(async () => {
          // Purchase tokens before each example
          result = await simpleSwap.buyTokens({ from: investor, 
            value: web3.utils.toWei('1', 'ether')})
        })

        it('Allows user to purchase tokens from simpleSwap for a fixed price', async () => {
            // Check investor token balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))
      
            // Check simpleSwap balance after purchase
            let simpleSwapBalance
            simpleSwapBalance = await token.balanceOf(simpleSwap.address)
            assert.equal(simpleSwapBalance.toString(), tokens('999900'))
            simpleSwapBalance = await web3.eth.getBalance(simpleSwap.address)
            assert.equal(simpleSwapBalance.toString(), web3.utils.toWei('1', 'Ether'))
      
            // Check logs to ensure event was emitted with correct data
            console.log(result.logs)
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
          })
    })

    describe('sellTokens()', async () => {
        let result
    
        before(async () => {
          // Investor must approve tokens before the purchase
          await token.approve(simpleSwap.address, tokens('100'), { from: investor })
          // Investor sells tokens
          result = await simpleSwap.sellTokens(tokens('100'), { from: investor })
        })
    
        it('Allows user to instantly sell tokens to ethSwap for a fixed price', async () => {
          // Check investor token balance after sold
          let investorBalance = await token.balanceOf(investor)
          assert.equal(investorBalance.toString(), tokens('0'))
    
          // Check simpleSwap balance after sold
          let simpleSwapBalance
          simpleSwapBalance = await token.balanceOf(simpleSwap.address)
          assert.equal(simpleSwapBalance.toString(), tokens('1000000'))
          simpleSwapBalance = await web3.eth.getBalance(simpleSwap.address)
          assert.equal(simpleSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))
    
          // Check logs to ensure event was emitted with correct data
          const event = result.logs[0].args
          assert.equal(event.account, investor)
          assert.equal(event.token, token.address)
          assert.equal(event.amount.toString(), tokens('100').toString())
          assert.equal(event.rate.toString(), '100')
    
          // FAILURE: investor can't sell more tokens than they have
          await simpleSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
        })
    })    
})  