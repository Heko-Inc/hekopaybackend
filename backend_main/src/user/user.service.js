const cloudinary = require("../utils/cloudinary");
const { User, Market } = require('../config/modelsConfig');
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

// User methods
exports.getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
    include: [{
      model: Market,
      as: 'market',
      attributes: ['id', 'countryName', 'countryCode']
    }]
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

exports.updateUser = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 404);

  const updatableFields = ['firstName', 'lastName', 'businessName', 'businessType', 'defaultCurrency','marketId'];
  const updates = {};

  updatableFields.forEach(field => {
    if (data[field] !== undefined) updates[field] = data[field];
  });

  await user.update(updates);
  return user.reload();
};

// Admin methods
exports.getAllUsers = async ({ page = 1, limit = 20, search = '' }) => {
  const where = {};

  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { businessName: { [Op.iLike]: `%${search}%` } }
    ];
  }

  return await User.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    include: [{
      model: Market,
      as: 'market',
      attributes: ['id', 'countryName', 'countryCode']
    }],
    limit,
    offset: (page - 1) * limit,
    order: [['created_at', 'DESC']]
  });
};

exports.adminUpdateUser = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 404);

  await user.update(data);
  return user.reload();
};

exports.deactivateUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 404);
  await user.update({ isActive: false });
};

exports.activateUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 404);
  await user.update({ isActive: true });
};