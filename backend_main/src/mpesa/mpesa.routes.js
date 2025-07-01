const Router = require('express').Router()




const { createToken, stkPush, handleMpesaCallback } = require('./mpesa.controller')    



// Router.post('/get', createToken, stkPush)



Router.post('/callback', handleMpesaCallback)




module.exports = Router