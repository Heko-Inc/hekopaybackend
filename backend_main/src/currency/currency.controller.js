const CurrencyService = require("./currency.service");

exports.createCurrency = async (req, res, next) => {
  try {
    const { code, name } = req.body;
    const currency = await CurrencyService.registerCurrency({ code, name });
    res.status(201).json({ message: "Currency registered successfully", currency });
  } catch (error) {
    next(error);
  }
};

exports.getAllCurrencies = async (req, res, next) => {
  try {
    const onlyActive = req.query.onlyActive === "true";
    const currencies = await CurrencyService.getAllCurrencies({ onlyActive });
    res.status(200).json({ currencies });
  } catch (error) {
    next(error);
  }
};

exports.getCurrencyByCode = async (req, res, next) => {
  try {
    const currency = await CurrencyService.getCurrencyByCode(req.params.code);
    res.status(200).json({ currency });
  } catch (error) {
    next(error);
  }
};

exports.updateCurrency = async (req, res, next) => {
  try {
    const updated = await CurrencyService.updateCurrency(req.params.code, req.body);
    res.status(200).json({ message: "Currency updated successfully", updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteCurrency = async (req, res, next) => {
  try {
    await CurrencyService.deleteCurrency(req.params.code);
    res.status(200).json({ message: "Currency deactivated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.activateCurrency = async (req, res, next) => {
  try {
    const updated = await CurrencyService.updateCurrency(req.params.code, { isActive: true });
    res.status(200).json({ message: "Currency activated successfully", updated });
  } catch (error) {
    next(error);
  }
};

exports.bulkCreateCurrencies = async (req, res, next) => {
  try {
    const currencies = await CurrencyService.bulkCreateCurrencies(req.body);
    res.status(201).json({ message: `${currencies.length} currencies created successfully`, currencies });
  } catch (error) {
    next(error);
  }
};
