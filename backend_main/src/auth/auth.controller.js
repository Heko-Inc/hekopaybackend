const AuthService = require("./auth.service");

exports.requestEmailVerification = async (req, res) => {
    const result = await AuthService.sendOtp(req.body.email);
    res.sendResponse(result, "OTP sent successfully");
};

exports.verifyEmail = async (req, res) => {
    const result = await AuthService.verifyOtp(req.body);
    res.sendResponse(result, "Email verified successfully");
};

exports.register = async (req, res) => {
    const result = await AuthService.register(req.body);
    res.sendResponse(result, "User registered successfully");
};

exports.login = async (req, res) => {
    const result = await AuthService.login(req.body);
    res.sendResponse(result, "Login successful");
};

exports.forgotPassword = async (req, res) => {
    await AuthService.forgotPassword(req.body.email);
    res.sendResponse({}, "OTP sent to your email");
};

exports.verifyResetOtp = async (req, res) => {
    await AuthService.verifyResetOtp(req.body);
    res.sendResponse({}, "OTP verified");
};

exports.resetPassword = async (req, res) => {
    await AuthService.resetPassword(req.body);
    res.sendResponse({}, "Password reset successful");
};