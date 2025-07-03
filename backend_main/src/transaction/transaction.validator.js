const Joi = require('joi');

exports.sendPaymentSchema = Joi.object({
  senderId: Joi.string().uuid().required(),
  recipientId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  market_id: Joi.string().uuid().required(),
  currency: Joi.string().length(3).uppercase().required(),
  description: Joi.string().optional()
});

exports.transactionIdSchema = Joi.object({
  id: Joi.string().uuid().required()
});

exports.paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  market_id: Joi.string().uuid().optional(),
  status: Joi.string().valid('pending', 'completed', 'failed').optional()
});

exports.userTransactionsSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  market_id: Joi.string().uuid().optional(),
  status: Joi.string().valid('pending', 'completed', 'failed').optional()
});