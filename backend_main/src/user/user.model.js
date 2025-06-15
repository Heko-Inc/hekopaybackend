module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },

      business_name: DataTypes.STRING,

      business_type: DataTypes.STRING,

      market_id: {
        type: DataTypes.UUID,

        references: { model: "markets", key: "id" },
      },

      default_currency: {
        type: DataTypes.STRING(3),
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  return User;
};
