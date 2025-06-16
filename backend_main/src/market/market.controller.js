const MarketService = require("./market.service");

const registerMarket = async (req, res, next) => {
  const newMarket = await MarketService.createMarket(req.body);
  return res.sendResponse(newMarket, "Market registered successfully.")

};
const getAllMarkets = async (req, res, next) => {
  const markets = await MarketService.getAllMarketsService();
  return res.sendResponse(markets, "Markets retrieved successfully.")
};

module.exports = { registerMarket, getAllMarkets };
