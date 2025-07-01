const { WalletAuditTrail } = require("../config/modelsConfig/index");


const getAllAuditTrailsService = async () => {
  return await WalletAuditTrail.findAll({
    order: [["created_at", "DESC"]],
  });
};




const getAuditTrailByWalletIdService = async (walletId) => {
  if (!walletId) {
    throw {
      status: 400,
      message: "walletId is required.",
    };
  }

  const auditTrails = await WalletAuditTrail.findAll({
    where: { wallet_id: walletId },
    order: [["created_at", "DESC"]],
  });

  return auditTrails;
};

const getAuditTrailByTransactionId = async (req, res) => {
    const { transactionId } = req.params;
  
    try {
      const auditLogs = await getAuditTrailByTransactionIdService(transactionId);
  
      res.status(200).json({
        success: true,
        data: auditLogs,
      });
    } catch (error) {
      console.error('Error fetching audit logs by transaction ID:', error);
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Failed to fetch audit logs',
      });
    }
  };


module.exports = {
  getAllAuditTrailsService,
  getAuditTrailByWalletIdService,
  getAuditTrailByTransactionId,
};
