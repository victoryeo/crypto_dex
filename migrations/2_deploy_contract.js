var swap = artifacts.require("SimpleSwap");
var token = artifacts.require("Token");

module.exports = async function(deployer){
  await deployer.deploy(token);
  const tokenInst = await token.deployed()

  await deployer.deploy(swap, tokenInst.address);
  const swapInst = await swap.deployed()

  //await tokenInst.transfer(swapInst.address, '1000000000000000000000000')
}
