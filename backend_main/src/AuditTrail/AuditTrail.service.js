const { WalletAuditTrail } = require("../config/modelsConfig/index");

const getAllAuditTrailsService = async () => {
    return await WalletAuditTrail.findAll({
      order: [['created_at', 'DESC']],
    });
};
  
module.exports = {
    getAllAuditTrailsService,
};