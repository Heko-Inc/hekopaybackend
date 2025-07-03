const Router = require('express').Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const WalletController = require('./wallet.controller');
const WalletSchema = require('./wallet.validator');

Router.post(
  '/register',
  validateRequest(WalletSchema.registerWalletSchema),
  asyncMiddleware(WalletController.registerWallet)
);

Router.post(
  '/add-balance',
  validateRequest(WalletSchema.addBalanceSchema),
  asyncMiddleware(WalletController.addWalletBalance)
);

Router.get(
  '/',
  asyncMiddleware(WalletController.getWallets)
);

Router.get(
  '/:walletId',
  validateRequest(WalletSchema.walletIdSchema, 'params'),
  asyncMiddleware(WalletController.getWalletById)
);

Router.post(
  '/freeze',
  validateRequest(WalletSchema.freezeWalletSchema),
  asyncMiddleware(WalletController.freezeWallet)
);

Router.post(
  '/unfreeze',
  validateRequest(WalletSchema.unfreezeWalletSchema),
  asyncMiddleware(WalletController.unfreezeWallet)
);

module.exports = Router;