const asyncMiddleware = require('../middlewares/asyncMiddleware');
const AuditTrailService = require('./auditTrail.service');

exports.getAllAuditTrails = asyncMiddleware(async (req, res) => {
  const result = await AuditTrailService.getAllAuditTrails(req.query);
  res.sendResponse(result, "Audit trails retrieved successfully");
});

exports.getAuditTrailByWalletId = asyncMiddleware(async (req, res) => {
  const result = await AuditTrailService.getAuditTrailByWalletId(
    req.params.walletId,  // Keep using camelCase here (route params remain unchanged)
    req.query
  );
  res.sendResponse(result, "Wallet audit trails retrieved successfully");
});

exports.getAuditTrailByTransactionId = asyncMiddleware(async (req, res) => {
  const result = await AuditTrailService.getAuditTrailByTransactionId(
    req.params.transactionId,  // Keep using camelCase here
    req.query
  );
  res.sendResponse(result, "Transaction audit trails retrieved successfully");
});