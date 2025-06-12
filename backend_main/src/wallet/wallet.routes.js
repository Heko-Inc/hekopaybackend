const Router = require("express").Router()



const { registerWallet,addWalletBalance} = require("./wallet.controller");


Router.post('/register',registerWallet)


Router.post('/add/balance',addWalletBalance)



// Router.post('/get',fetchAllWallets)



module.exports = Router