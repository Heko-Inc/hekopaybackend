const Router = require("express").Router();

const MpesaController = require("../mpesa/mpesa.controller")

const {
  registerWallet,
  addWalletBalance,
  getWallets,
  freezeWallet,
  getWalletById,
  unfreezeWalletController,
} = require("./wallet.controller");


Router.post("/register", registerWallet);


Router.post("/add/balance",MpesaController.createToken, MpesaController.stkPush);

// Router.post("/add/balance",addWalletBalance);


Router.post("/freeze", freezeWallet);

Router.post("/unfreeze", unfreezeWalletController);


Router.get("/get", getWallets);


Router.get("/get/:walletId", getWalletById);


module.exports = Router;
