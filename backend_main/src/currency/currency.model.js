
module.exports = (sequelize, DataTypes) => {
  const Currency = sequelize.define('Currency', {
    code: {
      type: DataTypes.STRING(3),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'currencies',
    timestamps: true,
    underscored: true,
  });
  return Currency;
};
