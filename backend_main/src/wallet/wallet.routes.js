const Router = require("express").Router()



const { registerWallet } = require("./wallet.controller");



Router.post('/register',registerWallet)





module.exports