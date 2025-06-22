const Router = require('express').Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const UserController = require('./user.controller');
const UserSchema = require("./user.validator")
const upload = require("../middlewares/cloudinaryUpload");
const { restrictTo } = require('../middlewares/auth.middleware');
const { tokenValidator } = require('../middlewares/verifyToken');

Router.patch(
    '/:id/business',
    restrictTo('user'),
    validateRequest(UserSchema.updateBusinessSchema),
    asyncMiddleware(UserController.updateBusinessInfo)
);


Router.post(
    "/:id/customize",
    restrictTo('user'),
    upload.single("logo"),
    validateRequest(UserSchema.customizeSchema),
    asyncMiddleware(UserController.customizeBusiness)
);
// User endpoints
Router.get(
    '/me',
    asyncMiddleware(UserController.getMyProfile)
);

Router.patch(
    '/me',
    validateRequest(UserSchema.updateProfileSchema),
    asyncMiddleware(UserController.updateMyProfile)
);

// Admin endpoints
Router.get(
    '/',
    restrictTo('admin'),
    validateRequest(UserSchema.paginationSchema, 'query'),
    asyncMiddleware(UserController.getAllUsers)
);

Router.get(
    '/:userId',
    restrictTo('admin'),
    validateRequest(UserSchema.userIdSchema, 'params'),
    asyncMiddleware(UserController.getUser)
);

Router.patch(
    '/:userId',
    restrictTo('admin'),
    validateRequest(UserSchema.userIdSchema, 'params'),
    validateRequest(UserSchema.adminUpdateSchema),
    asyncMiddleware(UserController.adminUpdateUser)
);

Router.delete(
    '/:userId/deactivate',
    restrictTo('admin'),
    validateRequest(UserSchema.userIdSchema, 'params'),
    asyncMiddleware(UserController.deactivateUser)
);

Router.post(
    '/:userId/activate',
    restrictTo('admin'),
    validateRequest(UserSchema.userIdSchema, 'params'),
    asyncMiddleware(UserController.activateUser)
);
module.exports = Router