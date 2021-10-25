const express = require('express'),
app = express()

require('dotenv').config()

const PORT = process.env.PORT || 3000

let data = {}

app.get('/', (req, res)=>{
    let Client = require('coinbase').Client;
    let client = new Client({'apiKey': 'API KEY',
                            'apiSecret': 'API SECRET',
                            'strictSSL': false});

    client.getBuyPrice({'currencyPair': 'BTC-USD'}, function(err, price) {
        data['BTCBuyPriceCoinBase'] = price.data.amount;
    });

    client.getSellPrice({'currencyPair': 'BTC-USD'}, function(err, price) {
        data['BTCSellPriceCoinBase'] = price.data.amount;
    });

    client.getBuyPrice({'currencyPair': 'ETH-USD'}, function(err, price) {
        data['ETHBuyPriceCoinBase'] = price.data.amount;
    });

    client.getSellPrice({'currencyPair': 'ETH-USD'}, function(err, price) {
        data['ETHSellPriceCoinBase'] = price.data.amount;
    });

    const https = require('https')
    const options = {
        hostname: 'api.bitso.com',
        port: 443,
        path: '/v3/ticker?book=eth_mxn',
        method: 'GET'
    }

    const options2 = {
        hostname: 'api.bitso.com',
        port: 443,
        path: '/v3/ticker?book=btc_mxn',
        method: 'GET'
    }

    const request = https.request(options, response => {
        let dataBisto = '';
        response.on('data', (chunk) => {
            dataBisto = dataBisto + chunk.toString();
        });
    
        response.on('end', () => {
            const body = JSON.parse(dataBisto);
            data['ETHBuyPriceBisto'] = body.payload.bid
            data['ETHSellPriceBisto'] = body.payload.ask
            console.log(data);
        });
    })

    request.on('error', error => {
    console.error(error)
    })

    request.end()

    const request2 = https.request(options2, response => {
        let dataBisto2 = '';
        response.on('data', (chunk) => {
            dataBisto2 = dataBisto2 + chunk.toString();
        });
    
        response.on('end', () => {
            const body = JSON.parse(dataBisto2);
            data['BTCBuyPriceBisto'] = body.payload.bid
            data['BTCSellPriceBisto'] = body.payload.ask
            console.log(data);
        });
    })

    request2.on('error', error => {
    console.error(error)
    })

    request2.end()

    console.log(data);

    res.send(data)
})

app.listen(PORT, ()=>{
    console.log('Listening on Port: ${PORT}')
})