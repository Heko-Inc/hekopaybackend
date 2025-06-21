module.exports = (sequelize, DataTypes) => {
  const KycDocumentType = sequelize.define('KycDocumentType', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    marketId: { type: DataTypes.UUID, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    displayName: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    isRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
    validationRegex: DataTypes.STRING,
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'kyc_document_types',
    timestamps: true,
    underscored: true,
  });

  return KycDocumentType;
};
