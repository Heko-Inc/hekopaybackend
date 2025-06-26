const { User } = require("../config/modelsConfig");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const { sendOtpToEmail } = require("../utils/emailService");

const otpStore = new Map();

exports.sendOtp = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOtpToEmail(email, otp);
    const expiresAt = Date.now() + 15 * 60 * 1000;
    otpStore.set(email, { otp, expiresAt });
    return { email };
};

exports.verifyOtp = async ({ email, otp }) => {
    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp) throw new AppError("Invalid OTP", 400);

    if (Date.now() > stored.expiresAt) {
        otpStore.delete(email);
        throw new AppError("OTP expired", 400);
    }

    return { verified: true };
};

exports.register = async ({ firstName, lastName, email, password, otp }) => {
    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp) throw new AppError("Invalid OTP", 400);
    otpStore.delete(email);
    const existing = await User.findOne({ where: { email } });
    if (existing) throw new AppError("Email already registered", 409);

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashed, marketId: "b1cd9099-a271-4a2a-923c-babf670c3a22", defaultCurrency: "KES" });

    return { userId: user.id };
};

exports.login = async ({ email, password, otp }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError("User not found", 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid credentials", 401);

    if (otp) {
        const stored = otpStore.get(email);
        if (!stored || stored.otp !== otp) throw new AppError("Invalid OTP", 400);
        otpStore.delete(email);
    }   

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '1h' });

    return {
        token,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            businessName: user.business_name,
        }
    };
};

exports.forgotPassword = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError("User not found", 404);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    otpStore.set(email, { otp, expiresAt });
    await sendOtpToEmail(email, otp);
};

exports.verifyResetOtp = async ({ email, otp }) => {
    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp) {
        throw new AppError("Invalid OTP", 400);
    }

    if (Date.now() > stored.expiresAt) {
        otpStore.delete(email);
        throw new AppError("OTP expired", 400);
    }

    return true;
};

exports.resetPassword = async ({ email, otp, newPassword }) => {
    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp) {
        throw new AppError("Invalid OTP", 400);
    }

    if (Date.now() > stored.expiresAt) {
        otpStore.delete(email);
        throw new AppError("OTP expired", 400);
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashed }, { where: { email } });
    otpStore.delete(email);
};