const Joi = require('joi');

const registerMarketSchema = Joi.object({
    country_code: Joi.string().required(),
    country_name: Joi.string().required(),
    primary_currency: Joi.string().required(),
    timezone: Joi.string().required(),
});

module.exports = { registerMarketSchema };