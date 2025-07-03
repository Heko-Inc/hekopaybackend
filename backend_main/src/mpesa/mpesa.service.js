const axios = require("axios");
const { Wallet } = require("../config/modelsConfig");
const Decimal = require('decimal.js');

const generateMpesaToken = async () => {
  const credentials = `${process.env.SAFARICOM_CONSUMER_KEY}:${process.env.SAFARICOM_CONSUMER_SECRET}`;
  const response = await axios.get(process.env.STK_TOKEN_URL, {
    headers: {
      Authorization: `Basic ${Buffer.from(credentials).toString('base64')}`
    }
  });
  return response.data.access_token;
};

const sendStkPush = async ({ phone, amount, wallet_id }) => {
  const token = await generateMpesaToken();
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const password = Buffer.from(
    `${process.env.DARAJA_SHORT_CODE}${process.env.SAFARICOM_STK_PUSH_PASS_KEY}${timestamp}`
  ).toString('base64');

  const payload = {
    BusinessShortCode: process.env.DARAJA_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: `254${phone.substring(phone.length - 9)}`, // Ensure Kenyan format
    PartyB: process.env.DARAJA_SHORT_CODE,
    PhoneNumber: `254${phone.substring(phone.length - 9)}`,
    CallBackURL: `${process.env.API_BASE_URL}/mpesa/callback`,
    AccountReference: wallet_id,
    TransactionDesc: "Wallet deposit"
  };

  const response = await axios.post(process.env.LIPA_NA_MPESA_URL, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return {
    responseCode: response.data.ResponseCode,
    checkoutRequestID: response.data.CheckoutRequestID,
    merchantRequestID: response.data.MerchantRequestID
  };
};

const processMpesaCallback = async ({ phone, amount, receiptNumber, walletId }) => {
  if (!walletId) throw new Error('Missing wallet reference');
  
  const numericAmount = new Decimal(amount);
  if (numericAmount.isNaN() || numericAmount.lte(0)) {
    throw new Error('Invalid amount received');
  }

  const wallet = await Wallet.findOne({ where: { id: walletId } });
  if (!wallet) throw new Error('Wallet not found');

  wallet.balance = new Decimal(wallet.balance).plus(numericAmount).toString();
  await wallet.save();

  return {
    receiptNumber,
    amount: numericAmount.toString(),
    walletId,
    newBalance: wallet.balance,
    phone
  };
};

module.exports = {
  generateMpesaToken,
  sendStkPush,
  processMpesaCallback
};