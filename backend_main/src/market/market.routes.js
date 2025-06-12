const Router = require('express').Router();



const { registerMarket } = require('./market.controller');



Router.post('/register', registerMarket);



module.exports = Router;