module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      reference_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      transaction_type: {
        type: DataTypes.ENUM(
          "send",
          "receive",
          "refund",
          "deposit",
          "withdrawal"
        ),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      market_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      fee_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
      },
      fee_amount: {
        type: DataTypes.DECIMAL(20, 8),
        defaultValue: 0,
      },
      metadata: {
        type: DataTypes.JSONB,
      },
      description: {
        type: DataTypes.TEXT,
      },
      initiated_by: {
        type: DataTypes.UUID,
      },
      sender_wallet_id: {
        type: DataTypes.UUID,
        allowNull: true,
        // No FK constraint
      },
      
      recipient_wallet_id: {
        type: DataTypes.UUID,
        allowNull: true,
        // No FK constraint
      },      
      parent_transaction_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      completed_at: {
        type: DataTypes.DATE,
      },
      failed_at: {
        type: DataTypes.DATE,
      },
      failure_reason: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "transactions",
      timestamps: false,
      underscored: true,
    }
  );

  // ✅ Define association function here
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Wallet, {
      foreignKey: "sender_wallet_id",
      as: "senderWallet",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    Transaction.belongsTo(models.Wallet, {
      foreignKey: "recipient_wallet_id",
      as: "recipientWallet",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  };

  return Transaction;
};
