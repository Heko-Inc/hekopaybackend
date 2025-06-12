module.exports = (sequelize, DataTypes) => {
    const JournalEntryApproval = sequelize.define('JournalEntryApproval', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      journal_entry_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      requested_by: { type: DataTypes.UUID, allowNull: false },
      approved_by: DataTypes.UUID,
      status: { type: DataTypes.STRING, allowNull: false },
      reason: DataTypes.TEXT,
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, {
      tableName: 'journal_entry_approvals',
      timestamps: false,
    });
    return JournalEntryApproval;
  };
  