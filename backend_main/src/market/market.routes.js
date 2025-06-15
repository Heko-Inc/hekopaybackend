const Router = require('express').Router();


const { registerMarket,getAllMarkets } = require('./market.controller');


Router.post('/register', registerMarket);



Router.get('/all', getAllMarkets);




module.exports = Router;