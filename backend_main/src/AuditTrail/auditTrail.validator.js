const Joi = require('joi');

exports.walletIdSchema = Joi.object({
  walletId: Joi.string().uuid().required()
});

exports.transactionIdSchema = Joi.object({
  transactionId: Joi.string().uuid().required()
});

exports.paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});