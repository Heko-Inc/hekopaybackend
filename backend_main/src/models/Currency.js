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
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'currencies',
      timestamps: false,
    });
    return Currency;
  };
  