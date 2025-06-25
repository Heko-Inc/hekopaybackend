<<<<<<< HEAD
const { Currency } = require('../config/modelsConfig');
const AppError = require('../utils/AppError');

exports.createCurrency = async (data) => {
  const existingCurrency = await Currency.findByPk(data.code);
  if (existingCurrency) {
    throw new AppError('Currency with this code already exists', 400);
  }
  return await Currency.create(data);
};

exports.getAllCurrencies = async (activeOnly = false) => {
  const where = {};
  if (activeOnly) where.isActive = true;
  
  return await Currency.findAll({
    where,
    order: [['code', 'ASC']]
  });
};

exports.getCurrencyByCode = async (code) => {
  const currency = await Currency.findByPk(code);
  if (!currency) {
    throw new AppError('Currency not found', 404);
  }
  return currency;
};

exports.updateCurrency = async (code, data) => {
  const currency = await Currency.findByPk(code);
  if (!currency) {
    throw new AppError('Currency not found', 404);
  }
  
  await currency.update(data);
  return currency;
};

exports.deleteCurrency = async (code) => {
  const currency = await Currency.findByPk(code);
  if (!currency) {
    throw new AppError('Currency not found', 404);
  }
  
  await currency.update({ isActive: false });
};
exports.bulkCreateCurrencies = async (currencies) => {
  // Check for duplicate codes in the request
  const codes = currencies.map(c => c.code);
  if (new Set(codes).size !== codes.length) {
    throw new AppError('Duplicate currency codes in request', 400);
  }

  // Check which currencies already exist
  const existingCurrencies = await Currency.findAll({
    where: { code: codes }
  });

  if (existingCurrencies.length > 0) {
    const existingCodes = existingCurrencies.map(c => c.code);
    throw new AppError(
      `These currencies already exist: ${existingCodes.join(', ')}`,
      400
    );
  }

  // Create all currencies in a single transaction
  return await Currency.sequelize.transaction(async (t) => {
    return await Currency.bulkCreate(currencies, { transaction: t });
  });
};
=======
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

>>>>>>> dennis
