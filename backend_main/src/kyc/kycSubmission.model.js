module.exports = (sequelize, DataTypes) => {
  const KycSubmission = sequelize.define('KycSubmission', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: { type: DataTypes.UUID, allowNull: false },

    // Multi-step data fields
    businessName: DataTypes.STRING,
    tradingName: DataTypes.STRING,
    registrationType: DataTypes.STRING,
    registrationNumber: DataTypes.STRING,
    kraPin: DataTypes.STRING,
    estimatedMonthlySales: DataTypes.STRING,

    idType: DataTypes.STRING,                 // e.g., National ID
    idDocumentUrl: DataTypes.STRING,          // File URL

    addressLine: DataTypes.STRING,
    city: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    country: DataTypes.STRING,
    addressProofUrl: DataTypes.STRING,        // File URL

    website: DataTypes.STRING,
    socialMediaLink: DataTypes.STRING,
    category: DataTypes.STRING,
    subCategory: DataTypes.STRING,

    kraClearanceUrl: DataTypes.STRING,
    registrationCertUrl: DataTypes.STRING,

    step: { type: DataTypes.INTEGER, defaultValue: 1 }, // Current KYC step

    status: {
      type: DataTypes.ENUM("draft", "pending", "approved", "rejected"),
      defaultValue: "draft",
    },
    rejectionReason: DataTypes.TEXT,

    submittedAt: DataTypes.DATE,
    reviewedAt: DataTypes.DATE,
    reviewedBy: DataTypes.UUID,
  }, {
    tableName: 'kyc_submissions',
    timestamps: true,
    underscored: true,
  });
  return KycSubmission;
};
