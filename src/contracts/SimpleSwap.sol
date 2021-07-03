// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.7;

import "./Token.sol";

contract SimpleSwap {
  Token public token;
  uint public rate = 100;

  event TokensPurchased(
    address account,
    address token,
    uint amount,
    uint rate
  );

  event TokensSold(
    address account,
    address token,
    uint amount,
    uint rate
  );

  constructor(Token _token) public {
    token = _token;
  }

  function buyTokens() public payable {
    // Calculate the number of tokens to buy
    uint tokenAmount = msg.value * rate;

    // Require that Swap has enough tokens
    require(token.balanceOf(address(this)) >= tokenAmount);

    // Buy: transfer tokens to the buyer
    token.transfer(msg.sender, tokenAmount);

    // Emit an event
    emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
  }

  function sellTokens(uint _amount) public {
    // User can't sell more tokens than they have
    require(token.balanceOf(msg.sender) >= _amount);

    // Calculate the amount of Ether to redeem
    uint etherAmount = _amount / rate;

    // Require that Swap has enough Ether
    require(address(this).balance >= etherAmount);

    // sale: transfer token from seller
    token.transferFrom(msg.sender, address(this), _amount);
    // to do: transfer eth to seller

    // Emit an event
    emit TokensSold(msg.sender, address(token), _amount, rate);
  }

}