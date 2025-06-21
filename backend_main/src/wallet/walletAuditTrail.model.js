module.exports = (sequelize, DataTypes) => {
  const WalletAuditTrail = sequelize.define('WalletAuditTrail', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    walletId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    balanceBefore: DataTypes.DECIMAL,
    balanceAfter: DataTypes.DECIMAL,
    transactionId: DataTypes.UUID,
    performedBy: DataTypes.UUID,
    reason: DataTypes.TEXT,
  }, {
    tableName: 'wallet_audit_trail',
    timestamps: true,
    underscored: true,
  });

  return WalletAuditTrail;
};
