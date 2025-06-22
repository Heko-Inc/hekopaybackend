module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      businessName: DataTypes.STRING,
      businessType: DataTypes.STRING,
      marketId: {
        type: DataTypes.UUID,
      },
      defaultCurrency: {
        type: DataTypes.STRING(3),
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role:{
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
      }
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true, // Ensures DB columns are snake_case
    }
  );

  return User;
};
