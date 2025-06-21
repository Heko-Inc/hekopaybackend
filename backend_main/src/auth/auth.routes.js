const Router = require("express").Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const AuthController = require("./auth.controller");
const AuthSchema = require("./auth.validator");

Router.post(
  "/request-email-verification",
  validateRequest(AuthSchema.requestEmailSchema),
  asyncMiddleware(AuthController.requestEmailVerification)
);

Router.post(
  "/verify-email",
  validateRequest(AuthSchema.verifyEmailSchema),
  asyncMiddleware(AuthController.verifyEmail)
);

Router.post(
  "/register",
  validateRequest(AuthSchema.registerSchema),
  asyncMiddleware(AuthController.register)
);

Router.post("/login", validateRequest(AuthSchema.loginSchema), asyncMiddleware(AuthController.login));
Router.post("/forgot-password", validateRequest(AuthSchema.forgotPasswordSchema), asyncMiddleware(AuthController.forgotPassword));
Router.post("/verify-reset-otp", validateRequest(AuthSchema.verifyOtpSchema), asyncMiddleware(AuthController.verifyResetOtp));
Router.post("/reset-password", validateRequest(AuthSchema.resetPasswordSchema), asyncMiddleware(AuthController.resetPassword));

module.exports = Router;
