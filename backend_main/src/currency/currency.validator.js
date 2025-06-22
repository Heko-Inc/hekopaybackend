const Joi = require('joi');

exports.createCurrencySchema = Joi.object({
  code: Joi.string().length(3).uppercase().required(),
  name: Joi.string().min(2).max(50).required(),
  isActive: Joi.boolean().optional()
});

exports.updateCurrencySchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  isActive: Joi.boolean().optional()
}).min(1);

exports.currencyCodeSchema = Joi.object({
  code: Joi.string().length(3).uppercase().required()
});
exports.bulkCreateCurrencySchema = Joi.array().items(
  Joi.object({
    code: Joi.string().length(3).uppercase().required(),
    name: Joi.string().min(2).max(50).required(),
    isActive: Joi.boolean().default(true)
  })
).min(1).max(100); // Limit to 100 items per batch