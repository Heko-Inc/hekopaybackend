const Router = require('express').Router();



const { registerMerchant,getMerchants } = require('./user.controller');




Router.post('/register', registerMerchant);


Router.get('/getAll',getMerchants)





module.exports = Router