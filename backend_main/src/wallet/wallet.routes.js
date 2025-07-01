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
<<<<<<< HEAD
Router.post("/add/balance", addWalletBalance);
=======


// Router.post("/add/balance",MpesaController.createToken, MpesaController.stkPush);

Router.post("/add/balance",addWalletBalance);



>>>>>>> c44c2b7aa36c58c6b4444f6d84cb79d079d90a34
Router.post("/freeze", freezeWallet);
Router.post("/unfreeze", unfreezeWalletController);
Router.get("/get", getWallets);
Router.get("/get/:walletId", getWalletById);


module.exports = Router;
