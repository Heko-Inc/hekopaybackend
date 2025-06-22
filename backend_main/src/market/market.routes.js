const Router = require('express').Router();

const asyncMiddleware = require('../middlewares/asyncMiddleware');

const MarketController = require('./market.controller');

const { registerMarketSchema } = require('./market.validator');

const validateRequest = require("../middlewares/validateRequest")

Router.post('/register', validateRequest(registerMarketSchema), asyncMiddleware(MarketController.registerMarket));

Router.get('/', asyncMiddleware(MarketController.getAllMarkets));


module.exports = Router;