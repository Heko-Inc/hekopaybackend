const Router = require("express").Router();

const currencyController = require("./currency.controller");

const asyncMiddleware = require("../middlewares/asyncMiddleware");






Router.post('/',asyncMiddleware(currencyController.registerCurrency));

Router.get('/',asyncMiddleware(currencyController.getAllCurrencies));







module.exports = Router;