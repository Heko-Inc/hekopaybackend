const { Wallet,WalletAuditTrail } = require("../config/modelsConfig/index");
const { v4: uuidv4 } = require("uuid");

const Decimal = require("decimal.js");

const addBalanceToWallet = async ({ wallet_id, amount, performed_by }) => {
  console.log(wallet_id, amount, performed_by);

  if (!wallet_id || !amount || isNaN(amount)) {
    const error = new Error("wallet_id and valid amount are required.");
    error.statusCode = 400;
    throw error;
  }

  const wallet = await Wallet.findOne({ where: { id: wallet_id } });

  if (!wallet) {
    const error = new Error("Wallet not found.");
    error.statusCode = 404;
    throw error;
  }

  if (!wallet.is_active) {
    const error = new Error("Wallet is inactive.");
    error.statusCode = 403;
    throw error;
  }

  if (wallet.is_frozen) {
    const error = new Error("Wallet is frozen.");
    error.statusCode = 403;
    throw error;
  }

  const balance_before = new Decimal(wallet.balance);
  const amount_to_add = new Decimal(amount);
  const balance_after = balance_before.plus(amount_to_add).toDecimalPlaces(2);

  // Update wallet
  wallet.balance = balance_after.toString(); // Sequelize DECIMAL expects string
  wallet.updated_at = new Date();
  await wallet.save();

  // Create audit trail
  await WalletAuditTrail.create({
    id: uuidv4(),
    wallet_id: wallet.id,
    action: 'credit',
    amount: amount_to_add.toString(),
    balance_before: balance_before.toString(),
    balance_after: balance_after.toString(),
    transaction_id: null,
    performed_by,
    reason: 'Manual top-up or system adjustment',
    created_at: new Date(),
  });

  return {
    message: "Balance added successfully.",
    balance: wallet.balance,
    wallet_id: wallet.id,
    updated_at: wallet.updated_at,
    performed_by,
  };
};



const getAllWallets = async () => {
  return await Wallet.findAll({
    order: [["created_at", "DESC"]],
  });
};




// freezing account


const freezeWalletService = async ({ walletId, reason, performedBy }) => {

  if (!walletId || !reason || !performedBy) {

    throw {

      status: 400,

      message: "walletId, reason, and performedBy are required.",

    };

  }

  const wallet = await Wallet.findOne({ where: { id: walletId } });

  if (!wallet) {

    throw { status: 404, message: "Wallet not found." };

  }

  if (!wallet.is_active) {

    throw { status: 403, message: "Cannot freeze an inactive wallet." };

  }

  if (wallet.is_frozen) {

    throw { status: 409, message: "Wallet is already frozen." };

  }

  wallet.is_frozen = true;
  wallet.frozen_reason = reason;
  wallet.frozen_at = new Date();
  wallet.frozen_by = performedBy;
  wallet.updated_at = new Date();

  await wallet.save();

  return {
    message: "Wallet frozen successfully.",
    wallet_id: wallet.id,
    frozen_at: wallet.frozen_at,
    frozen_by: wallet.frozen_by,
    frozen_reason: wallet.frozen_reason,
  };
};


const getWalletByIdService = async (walletId) => {
  if (!walletId) {
    throw { status: 400, message: "Wallet ID is required." };
  }

  const wallet = await Wallet.findOne({ where: { id: walletId } });

  if (!wallet) {
    throw { status: 404, message: "Wallet not found." };
  }

  return wallet;
};



const unfreezeWalletService = async ({ walletId, performedBy }) => {
  if (!walletId || !performedBy) {
    throw {
      status: 400,
      message: "walletId and performedBy are required.",
    };
  }

  const wallet = await Wallet.findOne({ where: { id: walletId } });

  if (!wallet) {
    throw { status: 404, message: "Wallet not found." };
  }

  if (!wallet.is_active) {
    throw { status: 403, message: "Cannot unfreeze an inactive wallet." };
  }

  if (!wallet.is_frozen) {
    throw { status: 409, message: "Wallet is not currently frozen." };
  }

  wallet.is_frozen = false;
  wallet.frozen_reason = null;
  wallet.frozen_at = null;
  wallet.frozen_by = null;
  wallet.updated_at = new Date();

  await wallet.save();

  return {
    message: "Wallet unfrozen successfully.",
    wallet_id: wallet.id,
    unfrozen_at: wallet.updated_at,
    unfrozen_by: performedBy,
  };
};

module.exports = {
  addBalanceToWallet,
  getAllWallets,
  freezeWalletService,
  getWalletByIdService,
  unfreezeWalletService
};
