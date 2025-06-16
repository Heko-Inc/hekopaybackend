const logger = require("../utils/logger");
const UserController = require("./user.service");

const registerMerchant = async (req, res) => {
  const user = await UserController.registerMerchantService(req.body);
  logger.info(`Merchant registered: ${user.email}`);
  res.sendResponse(user, "Merchant registered successfully.", 201);
};

const loginMerchant = async (req, res) => {
  const { user, token } = await UserController.loginMerchantService(req.body);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  logger.info(`Merchant logged in: ${user.email}`);
  res.sendResponse({ user, token }, "Login successful");
};

const getSingleMerchant = async (req, res) => {
  const user = await UserController.getSingleMerchantService(req.params.id);
  res.sendResponse(user, "Merchant retrieved successfully");
};

const getMerchants = async (req, res) => {
  const result = await UserController.getMerchantsService(req.query);
  const { count, rows, page, limit } = result;

  const totalPages = Math.ceil(count / limit);
  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
  const queryParams = new URLSearchParams({ ...req.query, limit });

  const nextPageUrl = page < totalPages ? `${baseUrl}?${queryParams.toString()}&page=${page + 1}` : null;
  const previousPageUrl = page > 1 ? `${baseUrl}?${queryParams.toString()}&page=${page - 1}` : null;

  res.sendResponse({
    pagination: {
      total: count,
      page,
      limit,
      totalPages,
      nextPageUrl,
      previousPageUrl,
    },
    data: rows,
  }, "Merchants retrieved successfully");
};

module.exports = {
  registerMerchant,
  loginMerchant,
  getSingleMerchant,
  getMerchants,
};