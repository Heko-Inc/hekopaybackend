const Router = require('express').Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const CurrencyController = require('./currency.controller');
const CurrencySchema = require('./currency.validator');

Router.post(
  '/',
  validateRequest(CurrencySchema.createCurrencySchema),
  asyncMiddleware(CurrencyController.createCurrency)
);

Router.get(
  '/',
  asyncMiddleware(CurrencyController.getAllCurrencies)
);

Router.get(
  '/:code',
  validateRequest(CurrencySchema.currencyCodeSchema, 'params'),
  asyncMiddleware(CurrencyController.getCurrencyByCode)
);

Router.patch(
  '/:code',
  validateRequest(CurrencySchema.currencyCodeSchema, 'params'),
  validateRequest(CurrencySchema.updateCurrencySchema),
  asyncMiddleware(CurrencyController.updateCurrency)
);

Router.delete(
  '/:code',
  validateRequest(CurrencySchema.currencyCodeSchema, 'params'),
  asyncMiddleware(CurrencyController.deleteCurrency)
);

Router.post(
  '/:code/activate',
  validateRequest(CurrencySchema.currencyCodeSchema, 'params'),
  asyncMiddleware(CurrencyController.activateCurrency)
);

Router.post(
  '/bulk',
  validateRequest(CurrencySchema.bulkCreateCurrencySchema),
  asyncMiddleware(CurrencyController.bulkCreateCurrencies)
);

module.exports = Router;