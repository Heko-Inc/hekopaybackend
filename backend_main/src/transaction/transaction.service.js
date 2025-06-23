const { Wallet, Transaction } = require("../config/modelsConfig/index");

const { sequelize }= require("../config/database/db")

const { v4:uuidv4 } = require("uuid");

const sendInAppPaymentService = async ({ senderId, recipientId, amount, market_id, currency, description }) => {
  const parsedAmount = parseFloat(amount);
  const t = await sequelize.transaction();
  try {
    const senderWallet = await Wallet.findOne({
      where: { user_id: senderId, currency, market_id, wallet_type: "primary" },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const recipientWallet = await Wallet.findOne({
      where: { user_id: recipientId, currency, market_id, wallet_type: "primary" },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!senderWallet || !recipientWallet) {
      throw new Error("Sender or recipient wallet not found.");
    }

    const totalFee = parsedAmount * 0.01;
    const totalDebit = parsedAmount + totalFee;
    const recipientBnctAddition = parsedAmount * 0.01;
    const amountToRecipient = parsedAmount - recipientBnctAddition;
    const senderBnctSaving = totalFee * 0.7;
    const hekoRevenue = totalFee * 0.3;

    if (parseFloat(senderWallet.balance) < totalDebit) {
      throw new Error("Insufficient balance to cover amount and fee.");
    }

    let senderBnctWallet = await Wallet.findOrCreate({
      where: { user_id: senderId, market_id, currency, wallet_type: "bnct" },
      defaults: { balance: 0 },
      transaction: t,
    }).then(([wallet]) => wallet);

    let recipientBnctWallet = await Wallet.findOrCreate({
      where: { user_id: recipientId, market_id, currency, wallet_type: "bnct" },
      defaults: { balance: 0 },
      transaction: t,
    }).then(([wallet]) => wallet);

    senderWallet.balance -= parseFloat(totalDebit);
    recipientWallet.balance += parseFloat(amountToRecipient);
    senderBnctWallet.balance += parseFloat(senderBnctSaving);
    recipientBnctWallet.balance += parseFloat(recipientBnctAddition);

    console.log({
      senderWalletId: senderWallet.id,
      recipientWalletId: recipientWallet.id,
    });
    

    await senderWallet.save({ transaction: t });
    await recipientWallet.save({ transaction: t });
    await senderBnctWallet.save({ transaction: t });
    await recipientBnctWallet.save({ transaction: t });

    const simulatedPaybillTxnRef = "MPESA-" + uuidv4();

    console.log({
      senderWalletId: senderWallet.id,
      recipientWalletId: recipientWallet.id,
    });
    

    await Transaction.create({
      reference_id: simulatedPaybillTxnRef,
      transaction_type: "send",
      status: "completed",
      total_amount: parsedAmount,
      currency,
      market_id,
      fee_percentage: 1.0,
      fee_amount: totalFee,
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
      reference_id: simulatedPaybillTxnRef,
      amount_sent: parsedAmount.toFixed(2),
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


  
module.exports = { sendInAppPaymentService,getAllTransactionsService,getTransactionByIdService}