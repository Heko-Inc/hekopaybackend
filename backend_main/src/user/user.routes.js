const Router = require('express').Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const UserController = require('./user.controller');
const UserSchema = require("./user.validator")

Router.post('/register', validateRequest(UserSchema.registerMerchantSchema), asyncMiddleware(UserController.registerMerchant));
Router.post('/login', validateRequest(UserSchema.loginMerchantSchema), asyncMiddleware(UserController.loginMerchant))
Router.get('/getAll', validateRequest(UserSchema.getMerchantsQuerySchema), asyncMiddleware(UserController.getMerchants))
Router.get('/:id', asyncMiddleware(UserController.getSingleMerchant));

module.exports = Router