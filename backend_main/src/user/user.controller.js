const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const User = require('./user.model'); 

const registerMerchant = asyncMiddleware(async (req, res, next) => {
  const {
    name,
    email,
    password,
    business_name,
    business_type,
    market_id,
    default_currency
  } = req.body;


  if (!name || !email || !password || !business_name || !business_type || !market_id || !default_currency) {
    logger.warn('Registration failed: Missing required fields');
    return res.sendError('All fields are required.', 400);
  }



  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    logger.warn(`Registration failed: Email already in use - ${email}`);
    return res.sendError('Email is already registered.', 409);
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


  return res.sendSuccess('Merchant registered successfully.', sanitizedUser, 201);
});

module.exports = { registerMerchant };
