module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      business_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      business_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      market_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'markets',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      default_currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
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
      tableName: 'users',
      timestamps: false, 
      underscored: true, // Converts camelCase to snake_case in DB columns (e.g., default_currency)
    }
  );

  return User;
};
