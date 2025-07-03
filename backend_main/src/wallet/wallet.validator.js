const Joi = require('joi');

exports.registerWalletSchema = Joi.object({
  user_id: Joi.string().uuid().required(),
  market_id: Joi.string().uuid().required(),
  wallet_type: Joi.string().valid('primary', 'bnct', 'prepayment').required(),
  currency: Joi.string().length(3).uppercase().required(),
  creation_source: Joi.string().required()
});

exports.addBalanceSchema = Joi.object({
  wallet_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  performed_by: Joi.string().uuid().required()
});

exports.walletIdSchema = Joi.object({
  walletId: Joi.string().uuid().required()
});

exports.freezeWalletSchema = Joi.object({
  walletId: Joi.string().uuid().required(),
  reason: Joi.string().required(),
  performedBy: Joi.string().uuid().required()
});

exports.unfreezeWalletSchema = Joi.object({
  walletId: Joi.string().uuid().required(),
  performedBy: Joi.string().uuid().required()
});