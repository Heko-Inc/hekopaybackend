module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define(
    "Wallet",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      marketId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      walletType: {
        type: DataTypes.ENUM("primary", "bnct", "prepayment"),
        allowNull: false,
        defaultValue: "primary",
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      reservedBalance: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isFrozen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      frozenReason: DataTypes.TEXT,
      frozenAt: DataTypes.DATE,
      frozenBy: DataTypes.UUID,
      creationSource: DataTypes.STRING,
    },
    {
      tableName: "wallets",
      timestamps: true,
      underscored: true,
    }
  );

  // Wallet.associate = (models) => {
  //   Wallet.hasMany(models.Transaction, {
  //     foreignKey: "senderWalletId",
  //     as: "sentTransactions",
  //   });

  //   Wallet.hasMany(models.Transaction, {
  //     foreignKey: "recipientWalletId",
  //     as: "receivedTransactions",
  //   });
  // };

  return Wallet;
};
