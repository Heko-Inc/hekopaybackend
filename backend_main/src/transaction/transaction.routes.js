const validateRequest = require("../middlewares/validateRequest");

const TransactionController = require("./transaction.controller");

const Router = require("express").Router();

Router.get("/", async (res, req) => {
  res.status(200).json({ message: "Data gotten from the backend" });
});

Router.post("/transfer", TransactionController.sentInAppPayment);

module.exports = Router;
