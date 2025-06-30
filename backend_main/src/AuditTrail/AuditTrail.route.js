const Router = require("express").Router()



const asyncWrapper = require("../middlewares/asyncMiddleware")


const AuditTrailController = require("./AuditTrail.controller")






Router.get('/',asyncWrapper(AuditTrailController.getAllAuditTrails))


Router.get('/:walletId', asyncWrapper(AuditTrailController.getAuditTrailByWalletId));


Router.get('/:transactionId', asyncWrapper(AuditTrailController.getAuditTrailByTransactionId));





module.exports = Router