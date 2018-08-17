# Decentralized Price Discovery

The purpose of this project is to discover the fair market price of a procedure in a fully decentralized manner.

## Video

https://www.youtube.com/watch?v=nBVsWPTBsoo

## Setup & Operation
All dependencies will automatically be installed and ran with the following command:

`npm install && npm start`

## Overview

### Backend

In the backend, I utilize express js to spin up a simple server serving the ./public directory on port 3000.

When running the code, your browser will automatically open http://localhost:3000

```javascript const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Application listening on port 3000');
    require("openurl").open("http://localhost:3000/");
});
```


### Frontend

In the front end, a stable version of web3.0 (0.20.X) is used to interact with the smart contracts.

The following snippet is used to watch for events emitted by the smart contract.

```javascript
const DEPLOYED_BLOCK_NO = 0;
contract = web3.eth.contract(abi).at(address);
const priceUpdateEvent = contract.PriceUpdated({}, {fromBlock: DEPLOYED_BLOCK_NO, toBlock: 'pending'});
 priceUpdateEvent.watch(function (error, result) {
    const operator = result.args.operator;
    const procedure = result.args.procedure;
    const price = result.args.price;
    const time = result.args.time;

    prices.push(price);
    times.push(time);

    priceChart.update();
});
```


### Smart Contracts

The smart contract is straight forward and uses tightly packed unsigned integers for optimal gas effect:
No storage is needed, only an events are emitted and watched for on the front end.

```solidity
pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/access/Whitelist.sol';

contract Prices is Whitelist {

    event PriceUpdated(address indexed operator, uint256 indexed procedure, uint price, uint time);

    function updatePrice(uint _price, uint256 _procedure) onlyIfWhitelisted(msg.sender) public {
        emit PriceUpdated(msg.sender, _procedure, _price, now);
    }
}
```

I utilize a uint256 for the procedure in order to minimize gas costs and to take advantaged of indexing.



