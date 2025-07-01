const asyncMiddleware = require("../middlewares/asyncMiddleware");



const walletService = require("../wallet/wallet.service");



const MpesaService = require("./mpesa.service")


const createToken = asyncMiddleware(async (req, res, next) => {
  try {
    const token = await MpesaService.generateMpesaToken();
    console.log('🔑 Token:', token);
    next();
  } catch (err) {
    console.error('❌ Token Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const stkPush = asyncMiddleware(async (req, res) => {
  const { phone, amount, wallet_id } = req.body;

  if (!phone || !amount || !wallet_id) {
    return res.status(400).json({ error: 'phone, amount and wallet_id are required' });
  }

  try {
    const result = await MpesaService.sendStkPush({ phone, amount, wallet_id });
    console.log('📲 STK Push Sent:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('❌ STK Push Error:', error.message);
    res.status(400).json({ error: error.message });
  }
});



const handleMpesaCallback = asyncMiddleware(async (req, res) => {

  console.log('STK Callback response:', JSON.stringify(req.body));

  const callbackData = req.body.Body.stkCallback;

  console.log('🔔 M-PESA Callback Received:', JSON.stringify(callbackData, null, 2));

  const metadata = callbackData.CallbackMetadata?.Item || [];

  if (callbackData.ResultCode !== 0) {

    console.log(`PROCESS CANCELLED BY THE USER`);

    return res.status(404).json({
      success: false,
      message: "The user cancelled the process"
    });

  }

  const phone = metadata.find(i => i.Name === 'PhoneNumber')?.Value;

  const amount = metadata.find(i => i.Name === 'Amount')?.Value;

  const mpesaReceiptNumber = metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value;

  const wallet_id = metadata.find(i => i.Name === 'AccountReference')?.Value;

  if (!wallet_id) {

    console.log('⚠️ Missing wallet ID in callback');

    return res.status(400).json({ message: 'Missing wallet ID' });

  }

  const numericAmount = Number(amount);

  if (isNaN(numericAmount)) {

    console.log('⚠️ Invalid amount:', amount);

    return res.status(400).json({ message: 'Invalid amount in callback' });

  }

  const results = await walletService.addBalanceToWallet({

    wallet_id,

    amount: numericAmount,

    performed_by: `MPESA:${mpesaReceiptNumber}`

  });

  console.log('✅ Account deposited successfully');

  res.status(200).json({

    success: true,

    data: results

  });
  
});



module.exports = {
  createToken,
  stkPush,
  handleMpesaCallback
};
