const { v4: uuidv4 } = require("uuid");


const bcrypt = require("bcryptjs");



const logger = require("../utils/logger");



const asyncMiddleware = require("../middlewares/asyncMiddleware");



const { User } = require("../config/modelsConfig/index");



const { Op } = require("sequelize");



require("dotenv").config();


const URL = process.env.BACKEND_URL;

const registerMerchant = asyncMiddleware(async (req, res, next) => {
  const {
    name,
    email,
    password,
    business_name,
    business_type,
    market_id,
    default_currency,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !business_name ||
    !business_type ||
    !market_id ||
    !default_currency
  ) {
    logger.warn("Registration failed: Missing required fields");
    return res.sendError("All fields are required.", 400);
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    logger.warn(`Registration failed: Email already in use - ${email}`);
    return res.sendError("Email is already registered.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    business_name,
    business_type,
    market_id,
    default_currency,
    created_at: new Date(),
    updated_at: new Date(),
  });

  logger.info(`Merchant registered successfully: ${email}`);

  const sanitizedUser = { ...user.toJSON() };

  delete sanitizedUser.password;

  return res
    .status(201)
    .json({
      success: true,
      message: "Merchant registered successfully.",
      user: sanitizedUser,
    });
});


const getMerchants = asyncMiddleware(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    market_id,
    business_type,
  } = req.query;

  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
  const offset = (page - 1) * limit;

  const whereClause = {
    ...(market_id && { market_id }),
    ...(business_type && { business_type }),
    ...(search && {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ],
    }),
  };

  const { count, rows } = await User.findAndCountAll({
    where: whereClause,
    offset: parseInt(offset),
    limit: parseInt(limit),
    attributes: {
      exclude: ["password"],
    },
    order: [["created_at", "DESC"]],
  });

  const totalPages = Math.ceil(count / limit);
  const currentPage = parseInt(page);
  const queryParams = new URLSearchParams({
    ...(search && { search }),
    ...(market_id && { market_id }),
    ...(business_type && { business_type }),
    limit,
  });

  const nextPageUrl =
    currentPage < totalPages
      ? `${baseUrl}?${queryParams.toString()}&page=${currentPage + 1}`
      : null;

  const previousPageUrl =
    currentPage > 1
      ? `${baseUrl}?${queryParams.toString()}&page=${currentPage - 1}`
      : null;

  logger.info(`Fetched ${rows.length} merchants from database`);

  return res.status(200).json({
    success: true,
    message: "Merchants retrieved successfully.",
    pagination: {
      total: count,
      page: currentPage,
      limit: parseInt(limit),
      totalPages,
      nextPageUrl,
      previousPageUrl,
    },
    data: rows,
  });
});



module.exports = { registerMerchant,getMerchants };
