module.exports = (sequelize, DataTypes) => {
    const JournalEntry = sequelize.define('JournalEntry', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      transaction_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      wallet_id: DataTypes.UUID,
      debit_amount: DataTypes.DECIMAL,
      credit_amount: DataTypes.DECIMAL,
      entry_type: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, {
      tableName: 'journal_entries',
      timestamps: false,
    });
    return JournalEntry;
  };
  