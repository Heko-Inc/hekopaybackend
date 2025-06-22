const { User } = require("../config/modelsConfig");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const { sendOtpToEmail } = require("../utils/emailService");

const otpStore = new Map();

exports.sendOtp = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);
    console.log(`OTP sent to ${email}: ${otp}`); // For development
    return { email, otp };
};

exports.verifyOtp = async ({ email, otp }) => {
    if (otpStore.get(email) !== otp) throw new AppError("Invalid OTP", 400);
    otpStore.delete(email);
    return { verified: true };
};

exports.register = async ({ firstName, lastName, email, password, role }) => {
    const existing = await User.findOne({ where: { email } });
    if (existing) throw new AppError("Email already registered", 409);

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashed, role, marketId: "b1cd9099-a271-4a2a-923c-babf670c3a22", defaultCurrency: "KES" });

    return { userId: user.id };
};

exports.login = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError("User not found", 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid credentials", 401);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '1h' });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            businessName: user.business_name,
        }
    };
};

exports.forgotPassword = async (email) => {
    console.log(email)
    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError("User not found", 404);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

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