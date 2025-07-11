const Router = require('express').Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const AuditTrailValidator = require('./auditTrail.validator');
const AuditTrailController = require("./AuditTrail.controller")

// Get all audit trails with pagination
Router.get(
  '/',
  validateRequest(AuditTrailValidator.paginationSchema, 'query'),
  asyncMiddleware(AuditTrailController.getAllAuditTrails)
);

// Get audit trails by wallet ID
Router.get(
  '/wallet/:walletId',
  validateRequest(AuditTrailValidator.walletIdSchema, 'params'),
  validateRequest(AuditTrailValidator.paginationSchema, 'query'),
  asyncMiddleware(AuditTrailController.getAuditTrailByWalletId)
);

// Get audit trails by transaction ID
Router.get(
  '/transaction/:transactionId',
  validateRequest(AuditTrailValidator.transactionIdSchema, 'params'),
  validateRequest(AuditTrailValidator.paginationSchema, 'query'),
  asyncMiddleware(AuditTrailController.getAuditTrailByTransactionId)
);

module.exports = Router;