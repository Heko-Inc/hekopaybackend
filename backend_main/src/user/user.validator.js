const Joi = require("joi");

exports.updateBusinessSchema = Joi.object({
    businessName: Joi.string().required(),
    businessType: Joi.string().required(),
});

exports.customizeSchema = Joi.object({
    businessCategory: Joi.string().required(),
});
