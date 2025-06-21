const cloudinary = require('../utils/cloudinary');
const AppError = require('../utils/AppError');

exports.uploadFile = async (file) => {
  if (!file) throw new AppError('No file uploaded', 400);
  
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'hekopay/kyc',
    use_filename: true,
    unique_filename: false,
    resource_type: 'auto'
  });

  return {
    fileUrl: result.secure_url,
    publicId: result.public_id
  };
};

exports.deleteFile = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};