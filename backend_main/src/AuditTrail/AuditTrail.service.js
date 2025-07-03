const { WalletAuditTrail } = require('../config/modelsConfig');

const getAllAuditTrails = async ({ page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  
  const { rows, count } = await WalletAuditTrail.findAndCountAll({
    order: [['createdAt', 'DESC']],  // Changed from created_at to createdAt
    limit,
    offset
  });

  return {
    data: rows,
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    }
  };
};

const getAuditTrailByWalletId = async (walletId, { page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  
  const { rows, count } = await WalletAuditTrail.findAndCountAll({
    where: { walletId },  // Changed from wallet_id to walletId
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });

  return {
    data: rows,
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    }
  };
};

const getAuditTrailByTransactionId = async (transactionId, { page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  
  const { rows, count } = await WalletAuditTrail.findAndCountAll({
    where: { transactionId },  // Changed from transaction_id to transactionId
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });

  return {
    data: rows,
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    }
  };
};

module.exports = {
  getAllAuditTrails,
  getAuditTrailByWalletId,
  getAuditTrailByTransactionId
};