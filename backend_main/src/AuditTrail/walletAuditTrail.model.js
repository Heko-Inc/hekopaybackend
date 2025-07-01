module.exports = (sequelize, DataTypes) => {
  const WalletAuditTrail = sequelize.define('WalletAuditTrail', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    wallet_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    balance_before: DataTypes.DECIMAL,
    balance_after: DataTypes.DECIMAL,
    transaction_id: DataTypes.UUID,
    performed_by: DataTypes.UUID,
    reason: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {                           // 👈 Add this
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'wallet_audit_trail',
    timestamps: false,
  });

  return WalletAuditTrail;
};
