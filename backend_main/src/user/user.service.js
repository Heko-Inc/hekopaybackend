const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { User } = require("../config/modelsConfig/index");
const AppError = require("../utils/AppError");

const registerMerchantService = async (data) => {
  const {
    name,
    email,
    password,
    business_name,
    business_type,
    market_id,
    default_currency,
  } = data;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError("Email is already registered.", 409);
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

  const sanitizedUser = { ...user.toJSON() };
  delete sanitizedUser.password;
  return sanitizedUser;
};

const loginMerchantService = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password are required.", 400);
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      business_name: user.business_name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const sanitizedUser = { ...user.toJSON() };
  delete sanitizedUser.password;
  return { user: sanitizedUser, token };
};

const getSingleMerchantService = async (id) => {
  if (!id) {
    throw new AppError("Merchant ID is required.", 400);
  }

  const user = await User.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });

  if (!user) throw new AppError("Merchant not found.", 404);
  return user;
};

const getMerchantsService = async (query) => {
  const { page = 1, limit = 10, search = "", market_id, business_type } = query;
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
    offset,
    limit,
    attributes: { exclude: ["password"] },
    order: [["created_at", "DESC"]],
  });

  return { count, rows, page: Number(page), limit: Number(limit) };
};

module.exports = {
  registerMerchantService,
  loginMerchantService,
  getSingleMerchantService,
  getMerchantsService,
};
