const axios = require("axios");

require("dotenv").config();



/**
 * Generate M-PESA access token
 */
const generateMpesaToken = async () => {
  try {
    const consumerKey =
      process.env.ENV !== "production"
        ? process.env.SAFARICOM_CONSUMER_KEY_TEST
        : process.env.SAFARICOM_CONSUMER_KEY_LIVE;

    const consumerSecret =
      process.env.ENV !== "production"
        ? process.env.SAFARICOM_CONSUMER_SECRET_TEST
        : process.env.SAFARICOM_CONSUMER_SECRET_LIVE;

    const credentials = `${consumerKey}:${consumerSecret}`;
    const encoded = Buffer.from(credentials).toString("base64");

    const tokenUrl =
      process.env.ENV !== "production"
        ? process.env.STK_TOKEN_URL_TEST
        : process.env.STK_TOKEN_URL_PROD;

    const response = await axios.get(tokenUrl, {
      headers: {
        Authorization: `Basic ${encoded}`,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("❌ Error generating MPESA token:", error.response?.data || error.message);
    throw error;
  }
};



/**
 * Send STK Push request
 */
const sendStkPush = async ({ phone, amount, wallet_id }) => {
  try {
    const token = await generateMpesaToken();

    const shortCode =
      process.env.ENV !== "production"
        ? process.env.DARAJA_SHORT_CODE_TEST
        : process.env.DARAJA_SHORT_CODE_LIVE;

    const passKey =
      process.env.ENV !== "production"
        ? process.env.SAFARICOM_STK_PUSH_PASS_KEY
        : process.env.SAFARICOM_STK_PUSH_PASS_KEY_LIVE;

    const mpesaUrl =
      process.env.ENV !== "production"
        ? process.env.LIPA_NA_MPESA_URL_TEST
        : process.env.LIPA_NA_MPESA_URL_PRODUCTION;

    const now = new Date();
    const timestamp =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    const password = Buffer.from(shortCode + passKey + timestamp).toString("base64");

    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: `254${phone.substring(1)}`,
      PartyB: shortCode,
      PhoneNumber: `254${phone.substring(1)}`,
      CallBackURL: `${process.env.CallBackURL}/api/v1/stk/push/callback`,
      AccountReference: wallet_id,
      TransactionDesc: "Wallet deposit",
    };

    const response = await axios.post(mpesaUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error sending STK Push:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  generateMpesaToken,
  sendStkPush,
};
