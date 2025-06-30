const Router = require("express").Router()



const asyncWrapper = require("../middlewares/asyncMiddleware")


const AuditTrailController = require("./AuditTrail.controller")






Router.get('/',asyncWrapper(AuditTrailController.getAllAuditTrails))








module.exports = Router