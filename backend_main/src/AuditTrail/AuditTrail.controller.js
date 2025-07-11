const AuditTrailService = require('./AuditTrail.service');

exports.getAllAuditTrails = async (req, res) => {
  const result = await AuditTrailService.getAllAuditTrails(req.query);
  res.sendResponse(result, "Audit trails retrieved successfully");
};

exports.getAuditTrailByWalletId = async (req, res) => {
  const result = await AuditTrailService.getAuditTrailByWalletId(
    req.params.walletId,
    req.query
  );
  res.sendResponse(result, "Wallet audit trails retrieved successfully");
};

exports.getAuditTrailByTransactionId = async (req, res) => {
  const result = await AuditTrailService.getAuditTrailByTransactionId(
    req.params.transactionId,
    req.query
  );
  res.sendResponse(result, "Transaction audit trails retrieved successfully");
};