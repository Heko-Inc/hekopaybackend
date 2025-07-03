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
      field: 'wallet_id' // Database column name
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
      field: 'balance_before'
    },
    balanceAfter: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      field: 'balance_after'
    },
    transactionId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'transaction_id'
    },
    performedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'performed_by'
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