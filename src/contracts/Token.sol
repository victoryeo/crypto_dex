// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    string _name = "Test Token";
    string _symbol = "Test";
    address private owner;
    // in erc20, token base is 10**18
    // for 1 million tokens,
    // multiple 1,000,000 by 10**18
    uint256 _totalSupply = 1000000000000000000000000; 
    event TransferEv(address indexed from, address indexed to, uint256 value);
    event ApprovalEv(address indexed owner, address indexed spender, uint256 value);
    mapping(address => uint256) balances;
    mapping (address => mapping (address => uint256)) internal allowed;
    // event for EVM logging
    event OwnerSet(address indexed oldOwner, address indexed newOwner,
      string arg1, string arg2);
    
    constructor(
      string memory name,
      string memory symbol
    ) ERC20(name, symbol) {
      owner = msg.sender;
      balances[owner] = balances[owner] + (_totalSupply);
      emit OwnerSet(address(0), owner, name, symbol);
    }

    function totalSupply() public view virtual override returns (uint256) {
      return _totalSupply;
    }

    function balanceOf(address _owner) public override view returns (uint256) {
      return balances[_owner];
    }

    function transfer(address _to, uint256 _value) public override returns (bool) {
      require(_value <= balances[msg.sender]);
      require(_to != address(0));
      balances[msg.sender] = balances[msg.sender] - (_value);
      balances[_to] = balances[_to] + (_value);
      emit TransferEv(msg.sender, _to, _value);
      return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool) {
      require(_value <= balances[_from], "Not enough balance");
      //require(_value <= allowed[_from][msg.sender]);
      //require(_to != address(0));
      balances[_from] = balances[_from] - (_value);
      balances[_to] = balances[_to] + (_value);
      //allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
      emit TransferEv(_from, _to, _value);
      return true;
    }

    function approve(address _spender, uint256 _value) public override returns (bool) {
      allowed[msg.sender][_spender] = _value;
      emit ApprovalEv(msg.sender, _spender, _value);
      return true;
    }

    function allowance(address _owner,address _spender) public override view returns (uint256) {
      return allowed[_owner][_spender];
    }

    function increaseApproval(address _spender, uint256 _addedValue)
        public returns (bool) {
      allowed[msg.sender][_spender] = (allowed[msg.sender][_spender] + (_addedValue));
      emit ApprovalEv(msg.sender, _spender, allowed[msg.sender][_spender]);
      return true;
    }

    function decreaseApproval(address _spender, uint256 _subtractedValue)
        public returns (bool) {
      uint256 oldValue = allowed[msg.sender][_spender];
      if (_subtractedValue >= oldValue) {
        allowed[msg.sender][_spender] = 0;
      } else {
        allowed[msg.sender][_spender] = oldValue - (_subtractedValue);
      }

      emit ApprovalEv(msg.sender, _spender, allowed[msg.sender][_spender]);
      return true;
    }
}