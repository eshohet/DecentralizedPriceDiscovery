const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
let contract, priceChart;
let prices = [];
let times = [];
let currentProcedure = 0;

async function submitPrice() {
    web3.eth.getAccounts(async (error, accounts) => {


        const {value: price} = await swal({
            title: `What does a(n) ${procedures[currentProcedure]} cost?`,
            input: 'text',
            inputValue: 100,
            showCancelButton: true,
            inputValidator: (value) => {
                return !value && 'You need to write something!'
            }
        });

        const txn = await contract.updatePrice(price, currentProcedure, {from: accounts[0]});
        swal({
            title: 'Success!',
            text: `You have successfully updated the price for procedure ${procedures[procedureNumber]}`,
            type: 'success',
            confirmButtonText: 'Continue'
        });
    });
}

function addData(chart, label, data) {
    chart.data.labels = label;
    chart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

$("#search").autocomplete({
    source: procedures
}).keypress(function (e) {
    const searchValue = $("#search").val();
    const procedureNumber = procedures.indexOf(searchValue);
    if (procedureNumber > -1) {
        //switch graph
        changeProcedure(procedureNumber);
    }
});

function changeProcedure(procedureNumber) {
    console.log(`switching graph to procedure ${procedureNumber}`);
    currentProcedure = procedureNumber;

    if(prices[currentProcedure] === undefined) {
        prices[currentProcedure] = [];
        times[currentProcedure] = [];
    }
    $("#dashboardMessage").css('display', 'none');
    $("#priceChart").css('display', 'block');
    $("#priceTitle").text(`${procedures[procedureNumber]} Price History`);
    addData(priceChart, times[currentProcedure], prices[currentProcedure]);
}

procedures.map((procedure) => {
    $("#medicalList").append(`<div class="card text-white bg-dark mb-3" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title"><a href="javascript:changeProcedure(${procedures.indexOf(procedure)});">${procedure}</a></h5>
  </div>
</div>`);
});


$.get('./Prices.json', (contractData) => {

    const abi = contractData.abi;
    const address = contractData.networks[Object.keys(contractData.networks)[0]].address;

    const DEPLOYED_BLOCK_NO = 0;
    contract = web3.eth.contract(abi).at(address);
    const priceUpdateEvent = contract.PriceUpdated({}, {fromBlock: DEPLOYED_BLOCK_NO, toBlock: 'pending'});


    const ctx = document.getElementById("priceChart").getContext('2d');

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                data: [],
                lineTension: 0,
                backgroundColor: 'transparent',
                borderColor: '#007bff',
                borderWidth: 4,
                pointBackgroundColor: '#007bff'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            },
            legend: {
                display: false,
            }
        }
    });

    priceUpdateEvent.watch(function (error, result) {
        const operator = result.args.operator;
        const procedure = result.args.procedure;
        const price = result.args.price;
        const time = moment.unix(result.args.time.toNumber()).fromNow();

        prices[procedure] === undefined ? prices[procedure] = [price.toNumber()] : prices[procedure].push(price.toNumber());
        times[procedure] === undefined ? times[procedure] = [time] : times[procedure].push(time);

        addData(priceChart, times[currentProcedure], prices[currentProcedure]);

    });


});
