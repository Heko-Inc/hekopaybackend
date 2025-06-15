const axios = require('axios')

require('dotenv').config()

const asyncMiddleware = require('../middlewares/asyncMiddleware')

var token = ''

const createToken = async (req, res, next) => {
  
  const Authorization = `Basic ${new Buffer.from(
    `${process.env.SAFARICOM_CONSUMER_KEY}:${process.env.SAFARICOM_CONSUMER_SECRET}`
  ).toString('base64')}`

  await axios
    .get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization
        }
      }
    )
    .then(data => {
      token = data.data.access_token

      console.log(data.data)

      next()
    })
    .catch(err => {
      console.log(err)

      res.status(500).json(err.message)
    })
}

const stkPush = async (req, res) => {
  try {
    const shortCode = 174379
    const phone = req.body.phone.substring(1)
    const amount = req.body.amount
    const passKey = process.env.SAFARICOM_STK_PUSH_PASS_KEY
    const url = process.env.LIPA_NA_MPESA_URL
    const date = new Date()
    const timestamp =
      date.getFullYear() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2) +
      ('0' + date.getHours()).slice(-2) +
      ('0' + date.getMinutes()).slice(-2) +
      ('0' + date.getSeconds()).slice(-2)
    const password = Buffer.from(shortCode + passKey + timestamp).toString(
      'base64'
    )

    const data = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: `254${phone}`,
      PartyB: 174379,
      PhoneNumber: `254${phone}`,
      CallBackURL: 'https://6a43-41-90-187-124.ngrok-free.app/api/v1/stk/push/callback',
      AccountReference: 'Mpesa Test',
      TransactionDesc: 'Testing stk push'
    }

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    console.log(response.data)
    res.status(200).json(response.data)
  } catch (error) {
    console.error(error)
    res.status(400).json(error.message)
  }
}


const handleMpesaCallback = asyncMiddleware(async (req, res, next) => {
  try {
    const callbackData = req.body;

    console.log('🔔 M-PESA Callback Received:', JSON.stringify(callbackData, null, 2));

    const {
      Body: {
        stkCallback: {
          MerchantRequestID,
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          CallbackMetadata
        }
      }
    } = callbackData;

    const phone = CallbackMetadata?.Item?.find(i => i.Name === 'PhoneNumber')?.Value;

    const amount = CallbackMetadata?.Item?.find(i => i.Name === 'Amount')?.Value;

    const mpesaReceiptNumber = CallbackMetadata?.Item?.find(i => i.Name === 'MpesaReceiptNumber')?.Value;

    console.log('✅ Payment Info:');

    console.log('MerchantRequestID:', MerchantRequestID);

    console.log('CheckoutRequestID:', CheckoutRequestID);

    console.log('ResultCode:', ResultCode);

    console.log('ResultDesc:', ResultDesc);

    console.log('Amount:', amount);

    console.log('MpesaReceiptNumber:', mpesaReceiptNumber);

    console.log('PhoneNumber:', phone);

    res.status(200).json({

      message: 'M-PESA callback received successfully'

    });
  } catch (error) {
    console.error('❌ Error handling M-PESA callback:', error);
    next(error); 
  }
});


module.exports = {createToken, stkPush, handleMpesaCallback}