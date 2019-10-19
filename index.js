const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
var mongoose = require('mongoose');
var config = require('./config');
const path = require('path');
 

//Mongoose connection
mongoose.connect(config.db.mongoURI, { useNewUrlParser: true })
    .then(() => console.log("DB connected", config.db.mongoURI))
    .catch(err => console.log("db err", err));


app.use(express.static(path.join(__dirname, "client/public")))


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token,X-PINGOTHER");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./Models/Order')
const Order = mongoose.model('orderSchema'); 

app.post('/postOrder', (req, res) => {
    console.log(req.body);
    var obj = new Order({
    maker:req.body.maker,
    qty:req.body.quantity,
    strikePrice:req.body.strikePrice,
    baseToken: req.body.baseTokenAddress,
    quoteToken: req.body.quoteTokenAddress,
    expiry:req.body.expiryDateTimestamp,
    premium: req.body.premium
    })
    obj.save()
    .then(()=>{
        console.log("obj saved");
        res.send('orderSaved');
    })
    .catch(err=>{
        console.log(err);
        res.send('failed');
    })
})





app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "public", "index.html"));
});

var port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started at port ${port}`);
})