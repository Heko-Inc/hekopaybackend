const MpesaService = require("./mpesa.service");

exports.generateToken = async (req, res, next) => {
  req.mpesaToken = await MpesaService.generateMpesaToken();
  next();
};

exports.stkPush = async (req, res) => {
  const result = await MpesaService.sendStkPush(req.body);
  res.sendResponse(result, "STK push initiated successfully");
};

exports.handleMpesaCallback = async (req, res) => {
  const callbackData = req.body.Body.stkCallback;
  const metadata = callbackData.CallbackMetadata?.Item || [];

  const getMetadataValue = (name) => metadata.find(i => i.Name === name)?.Value;
  const result = await MpesaService.processMpesaCallback({
    phone: getMetadataValue('PhoneNumber'),
    amount: getMetadataValue('Amount'),
    receiptNumber: getMetadataValue('MpesaReceiptNumber'),
    walletId: getMetadataValue('AccountReference')
  });

  res.sendResponse(result, "Payment processed successfully");
};