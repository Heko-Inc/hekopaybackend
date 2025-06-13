const { User  } = require("../config/modelsConfig/index");


const jwt = require("jsonwebtoken");


const bcrypt = require("bcrypt");


const loginMerchantService = async ({ email, password }) => {

    if (!email || !password) {

      throw { status: 400, message: "Email and password are required." };

    }
  
    const user = await User.findOne({ where: { email },attributes: ['id', 'name', 'email', 'password', 'business_name', 'business_type', 'market_id', 'default_currency', 'created_at', 'updated_at'] });
  
    if (!user) {

      throw { status: 401, message: "Invalid email or password." };

    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {

      throw { status: 401, message: "Invalid email or password." };
      
    }
  
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        business_name: user.business_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  
    const sanitizedUser = { ...user.toJSON() };

    delete sanitizedUser.password;
  
    return { user: sanitizedUser, token };
  };



  const getSingleMerchantService = async (id) => {
    if (!id) {
      throw { status: 400, message: "Merchant ID is required." };
    }
  
    const user = await User.findOne({
      where: { id },
      attributes: [
        "id",
        "name",
        "email",
        "business_name",
        "business_type",
        "market_id",
        "default_currency",
        "created_at",
        "updated_at"
      ],
    });
  
    if (!user) {
      throw { status: 404, message: "Merchant not found." };
    }
  
    return user;
  };
  
  module.exports = { loginMerchantService, getSingleMerchantService };