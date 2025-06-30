const { Wallet, Transaction, WalletAuditTrail } = require("../config/modelsConfig/index");

const { sequelize }= require("../config/database/db")

const { v4:uuidv4 } = require("uuid");

const { Op } = require("sequelize");

const Decimal  = require("decimal.js")


const sendInAppPaymentService = async ({ senderId, recipientId, amount, market_id, currency, description }) => {

  const decimalAmount = new Decimal(amount);
  
  const t = await sequelize.transaction();

  try {
    
    const senderWallet = await Wallet.findOne({
      where: {
        user_id: senderId,
        currency,
        market_id,
        wallet_type: "primary",
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const recipientWallet = await Wallet.findOne({
      where: {
        user_id: recipientId,
        currency,
        market_id,
        wallet_type: "primary",
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!senderWallet || !recipientWallet) {
      throw new Error("Sender or recipient wallet not found.");
    }

    const feePercentage = new Decimal(0.01);
    const totalFee = decimalAmount.mul(feePercentage);
    const totalDebit = decimalAmount.plus(totalFee);
    const recipientBnctAddition = decimalAmount.mul(feePercentage);
    const amountToRecipient = decimalAmount.minus(recipientBnctAddition);
    const senderBnctSaving = totalFee.mul(0.7);
    const hekoRevenue = totalFee.mul(0.3);


    if (new Decimal(senderWallet.balance).lt(totalDebit)) {
      throw new Error("Insufficient balance to cover amount and fee.");
    }

    const senderBnctWallet = await Wallet.findOrCreate({
      where: {
        user_id: senderId,
        currency,
        market_id,
        wallet_type: "bnct",
      },
      defaults: {
        balance: "0",
      },
      transaction: t,
    }).then(([wallet]) => wallet);


    const recipientBnctWallet = await Wallet.findOrCreate({
      where: {
        user_id: recipientId,
        currency,
        market_id,
        wallet_type: "bnct",
      },
      defaults: {
        balance: "0",
      },
      transaction: t,
    }).then(([wallet]) => wallet);


    senderWallet.balance = new Decimal(senderWallet.balance).minus(totalDebit).toString();
    recipientWallet.balance = new Decimal(recipientWallet.balance).plus(amountToRecipient).toString();
    senderBnctWallet.balance = new Decimal(senderBnctWallet.balance).plus(senderBnctSaving).toString();
    recipientBnctWallet.balance = new Decimal(recipientBnctWallet.balance).plus(recipientBnctAddition).toString();


    await senderWallet.save({ transaction: t });
    await WalletAuditTrail.create({
      id: uuidv4(),
      wallet_id: senderWallet.id,
      action: 'debit',
      amount: totalDebit.toFixed(2),
      balance_before: (new Decimal(senderWallet.balance)).plus(totalDebit).toFixed(2),
      balance_after: senderWallet.balance,
      transaction_id: null, 
      performed_by: senderId,
      reason: 'Sent in-app payment',
      created_at: new Date(),
      updated_at: new Date(),
    }, { transaction: t });
    
    await recipientWallet.save({ transaction: t });

    await WalletAuditTrail.create({
      id: uuidv4(),
      wallet_id: recipientWallet.id,
      action: 'credit',
      amount: amountToRecipient.toFixed(2),
      balance_before: (new Decimal(recipientWallet.balance)).minus(amountToRecipient).toFixed(2),
      balance_after: recipientWallet.balance,
      transaction_id: null,
      performed_by: senderId,
      reason: 'Received in-app payment',
      created_at: new Date(),
      updated_at: new Date(),
    }, { transaction: t });

    
    await senderBnctWallet.save({ transaction: t });

    await WalletAuditTrail.create({
      id: uuidv4(),
      wallet_id: senderBnctWallet.id,
      action: 'credit',
      amount: senderBnctSaving.toFixed(2),
      balance_before: (new Decimal(senderBnctWallet.balance)).minus(senderBnctSaving).toFixed(2),
      balance_after: senderBnctWallet.balance,
      transaction_id: null,
      performed_by: senderId,
      reason: 'BNCT savings credited to sender',
      created_at: new Date(),
      updated_at: new Date(),
    }, { transaction: t });

    
    await recipientBnctWallet.save({ transaction: t });

    await WalletAuditTrail.create({
      id: uuidv4(),
      wallet_id: recipientBnctWallet.id,
      action: 'credit',
      amount: recipientBnctAddition.toFixed(2),
      balance_before: (new Decimal(recipientBnctWallet.balance)).minus(recipientBnctAddition).toFixed(2),
      balance_after: recipientBnctWallet.balance,
      transaction_id: null,
      performed_by: senderId,
      reason: 'BNCT reward credited to recipient',
      created_at: new Date(),
      updated_at: new Date(),
    }, { transaction: t });
    

    const reference_id = "MPESA-" + uuidv4();
    await Transaction.create({
      reference_id,
      transaction_type: "send",
      status: "completed",
      total_amount: decimalAmount.toString(),
      currency,
      market_id,
      fee_percentage: 1.0,
      fee_amount: totalFee.toString(),
      metadata: {
        sender_bnct: senderBnctSaving.toFixed(2),
        recipient_bnct: recipientBnctAddition.toFixed(2),
        hekopay_revenue: hekoRevenue.toFixed(2),
        sender_id: senderId,
        recipient_id: recipientId,
      },
      description: description || "In-app transfer with BNCT savings",
      initiated_by: senderId,
      sender_wallet_id: senderWallet.id,
      recipient_wallet_id: recipientWallet.id,
      created_at: new Date(),
      completed_at: new Date(),
    }, { transaction: t });

    await t.commit();

    return {
      reference_id,
      amount_sent: decimalAmount.toFixed(2),
      amount_received: amountToRecipient.toFixed(2),
      fee_charged: totalFee.toFixed(2),
      sender_bnct: senderBnctSaving.toFixed(2),
      recipient_bnct: recipientBnctAddition.toFixed(2),
      hekopay_revenue: hekoRevenue.toFixed(2),
    };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};




const getAllTransactionsService = async ({
  senderId,
  recipientId,
  market_id,
  status,
  page = 1,
  limit = 20,
}) => {
  const offset = (page - 1) * limit;

  const where = {};

  if (senderId) {
    where.initiated_by = senderId;
  }

  if (recipientId) {
    where.recipient_wallet_id = recipientId;
  }

  if (market_id) {
    where.market_id = market_id;
  }

  if (status) {
    where.status = status;
  }

  const { rows: transactions, count: total } = await Transaction.findAndCountAll({
    where,
    include: [
      {
        model: Wallet,
        as: "senderWallet",
        attributes: ["id", "user_id", "wallet_type", "currency"],
      },
      {
        model: Wallet,
        as: "recipientWallet",
        attributes: ["id", "user_id", "wallet_type", "currency"],
      },
    ],
    order: [["created_at", "DESC"]],
    limit,
    offset,
  });

  return {
    transactions,
    total,
    page,
    limit,
  };
};


const getTransactionByIdService = async (transactionId) =>{

  const transaction = await Transaction.findOne({

    where:{id:transactionId},

    include:[
      {
        model:Wallet,
        as:"senderWallet",
        attributes: ["id", "user_id", "wallet_type", "currency"],
      },{
        model:Wallet,
        as:"recipientWallet",
        attributes:["id","user_id","wallet_type","currency"],
      }
    ]
  })
  if(!transaction){
    throw new Error("Transaction not found");
  }
  return  transaction;
}


const getUserTransactionsService = async ({
  userId,
  page = 1,
  limit = 20,
  market_id,
  status,
  baseUrl,
}) => {
  const offset = (page - 1) * limit;

  const where = {
    [Op.or]: [{ initiated_by: userId }],
  };

  if (market_id) {
    where.market_id = market_id;
  }

  if (status) {
    where.status = status;
  }

  const { rows: transactions, count: total } = await Transaction.findAndCountAll({
    where,
    include: [
      {
        model: Wallet,
        as: "senderWallet",
        attributes: ["id", "user_id", "wallet_type", "currency"],
        required: false,
      },
      {
        model: Wallet,
        as: "recipientWallet",
        attributes: ["id", "user_id", "wallet_type", "currency"],
        required: false,
      },
    ],
    order: [["created_at", "DESC"]],
    limit,
    offset,
    distinct: true,
  });

  const filtered = transactions.filter((txn) => {
    const senderMatch = txn.senderWallet?.user_id === userId;
    const recipientMatch = txn.recipientWallet?.user_id === userId;
    const initiatedMatch = txn.initiated_by === userId;
    return senderMatch || recipientMatch || initiatedMatch;
  });

  const totalPages = Math.ceil(total / limit);

  const buildUrl = (pageNum) => {
    const params = new URLSearchParams({
      userId,
      page: pageNum,
      limit,
      ...(market_id && { market_id }),
      ...(status && { status }),
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return {
    success: true,
    message: "User transactions retrieved successfully",
    data: {
      transactions: filtered,
      total,
      page,
      limit,
      totalPages,
      next: page < totalPages ? buildUrl(page + 1) : null,
      prev: page > 1 ? buildUrl(page - 1) : null,
    },
  };
};




module.exports = { sendInAppPaymentService,getAllTransactionsService,getTransactionByIdService,getUserTransactionsService}