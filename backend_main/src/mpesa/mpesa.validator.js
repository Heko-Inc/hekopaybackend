// mpesa.validator.js
const Joi = require('joi');

exports.stkPushSchema = Joi.object({
  phone: Joi.string().regex(/^[0-9]{10,12}$/).required(),
  amount: Joi.number().positive().required(),
  wallet_id: Joi.string().uuid().required()
});

exports.callbackSchema = Joi.object({
  Body: Joi.object({
    stkCallback: Joi.object({
      ResultCode: Joi.number().required(),
      CallbackMetadata: Joi.object({
        Item: Joi.array().items(
          Joi.object({
            Name: Joi.string().required(),
            Value: Joi.any()
          })
        ).optional()
      }).optional(),
      ResultDesc: Joi.string().optional()
    }).required()
  }).required()
});