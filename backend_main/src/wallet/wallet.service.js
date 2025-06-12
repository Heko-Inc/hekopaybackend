const { Wallet } = require("../config/modelsConfig/index")

const addBalanceToWallet = async ({ wallet_id, amount, performed_by }) => {

    console.log(wallet_id,amount,performed_by)

    if (!wallet_id || !amount || isNaN(amount)) {

      const error = new Error("wallet_id and valid amount are required.");

      error.statusCode = 400;


      throw error;
    }
  
    
    const wallet = await Wallet.findOne({ where: { id: wallet_id } });
  
    if (!wallet) {

      const error = new Error("Wallet not found.");

      error.statusCode = 404;

      throw error;
    }
  
    if (!wallet.is_active || wallet.is_frozen) {

      const error = new Error("Cannot add balance to inactive or frozen wallet.");

      error.statusCode = 403;

      throw error;
    }
  
    wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);

    wallet.updated_at = new Date();
  
    await wallet.save();
  
    return {

      message: "Balance added successfully.",

      balance: wallet.balance,

      wallet_id: wallet.id,

      updated_at: wallet.updated_at,

      performed_by,
    };
  };
  

  const getAllWallets = async () => {

    const wallets = await Wallet.findAll({

      order: [['created_at', 'DESC']],

    });

    return wallets;
  };


  module.exports = {
    addBalanceToWallet,
    getAllWallets
  };