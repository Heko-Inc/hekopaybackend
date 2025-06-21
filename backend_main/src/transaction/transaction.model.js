module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      referenceId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      transactionType: {
        type: DataTypes.ENUM("send", "receive", "refund", "deposit", "withdrawal"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      marketId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      feePercentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
      },
      feeAmount: {
        type: DataTypes.DECIMAL(20, 8),
        defaultValue: 0,
      },
      metadata: {
        type: DataTypes.JSONB,
      },
      description: {
        type: DataTypes.TEXT,
      },
      initiatedBy: {
        type: DataTypes.UUID,
      },
      senderWalletId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "wallets",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      recipientWalletId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "wallets",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      parentTransactionId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      completedAt: {
        type: DataTypes.DATE,
      },
      failedAt: {
        type: DataTypes.DATE,
      },
      failureReason: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "transactions",
      timestamps: true,
      underscored: true,
    }
  );

  // Associations should be defined here
  // Transaction.associate = (models) => {
  //   Transaction.belongsTo(models.Wallet, {
  //     foreignKey: "senderWalletId",
  //     as: "senderWallet",
  //     onDelete: "SET NULL",
  //     onUpdate: "CASCADE",
  //   });

  //   Transaction.belongsTo(models.Wallet, {
  //     foreignKey: "recipientWalletId",
  //     as: "recipientWallet",
  //     onDelete: "SET NULL",
  //     onUpdate: "CASCADE",
  //   });
  // };

  return Transaction;
};
