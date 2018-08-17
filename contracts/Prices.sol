pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/access/Whitelist.sol';

contract Prices is Whitelist {

    event PriceUpdated(address indexed operator, uint256 indexed procedure, uint256 price, uint256 time);

    function updatePrice(uint256 _price, uint256 _procedure) onlyIfWhitelisted(msg.sender) public {
        emit PriceUpdated(msg.sender, _procedure, _price, now);
    }
}
