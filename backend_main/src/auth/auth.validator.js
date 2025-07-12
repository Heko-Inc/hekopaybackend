const Joi = require("joi");

exports.requestEmailSchema = Joi.object({
    email: Joi.string().email().required(),
});

exports.verifyEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
});

exports.registerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    otp: Joi.string().length(6).required(),
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    // otp: Joi.string().length(6).required(),
});

exports.forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

exports.verifyOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
});

exports.resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    newPassword: Joi.string().min(6).required()
});
