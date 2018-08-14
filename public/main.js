const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
let contract;

async function submitPrice() {
    web3.eth.getAccounts(async (error, accounts) => {
        const price = document.getElementById('price').value;
        const txn = await contract.updatePrice(price, {from: accounts[0]});
        console.log(txn);
    });
}

$.get('./Prices.json', (contractData) => {


    const abi = contractData.abi;
    const address = contractData.networks[Object.keys(contractData.networks)[0]].address;

    const DEPLOYED_BLOCK_NO = 0;
    contract = web3.eth.contract(abi).at(address);
    const priceUpdateEvent = contract.PriceUpdated({}, {fromBlock: DEPLOYED_BLOCK_NO, toBlock: 'pending'});




    let prices = [];
    let times = [];
    const ctx = document.getElementById("priceChart").getContext('2d');
    const priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Price',
                data: prices,
                fill: false,
            }]
        },
        options: {
            responsive: false,
            title: {
                display: true,
                text: 'Price vs Time'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Price'
                    }
                }]
            }
        }
    });

    priceUpdateEvent.watch(function (error, result) {
        const operator = result.args.operator;
        const price = result.args.price;
        const time = result.args.time;

        prices.push(price);
        times.push(time);

        priceChart.update();
    });


});
