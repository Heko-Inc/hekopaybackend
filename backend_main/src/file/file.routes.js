const Router = require('express').Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const FileController = require('./file.controller');
const upload = require('../middlewares/cloudinaryUpload');

// Upload File
Router.post(
  '/upload',
  upload.single('file'),
  asyncMiddleware(FileController.uploadFile)
);

// Delete File
Router.delete(
  '/delete/:publicId',
  asyncMiddleware(FileController.deleteFile)
);

module.exports = Router;