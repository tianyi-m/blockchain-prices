const express = require('express'),
app = express()

require('dotenv').config()

const PORT = process.env.PORT || 3000

let data = {'BTCBuyPriceCoinBase':0, 'BTCSellPriceCoinBase':0, 'ETHBuyPriceCoinBase':0, 'ETHSellPriceCoinBase':0,
            'BTCBuyPriceBlockchain':0, 'BTCSellPriceBlockchain':0, 'ETHBuyPriceBlockChain':0, 'ETHSellPriceBlockChain':0}

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

    let exchange = require('blockchain.info/exchange')
    amount = 1
    currency = 'USD'
    price = exchange.fromBTC(amount, currency)
    console.log(price)

    const BitsoNode = require("@lomelidev/bitso-api");
 
    const client = new BitsoNode({
        key: "KEY",
        secret: "SECRET"
    });
    
    client.public
    .ticker({
        book: BitsoNode.exchanges.MXN_ETH
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
        res.send(data)
})

app.listen(PORT, ()=>{
    console.log('Listening on Port: ${PORT}')
})