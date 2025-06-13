const Router = require('express').Router()




const { createToken, stkPush } = require('./stkpush.controller')    












Router.post('/get', createToken, stkPush)








module.exports = Router