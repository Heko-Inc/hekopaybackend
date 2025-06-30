const WalletAuditService = require("./AuditTrail.service");

const getAllAuditTrails = async (req, res) => {
  const auditLogs = await WalletAuditService.getAllAuditTrailsService();
  res.status(200).json({
    success: true,
    data: auditLogs,
  });
};


module.exports = {
  getAllAuditTrails,
};
