const { Market } = require("../config/modelsConfig/index");

const asyncMiddleware = require("../middlewares/asyncMiddleware");

const { getAllMarketsService } = require("./market.service");

const registerMarket = asyncMiddleware(async (req, res, next) => {
  const { country_code, country_name, primary_currency, timezone } = req.body;

  if (!country_code || !country_name || !primary_currency || !timezone) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingMarket = await Market.findOne({ where: { country_code } });

  if (existingMarket) {
    return res
      .status(409)
      .json({ message: "Market already exists for this country code." });
  }
  const newMarket = await Market.create({
    country_code,
    country_name,
    primary_currency,
    timezone,
  });

  return res.status(201).json({
    message: "Market registered successfully.",
    market: newMarket,
  });
});

const getAllMarkets = asyncMiddleware(async (req, res, next) => {
  try {
    const markets = await getAllMarketsService();
    return res.status(200).json({
      message: "Markets retrieved successfully.",
      markets,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { registerMarket,getAllMarkets };
