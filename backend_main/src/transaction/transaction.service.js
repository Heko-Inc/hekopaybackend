const { Transaction, Wallet, WalletAuditTrail } = require('../config/modelsConfig');
const { sequelize } = require('../config/database/db');
const { Op } = require('sequelize');
const Decimal = require('decimal.js');
const { v4: uuidv4 } = require('uuid');

const sendInAppPayment = async ({
  senderId,
  recipientId,
  amount,
  marketId,
  currency,
  description
}) => {
  const decimalAmount = new Decimal(amount);
  const t = await sequelize.transaction();

  try {
    // Wallet lookups
    const [senderWallet, recipientWallet] = await Promise.all([
      Wallet.findOne({
        where: { userId: senderId, currency, marketId, walletType: "primary" },
        transaction: t,
        lock: t.LOCK.UPDATE
      }),
      Wallet.findOne({
        where: { userId: recipientId, currency, marketId, walletType: "primary" },
        transaction: t,
        lock: t.LOCK.UPDATE
      })
    ]);

    if (!senderWallet || !recipientWallet) {
      throw new Error("Sender or recipient wallet not found");
    }

    // Fee calculations
    const feePercentage = new Decimal(0.01);
    const totalFee = decimalAmount.mul(feePercentage);
    const totalDebit = decimalAmount.plus(totalFee);
    const recipientBnctAddition = decimalAmount.mul(feePercentage);
    const amountToRecipient = decimalAmount.minus(recipientBnctAddition);
    const senderBnctSaving = totalFee.mul(0.7);
    const hekoRevenue = totalFee.mul(0.3);

    // Balance checks
    if (new Decimal(senderWallet.balance).lt(totalDebit)) {
      throw new Error("Insufficient balance");
    }

    // Find or create BNCT wallets
    const [senderBnctWallet, recipientBnctWallet] = await Promise.all([
      Wallet.findOrCreate({
        where: { userId: senderId, currency, marketId, walletType: "bnct" },
        defaults: { balance: "0" },
        transaction: t
      }).then(([wallet]) => wallet),
      Wallet.findOrCreate({
        where: { userId: recipientId, currency, marketId, walletType: "bnct" },
        defaults: { balance: "0" },
        transaction: t
      }).then(([wallet]) => wallet)
    ]);

    // Update balances
    senderWallet.balance = new Decimal(senderWallet.balance).minus(totalDebit).toString();
    recipientWallet.balance = new Decimal(recipientWallet.balance).plus(amountToRecipient).toString();
    senderBnctWallet.balance = new Decimal(senderBnctWallet.balance).plus(senderBnctSaving).toString();
    recipientBnctWallet.balance = new Decimal(recipientBnctWallet.balance).plus(recipientBnctAddition).toString();

    // Save wallets and create audit trails
    await Promise.all([
      senderWallet.save({ transaction: t }),
      recipientWallet.save({ transaction: t }),
      senderBnctWallet.save({ transaction: t }),
      recipientBnctWallet.save({ transaction: t }),
      WalletAuditTrail.bulkCreate([
        {
          walletId: senderWallet.id,
          action: 'debit',
          amount: totalDebit.toString(),
          balanceBefore: new Decimal(senderWallet.balance).plus(totalDebit).toString(),
          balanceAfter: senderWallet.balance,
          performedBy: senderId,
          reason: 'Sent in-app payment'
        },
        {
          walletId: recipientWallet.id,
          action: 'credit',
          amount: amountToRecipient.toString(),
          balanceBefore: new Decimal(recipientWallet.balance).minus(amountToRecipient).toString(),
          balanceAfter: recipientWallet.balance,
          performedBy: senderId,
          reason: 'Received in-app payment'
        },
        {
          walletId: senderBnctWallet.id,
          action: 'credit',
          amount: senderBnctSaving.toString(),
          balanceBefore: new Decimal(senderBnctWallet.balance).minus(senderBnctSaving).toString(),
          balanceAfter: senderBnctWallet.balance,
          performedBy: senderId,
          reason: 'BNCT savings credited'
        },
        {
          walletId: recipientBnctWallet.id,
          action: 'credit',
          amount: recipientBnctAddition.toString(),
          balanceBefore: new Decimal(recipientBnctWallet.balance).minus(recipientBnctAddition).toString(),
          balanceAfter: recipientBnctWallet.balance,
          performedBy: senderId,
          reason: 'BNCT reward credited'
        }
      ], { transaction: t })
    ]);

    // Create transaction record
    const referenceId = `MPESA-${uuidv4()}`;
    await Transaction.create({
      referenceId,
      transactionType: "send",
      status: "completed",
      totalAmount: decimalAmount.toString(),
      currency,
      marketId,
      feePercentage: 1.0,
      feeAmount: totalFee.toString(),
      metadata: {
        senderBnct: senderBnctSaving.toString(),
        recipientBnct: recipientBnctAddition.toString(),
        hekoRevenue: hekoRevenue.toString()
      },
      description: description || "In-app transfer",
      initiatedBy: senderId,
      senderWalletId: senderWallet.id,
      recipientWalletId: recipientWallet.id,
      completedAt: new Date()
    }, { transaction: t });

    await t.commit();

    return {
      referenceId,
      amountSent: decimalAmount.toString(),
      amountReceived: amountToRecipient.toString(),
      feeCharged: totalFee.toString(),
      senderBnct: senderBnctSaving.toString(),
      recipientBnct: recipientBnctAddition.toString(),
      hekoRevenue: hekoRevenue.toString()
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const getAllTransactions = async ({
  senderId,
  recipientId,
  marketId,
  status,
  page = 1,
  limit = 20
}) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (senderId) where.initiatedBy = senderId;
  if (recipientId) where.recipientWalletId = recipientId;
  if (marketId) where.marketId = marketId;
  if (status) where.status = status;

  const { rows, count } = await Transaction.findAndCountAll({
    where,
    include: [
      { 
        model: Wallet, 
        as: 'senderWallet', 
        attributes: ['id', 'userId', 'walletType', 'currency'] 
      },
      { 
        model: Wallet, 
        as: 'recipientWallet', 
        attributes: ['id', 'userId', 'walletType', 'currency'] 
      }
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });

  return { 
    transactions: rows, 
    total: count, 
    page, 
    limit 
  };
};

const getTransactionById = async (id) => {
  const transaction = await Transaction.findOne({
    where: { id },
    include: [
      {
        model: Wallet,
        as: 'senderWallet',
        attributes: ['id', 'userId', 'walletType', 'currency']
      },
      {
        model: Wallet,
        as: 'recipientWallet',
        attributes: ['id', 'userId', 'walletType', 'currency']
      }
    ]
  });
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  return transaction;
};

const getUserTransactions = async ({
  userId,
  page = 1,
  limit = 20,
  marketId,
  status,
  baseUrl
}) => {
  const offset = (page - 1) * limit;
  const where = { [Op.or]: [{ initiatedBy: userId }] };

  if (marketId) where.marketId = marketId;
  if (status) where.status = status;

  const { rows, count } = await Transaction.findAndCountAll({
    where,
    include: [
      { 
        model: Wallet, 
        as: 'senderWallet', 
        attributes: ['id', 'userId'], 
        required: false 
      },
      { 
        model: Wallet, 
        as: 'recipientWallet', 
        attributes: ['id', 'userId'], 
        required: false 
      }
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
    distinct: true
  });

  const filtered = rows.filter(txn =>
    txn.senderWallet?.userId === userId ||
    txn.recipientWallet?.userId === userId ||
    txn.initiatedBy === userId
  );

  const totalPages = Math.ceil(count / limit);
  const buildUrl = pageNum => {
    const params = new URLSearchParams({ 
      userId, 
      page: pageNum, 
      limit 
    });
    
    if (marketId) params.set('marketId', marketId);
    if (status) params.set('status', status);
    
    return `${baseUrl}?${params.toString()}`;
  };

  return {
    transactions: filtered,
    total: count,
    page,
    limit,
    totalPages,
    next: page < totalPages ? buildUrl(page + 1) : null,
    prev: page > 1 ? buildUrl(page - 1) : null
  };
};

module.exports = {
  sendInAppPayment,
  getAllTransactions,
  getTransactionById,
  getUserTransactions
};