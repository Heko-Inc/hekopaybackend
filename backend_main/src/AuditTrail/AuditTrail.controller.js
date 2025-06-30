const WalletAuditService = require("./AuditTrail.service");


const getAllAuditTrails = async (req, res) => {
  const auditLogs = await WalletAuditService.getAllAuditTrailsService();
  res.status(200).json({
    success: true,
    data: auditLogs,
  });
};




const getAuditTrailByWalletId = async (req, res) => {
    const { walletId } = req.params;
  
    try {
      const auditLogs = await WalletAuditService.getAuditTrailByWalletIdService(walletId);
  
      res.status(200).json({
        success: true,
        data: auditLogs,
      });
    } catch (error) {
      console.error('Error fetching audit logs by wallet ID:', error);
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Failed to fetch audit logs',
      });
    }
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
  getAllAuditTrails,
  getAuditTrailByWalletId,
  getAuditTrailByTransactionId
};
