const TransactionService = require("./transaction.service");

const asyncMiddleware = require("../middlewares/asyncMiddleware");

const sentInAppPayment = asyncMiddleware(async (req, res, next) => {

  const { senderId, recipientId, amount, market_id, currency, description } = req.body;

  console.log(req.body);

  if (!senderId || !recipientId || !amount || !market_id || !currency) {
    
    return res.status(400).json({ message: "Missing required fields" });

  }

  const result = await TransactionService.sendInAppPaymentService({
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


const getAllTransactions = async (req, res, next) => {
  try {
    const {
      senderId,
      recipientId,
      market_id,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    const result = await TransactionService.getAllTransactionsService({
      senderId,
      recipientId,
      market_id,
      status,
      page: parsedPage,
      limit: parsedLimit,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;

    const queryWithoutPage = { ...req.query };
    
    delete queryWithoutPage.page;

    const queryString = new URLSearchParams(queryWithoutPage).toString();

    const nextPageUrl =
      parsedPage * parsedLimit < result.total
        ? `${baseUrl}?${queryString}&page=${parsedPage + 1}&limit=${parsedLimit}`
        : null;

    const prevPageUrl =
      parsedPage > 1
        ? `${baseUrl}?${queryString}&page=${parsedPage - 1}&limit=${parsedLimit}`
        : null;

    res.status(200).json({
      transactions: result.transactions,
      total: result.total,
      page: parsedPage,
      limit: parsedLimit,
      nextPageUrl,
      prevPageUrl,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transaction = await TransactionService.getTransactionByIdService(id);

    res.status(200).json({
      success: true,
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error) {
    next(error); 
  }
};


module.exports = {
  sentInAppPayment,getAllTransactions,getTransactionById
};
