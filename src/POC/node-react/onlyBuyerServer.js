const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');  
const urlencodedParser = bodyParser.urlencoded({ extended: false })  	
const sgMail = require('@sendgrid/mail');
const port = process.env.PORT || 5000;

const sendGridApiKey = 'someApi';
const onlyBuyersData = 'https://etmarketsapis.indiatimes.com/ET_Stats/onlybuyer?pagesize=1000&pid=4&exchange=nse&pageno=1&service=buyers&sortby=bestBuyQty&sortorder=desc&callback=ajaxResponse'

sgMail.setApiKey(sendGridApiKey);

//Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// app.use(cors({origin: 'http://localhost:'+ port}));

//production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  //
  app.get('/onlyBuyersData', (req, res) => {
  	axios.get(onlyBuyersData).then((result) => {
  		res.send(result.data);
  		},
        (err) => {
          res.send(err);
        }).catch(error => {
		   res.send(error);
		 });
    
  })
}
//build mode
app.get('/onlyBuyersData', (req, res) => {

  axios.get(onlyBuyersData).then((result) => {
  		res.send(result.data);
  		},
        (err) => {
          res.send(err);
        }).catch(error => {
		   res.send(error);
		 });
});

app.post('/onlyBuyDiff', (req, res) => {
	
  if(req.body.addedToOnlyBuyers || req.body.removedFromOnlyBuyers) {
  	const data = 'ADDED'+ req.body.addedToOnlyBuyers + 'REMOVED' + req.body.removedFromOnlyBuyers;
  	sgMail.send({
  		to: 'amol.naval@gmail.com',
  		from: 'amol.naval@gmail.com',
  		subject: 'Only Buyers change',
  		text: data
  	});
  }
	res.send('POST request to the homepage')
});



//start server
app.listen(port, (req, res) => {
  console.log( `server listening on port: ${port}`);
})