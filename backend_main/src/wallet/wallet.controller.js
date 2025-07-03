const asyncMiddleware = require('../middlewares/asyncMiddleware');
const {
  registerWalletService,
  addBalanceToWallet,
  getAllWallets,
  freezeWalletService,
  getWalletByIdService,
  unfreezeWalletService
} = require('./wallet.service');

exports.registerWallet = asyncMiddleware(async (req, res) => {
  const wallet = await registerWalletService(req.body);
  res.sendResponse(wallet, "Wallet registered successfully", 201);
});

exports.addWalletBalance = asyncMiddleware(async (req, res) => {
  const result = await addBalanceToWallet(req.body);
  res.sendResponse(result, "Balance added successfully");
});

exports.getWallets = asyncMiddleware(async (req, res) => {
  const wallets = await getAllWallets();
  res.sendResponse(wallets, "Wallets retrieved successfully");
});

exports.getWalletById = asyncMiddleware(async (req, res) => {
  const wallet = await getWalletByIdService(req.params.walletId);
  res.sendResponse(wallet, "Wallet retrieved successfully");
});

exports.freezeWallet = asyncMiddleware(async (req, res) => {
  const result = await freezeWalletService(req.body);
  res.sendResponse(result, "Wallet frozen successfully");
});

exports.unfreezeWallet = asyncMiddleware(async (req, res) => {
  const result = await unfreezeWalletService(req.body);
  res.sendResponse(result, "Wallet unfrozen successfully");
});