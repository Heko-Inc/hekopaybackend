const CurrencyService = require('./currency.service');

exports.createCurrency = async (req, res) => {
  const result = await CurrencyService.createCurrency(req.body);
  res.sendResponse(result, 'Currency created successfully', 201);
};

exports.getAllCurrencies = async (req, res) => {
  const { activeOnly } = req.query;
  const result = await CurrencyService.getAllCurrencies(activeOnly === 'true');
  res.sendResponse(result);
};

exports.getCurrencyByCode = async (req, res) => {
  const result = await CurrencyService.getCurrencyByCode(req.params.code);
  res.sendResponse(result);
};

exports.updateCurrency = async (req, res) => {
  const result = await CurrencyService.updateCurrency(
    req.params.code,
    req.body
  );
  res.sendResponse(result, 'Currency updated successfully');
};

exports.deleteCurrency = async (req, res) => {
  await CurrencyService.deleteCurrency(req.params.code);
  res.sendResponse(null, 'Currency deactivated successfully');
};

exports.activateCurrency = async (req, res) => {
  const result = await CurrencyService.updateCurrency(req.params.code, { isActive: true });
  res.sendResponse(result, 'Currency activated successfully');
};
exports.bulkCreateCurrencies = async (req, res) => {
  const result = await CurrencyService.bulkCreateCurrencies(req.body);
  res.sendResponse(result, `${result.length} currencies created successfully`, 201);
};