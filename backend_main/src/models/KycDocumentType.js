module.exports = (sequelize, DataTypes) => {
    const KycDocumentType = sequelize.define('KycDocumentType', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      market_id: { type: DataTypes.UUID, allowNull: false },
      code: { type: DataTypes.STRING, allowNull: false },
      display_name: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      is_required: { type: DataTypes.BOOLEAN, defaultValue: false },
      validation_regex: DataTypes.STRING,
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, {
      tableName: 'kyc_document_types',
      timestamps: false,
    });
    return KycDocumentType;
  };
  