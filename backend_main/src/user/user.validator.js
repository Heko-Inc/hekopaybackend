const Joi = require("joi");

const registerMerchantSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    business_name: Joi.string().required(),
    business_type: Joi.string().required(),
    market_id: Joi.string().uuid().required(),
    default_currency: Joi.string().required(),
});

const loginMerchantSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const getMerchantsQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().allow(""),
    market_id: Joi.string().uuid().optional(),
    business_type: Joi.string().optional(),
});

module.exports = {
    registerMerchantSchema,
    loginMerchantSchema,
    getMerchantsQuerySchema,
};