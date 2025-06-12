const { Wallet } = require("../config/modelsConfig/index");

const asyncMiddleware = require("../middlewares/asyncMiddleware");

const { addBalanceToWallet } = require("./wallet.service")

const logger = require("../utils/logger");


const { v4: uuidv4 } = require("uuid");

const registerWallet = asyncMiddleware(async (req, res) => {

  const {
    user_id,
    market_id,
    wallet_type,
    currency,
    creation_source
  } = req.body;


  if (!user_id || !market_id || !wallet_type || !currency || !creation_source) {

    logger.warn("Wallet registration failed: Missing required fields");

    return res.sendError("All fields are required.", 400);
  }

  
  const existingWallet = await Wallet.findOne({
    where: {
      user_id,
      market_id,
      currency,
    },
  });

  if (existingWallet) {
    logger.warn(`Wallet already exists for user: ${user_id}, market: ${market_id}, currency: ${currency}`);
    return res.sendError("Wallet already exists for this user in this market and currency.", 409);
  }

  const wallet = await Wallet.create({
    id: uuidv4(),
    user_id,
    market_id,
    wallet_type,
    currency,
    creation_source,
    created_at: new Date(),
    updated_at: new Date(),
  });

  logger.info(`Wallet registered successfully for user: ${user_id}`);

  return res.status(201).json({
    success: true,
    message: "Wallet registered successfully.",
    wallet,
  });
});




const addWalletBalance = asyncMiddleware(async (req, res, next) => {

  const { wallet_id, amount } = req.body;

  const performed_by = req.user?.id || "SYSTEM";

  try {
    const result = await addBalanceToWallet({ wallet_id, amount, performed_by });

    logger.info(`Wallet ${wallet_id} balance increased by ${amount} by ${performed_by}`);

    return res.status(200).json({

      success: true,

      message: result.message,

      data: result,

    });
  } catch (error) {

    logger.error(`Add balance failed: ${error.message}`);

    return next(error);
  }

});


// const fetchAllWallets = asyncWrapper(async (req, res, next) => {

//   try{

//     const wallets = await getAllWallets();

//     res.status(200).json({

//       success: true,
   
//       message: 'Wallets fetched successfully.',

//       wallets,

//     });

//   }catch(error) {

//     logger.error(`Fetch all wallets failed: ${error.message}`);

//     return next(error);

//   }
  
// });

module.exports = { registerWallet, addWalletBalance };
