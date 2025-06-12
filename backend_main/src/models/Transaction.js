module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      reference_id: { type: DataTypes.STRING, allowNull: false },
      transaction_type: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false },
      total_amount: { type: DataTypes.DECIMAL, allowNull: false },
      currency: { type: DataTypes.STRING(3), allowNull: false },
      market_id: { type: DataTypes.UUID, allowNull: false },
      fee_percentage: DataTypes.DECIMAL,
      fee_amount: DataTypes.DECIMAL,
      metadata: DataTypes.JSONB,
      description: DataTypes.TEXT,
      initiated_by: DataTypes.UUID,
      sender_wallet_id: DataTypes.UUID,
      recipient_wallet_id: DataTypes.UUID,
      parent_transaction_id: DataTypes.UUID,
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      completed_at: DataTypes.DATE,
      failed_at: DataTypes.DATE,
      failure_reason: DataTypes.TEXT,
    }, {
      tableName: 'transactions',
      timestamps: false,
    });
    return Transaction;
  };
  