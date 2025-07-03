const Router = require('express').Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const MpesaController = require('./mpesa.controller');
const MpesaValidator = require('./mpesa.validator');

// STK Push Flow
Router.post(
    '/stk-push',
    validateRequest(MpesaValidator.stkPushSchema),
    asyncMiddleware(MpesaController.generateToken),
    asyncMiddleware(MpesaController.stkPush)
);

// Callback URL
Router.post(
    '/callback',
    validateRequest(MpesaValidator.callbackSchema),
    asyncMiddleware(MpesaController.handleMpesaCallback)
);

module.exports = Router;