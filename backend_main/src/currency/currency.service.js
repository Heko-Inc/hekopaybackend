const { Currency } = require("../config/modelsConfig/index")

const registerCurrency = async ({ code, name }) => {

    const existing = await Currency.findOne({ where: { code } });
    if (existing) {
      const error = new Error(`Currency with code "${code}" already exists.`);
      error.status = 400;
      throw error;
    }
  
   
    const currency = await Currency.create({ code, name });
    return currency;
  };


  const getAllCurrencies = async ({ onlyActive = false } = {}) => {
    const where = onlyActive ? { is_active: true } : {};
  
    const currencies = await Currency.findAll({
      where,
      order: [["code", "ASC"]],
    });
  
    return currencies;
};


  
  module.exports = {
    registerCurrency,
    getAllCurrencies
  };

