const axios = require('axios');
require('dotenv').config();

// let token = '';

const generateMpesaToken = async () => {
  const credentials = `${process.env.SAFARICOM_CONSUMER_KEY}:${process.env.SAFARICOM_CONSUMER_SECRET}`;
  const encoded = Buffer.from(credentials).toString('base64');

  const response = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${encoded}`
      }
    }
  );

  return response.data.access_token;

};

const sendStkPush = async ({ phone, amount, wallet_id }) => {

  const token = await generateMpesaToken();

  const shortCode = process.env.DARAJA_SHORT_CODE;

  const passKey = process.env.SAFARICOM_STK_PUSH_PASS_KEY;

  const url = process.env.LIPA_NA_MPESA_URL;

  const date = new Date();
  
  const timestamp =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0') +
    String(date.getHours()).padStart(2, '0') +
    String(date.getMinutes()).padStart(2, '0') +
    String(date.getSeconds()).padStart(2, '0');

  const password = Buffer.from(shortCode + passKey + timestamp).toString('base64');

  const payload = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: `254${phone.substring(1)}`,
    PartyB: shortCode,
    PhoneNumber: `254${phone.substring(1)}`,
    CallBackURL: `${process.env.CallBackURL}/api/v1/stk/push/callback`,
    AccountReference: wallet_id,
    TransactionDesc: 'Wallet deposit'
  };

  const response = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

module.exports = {
  generateMpesaToken,
  sendStkPush
};




