const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendOtpToEmail = async (email, otp) => {
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Your HekoPay OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>HekoPay OTP Verification</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="letter-spacing: 2px;">${otp}</h1>
        <p>This OTP is valid for 15 minutes. Please do not share it with anyone.</p>
        <br />
        <small>If you did not request this, please ignore this email.</small>
      </div>
    `,
  });

  console.log("Email sent: %s", info.messageId);
};
