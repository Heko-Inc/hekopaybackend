const TransactionService = require('./transaction.service');
const asyncMiddleware = require('../middlewares/asyncMiddleware');

exports.sendInAppPayment = asyncMiddleware(async (req, res) => {
  const result = await TransactionService.sendInAppPayment(req.body);
  res.sendResponse(result, "Transfer successful");
});

exports.getAllTransactions = asyncMiddleware(async (req, res) => {
  const result = await TransactionService.getAllTransactions(req.query);
  res.sendResponse(result);
});

exports.getTransactionById = asyncMiddleware(async (req, res) => {
  const transaction = await TransactionService.getTransactionById(req.params.id);
  res.sendResponse(transaction, "Transaction retrieved successfully");
});

exports.getUserTransactions = asyncMiddleware(async (req, res) => {
  const result = await TransactionService.getUserTransactions({
    ...req.query,
    baseUrl: `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`
  });
  res.sendResponse(result);
});

module.exports = exports;