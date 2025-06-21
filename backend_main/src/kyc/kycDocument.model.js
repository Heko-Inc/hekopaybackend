module.exports = (sequelize, DataTypes) => {
  const KycDocument = sequelize.define('KycDocument', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    submissionId: { type: DataTypes.UUID, allowNull: false },
    documentTypeId: { type: DataTypes.UUID, allowNull: false },
    documentValue: DataTypes.STRING,
    documentFileUrl: DataTypes.STRING,
  }, {
    tableName: 'kyc_documents',
    timestamps: true,
    underscored: true,
  });

  return KycDocument;
};
  