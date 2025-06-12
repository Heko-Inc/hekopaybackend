const Router = require('express').Router;



const { registerMerchant } = require('./user.controller');






Router.post('/register', registerMerchant);












module.exports = Router