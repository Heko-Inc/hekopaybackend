module.exports = (sequelize, DataTypes) => {
    const KycSubmission = sequelize.define('KycSubmission', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: { type: DataTypes.UUID, allowNull: false },
      document_type_id: { type: DataTypes.UUID, allowNull: false },
      document_value: DataTypes.UUID,
      document_file_path: DataTypes.STRING,
      status: { type: DataTypes.STRING, allowNull: false },
      submitted_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      reviewed_at: DataTypes.DATE,
      reviewed_by: DataTypes.UUID,
      rejection_reason: DataTypes.TEXT,
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, {
      tableName: 'kyc_submissions',
      timestamps: false,
    });
    return KycSubmission;
  };
  