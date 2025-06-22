const Joi = require("joi");

exports.updateBusinessSchema = Joi.object({
    businessName: Joi.string().required(),
    businessType: Joi.string().required(),
});

exports.customizeSchema = Joi.object({
    businessCategory: Joi.string().required(),
});

exports.updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  businessName: Joi.string().min(2).max(100),
  businessType: Joi.string().min(2).max(50),
  marketId:Joi.string().min(2).max(50),
  defaultCurrency: Joi.string().length(3).uppercase()
}).min(1);

exports.adminUpdateSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  businessName: Joi.string().min(2).max(100),
  businessType: Joi.string().min(2).max(50),
  marketId: Joi.string().uuid(),
  defaultCurrency: Joi.string().length(3).uppercase(),
  isActive: Joi.boolean()
});

exports.userIdSchema = Joi.object({
  userId: Joi.string().uuid().required()
});

exports.paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow('').optional()
});