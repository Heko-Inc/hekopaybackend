module.exports = (sequelize, DataTypes) => {
    const Wallet = sequelize.define('Wallet', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      market_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      wallet_type: DataTypes.STRING,
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      reserved_balance: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_frozen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      frozen_reason: DataTypes.TEXT,
      frozen_at: DataTypes.DATE,
      frozen_by: DataTypes.UUID,
      creation_source: DataTypes.STRING,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'wallets',
      timestamps: false,
    });
    return Wallet;
  };
  