const { sendInAppPaymentService } = require("./transaction.service");

const asyncMiddleware = require("../middlewares/asyncMiddleware");

const sentInAppPayment = asyncMiddleware(async (req, res, next) => {

  const { senderId, recipientId, amount, market_id, currency, description } = req.body;

  console.log(req.body);

  if (!senderId || !recipientId || !amount || !market_id || !currency) {
    
    return res.status(400).json({ message: "Missing required fields" });

  }

  const result = await sendInAppPaymentService({
    senderId,
    recipientId,
    amount,
    market_id,
    currency,
    description,
  });

  return res.status(200).json({
    message: "Transfer successful",
    ...result,
  });
  
});

module.exports = {
  sentInAppPayment,
};
