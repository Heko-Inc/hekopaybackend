const asyncMiddleware = require("../middlewares/asyncMiddleware")

const TransactionController = require("./transaction.controller");

const Router = require("express").Router();


Router.post("/transfer", TransactionController.sentInAppPayment);


Router.get("/",asyncMiddleware(TransactionController.getAllTransactions))


Router.get("/:id",asyncMiddleware(TransactionController.getTransactionById))



module.exports = Router;
