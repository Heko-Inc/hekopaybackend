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
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false
    },
    balanceBefore: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
    },
    balanceAfter: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    performedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'wallet_audit_trail',
    timestamps: true,
    underscored: true,
    // indexes: [
    //   {
    //     fields: ['wallet_id']
    //   },
    //   {
    //     fields: ['transaction_id']
    //   },
    //   {
    //     fields: ['created_at']
    //   }
    // ]
  });

  return WalletAuditTrail;
};