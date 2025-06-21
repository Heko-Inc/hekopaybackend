const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hekopay_logos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => `user_${req.params.id}_logo`,
  },
});

const upload = multer({ storage });

module.exports = upload;
