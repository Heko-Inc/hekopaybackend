const jwt = require("jsonwebtoken");
require("dotenv").config();

const { RefreshToken } = require("../config/modelsConfig/index");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,       
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m", 
    }
  );
};

const generateRefreshToken = (user) => {
   return jwt.sign(
    {
      id: user.id,       
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d", 
    }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
