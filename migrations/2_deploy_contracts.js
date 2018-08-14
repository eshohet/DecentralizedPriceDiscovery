const Prices = artifacts.require("./Prices.sol");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(Prices);
    const prices = await Prices.deployed();
    await prices.addAddressToWhitelist(accounts[0], {from: accounts[0]});
};
