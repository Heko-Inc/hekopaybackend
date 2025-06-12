module.exports = (sequelize, DataTypes) => {
    const Market = sequelize.define("Market", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      country_code: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      country_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      primary_currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      timezone: {
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
      tableName: 'markets',
      timestamps: false,
    });
  
    return Market;
  };
  