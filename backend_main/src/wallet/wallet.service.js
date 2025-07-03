const { Wallet, WalletAuditTrail } = require('../config/modelsConfig');
const { v4: uuidv4 } = require('uuid');
const Decimal = require('decimal.js');

const registerWalletService = async ({
  userId,
  marketId,
  walletType,
  currency,
  creationSource
}) => {
  const existingWallet = await Wallet.findOne({
    where: { userId, marketId, currency }
  });

  if (existingWallet) {
    throw {
      status: 409,
      message: "Wallet already exists for this user in this market and currency"
    };
  }

  return await Wallet.create({
    id: uuidv4(),
    userId,
    marketId,
    walletType,
    currency,
    creationSource
  });
};

const addBalanceToWallet = async ({ walletId, amount, performedBy }) => {
  const wallet = await Wallet.findOne({ where: { id: walletId } });

  if (!wallet) throw { status: 404, message: "Wallet not found" };
  if (!wallet.isActive) throw { status: 403, message: "Wallet is inactive" };
  if (wallet.isFrozen) throw { status: 403, message: "Wallet is frozen" };

  const balanceBefore = new Decimal(wallet.balance);
  const amountToAdd = new Decimal(amount);
  const balanceAfter = balanceBefore.plus(amountToAdd);

  wallet.balance = balanceAfter.toString();
  await wallet.save();

  await WalletAuditTrail.create({
    id: uuidv4(),
    walletId: wallet.id,
    action: 'credit',
    amount: amountToAdd.toString(),
    balanceBefore: balanceBefore.toString(),
    balanceAfter: balanceAfter.toString(),
    performedBy,
    reason: 'Manual top-up'
  });

  return {
    walletId: wallet.id,
    newBalance: wallet.balance,
    performedBy
  };
};

const getAllWallets = async () => {
  return await Wallet.findAll({
    order: [['createdAt', 'DESC']]
  });
};

const getWalletByIdService = async (walletId) => {
  const wallet = await Wallet.findOne({ where: { id: walletId } });
  if (!wallet) throw { status: 404, message: "Wallet not found" };
  return wallet;
};

const freezeWalletService = async ({ walletId, reason, performedBy }) => {
  const wallet = await Wallet.findOne({ where: { id: walletId } });

  if (!wallet) throw { status: 404, message: "Wallet not found" };
  if (!wallet.isActive) throw { status: 403, message: "Wallet is inactive" };
  if (wallet.isFrozen) throw { status: 409, message: "Wallet already frozen" };

  wallet.isFrozen = true;
  wallet.frozenReason = reason;
  wallet.frozenAt = new Date();
  wallet.frozenBy = performedBy;
  await wallet.save();

  return {
    walletId: wallet.id,
    frozenAt: wallet.frozenAt,
    frozenBy: wallet.frozenBy
  };
};

const unfreezeWalletService = async ({ walletId, performedBy }) => {
  const wallet = await Wallet.findOne({ where: { id: walletId } });

  if (!wallet) throw { status: 404, message: "Wallet not found" };
  if (!wallet.isActive) throw { status: 403, message: "Wallet is inactive" };
  if (!wallet.isFrozen) throw { status: 409, message: "Wallet not frozen" };

  wallet.isFrozen = false;
  wallet.frozenReason = null;
  wallet.frozenAt = null;
  wallet.frozenBy = null;
  await wallet.save();

  return {
    walletId: wallet.id,
    unfrozenAt: new Date()
  };
};

module.exports = {
  registerWalletService,
  addBalanceToWallet,
  getAllWallets,
  getWalletByIdService,
  freezeWalletService,
  unfreezeWalletService
};