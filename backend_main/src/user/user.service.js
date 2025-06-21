const cloudinary = require("../utils/cloudinary");
const { User } = require('../config/modelsConfig');
const AppError = require('../utils/AppError');

exports.updateBusinessInfo = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User not found", 404);

  await user.update({
    businessName: data.businessName,
    businessType: data.businessType,
  });

  return { userId: user.id, businessName: user.businessName, businessType: user.businessType };
};

exports.customizeBusiness = async (userId, data, file) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User not found", 404);

  let logoUrl = user.logoUrl;

  if (file && file.path) {
    // 👇 Step 1: Remove old logo if exists
    if (logoUrl) {
      try {
        // Extract public_id from previous URL
        const publicIdMatch = logoUrl.match(/\/hekopay_logos\/([^/.]+)/);
        if (publicIdMatch && publicIdMatch[1]) {
          await cloudinary.uploader.destroy(`hekopay_logos/${publicIdMatch[1]}`);
        }
      } catch (err) {
        console.error("Error deleting old logo from Cloudinary:", err.message);
      }
    }

    // 👇 Step 2: Set new logo URL
    logoUrl = file.path;
  }

  await user.update({
    businessCategory: data.businessCategory,
    logoUrl,
  });

  return { userId: user.id, businessCategory: user.businessCategory, logoUrl };
};

