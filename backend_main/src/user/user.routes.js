const Router = require('express').Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const UserController = require('./user.controller');
const UserSchema = require("./user.validator")
const upload = require("../middlewares/cloudinaryUpload");

Router.patch(
    '/:id/business',
    validateRequest(UserSchema.updateBusinessSchema),
    asyncMiddleware(UserController.updateBusinessInfo)
);


Router.post(
    "/:id/customize",
    upload.single("logo"),
    validateRequest(UserSchema.customizeSchema),
    asyncMiddleware(UserController.customizeBusiness)
);
module.exports = Router