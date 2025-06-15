const Router = require('express').Router();


const { registerMerchant,getMerchants,loginMerchant,getSingleMerchant } = require('./user.controller');


Router.post('/register', registerMerchant);


Router.post('/login',loginMerchant)


Router.get('/getAll',getMerchants)


Router.get('/:id', getSingleMerchant);


module.exports = Router