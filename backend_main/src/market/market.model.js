module.exports = (sequelize, DataTypes) => {
  const Market = sequelize.define("Market", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    countryCode: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    countryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    primaryCurrency: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }, {
    tableName: 'markets',
    timestamps: true,
    underscored: true,
  });

  return Market;
};
