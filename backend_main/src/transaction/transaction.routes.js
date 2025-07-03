const Router = require('express').Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const TransactionController = require('./transaction.controller');
const TransactionSchema = require('./transaction.validator');

Router.post(
  '/send',
  validateRequest(TransactionSchema.sendPaymentSchema),
  asyncMiddleware(TransactionController.sendInAppPayment)
);

Router.get(
  '/',
  validateRequest(TransactionSchema.paginationSchema, 'query'),
  asyncMiddleware(TransactionController.getAllTransactions)
);

Router.get(
  '/:id',
  validateRequest(TransactionSchema.transactionIdSchema, 'params'),
  asyncMiddleware(TransactionController.getTransactionById)
);

Router.get(
  '/user/:userId',
  validateRequest(TransactionSchema.userTransactionsSchema, 'params'),
  validateRequest(TransactionSchema.paginationSchema, 'query'),
  asyncMiddleware(TransactionController.getUserTransactions)
);

module.exports = Router;