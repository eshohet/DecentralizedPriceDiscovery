pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/access/Whitelist.sol';

contract Prices is Whitelist {

    event PriceUpdated(address indexed operator, uint price, uint time);

    function updatePrice(uint _price) onlyIfWhitelisted(msg.sender) public {
        emit PriceUpdated(msg.sender, _price, now);
    }
}
