const { Sequelize, DataTypes } = require('sequelize');


const { DATABASE_URL } = require('../config/database/db');

const sequelize = new Sequelize(DATABASE_URL);

const User = require('./User')(sequelize, DataTypes);
const Market = require('./Market')(sequelize, DataTypes);
const Currency = require('./Currency')(sequelize, DataTypes);
const Wallet = require('./Wallet')(sequelize, DataTypes);
const WalletAuditTrail = require('./WalletAuditTrail')(sequelize, DataTypes);
const Transaction = require('./Transaction')(sequelize, DataTypes);
const JournalEntry = require('./JournalEntry')(sequelize, DataTypes);
const JournalEntryApproval = require('./JournalEntryApproval')(sequelize, DataTypes);
const KycDocumentType = require('./KycDocumentType')(sequelize, DataTypes);
const KycSubmission = require('./KycSubmission')(sequelize, DataTypes);

// Associations
User.belongsTo(Market, { foreignKey: 'market_id' });
Market.hasMany(User, { foreignKey: 'market_id' });

Wallet.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Wallet, { foreignKey: 'user_id' });

Wallet.belongsTo(Market, { foreignKey: 'market_id' });
Market.hasMany(Wallet, { foreignKey: 'market_id' });

WalletAuditTrail.belongsTo(Wallet, { foreignKey: 'wallet_id' });
Wallet.hasMany(WalletAuditTrail, { foreignKey: 'wallet_id' });

Transaction.belongsTo(Currency, { foreignKey: 'currency' });
Transaction.belongsTo(Market, { foreignKey: 'market_id' });
Transaction.belongsTo(Wallet, { foreignKey: 'sender_wallet_id', as: 'Sender' });
Transaction.belongsTo(Wallet, { foreignKey: 'recipient_wallet_id', as: 'Recipient' });

JournalEntry.belongsTo(Transaction, { foreignKey: 'transaction_id' });
JournalEntry.belongsTo(Wallet, { foreignKey: 'wallet_id' });
JournalEntryApproval.belongsTo(JournalEntry, { foreignKey: 'journal_entry_id' });

KycDocumentType.belongsTo(Market, { foreignKey: 'market_id' });
KycSubmission.belongsTo(User, { foreignKey: 'user_id' });
KycSubmission.belongsTo(KycDocumentType, { foreignKey: 'document_type_id' });

// Export
module.exports = {
  sequelize,
  User, Market, Currency, Wallet, WalletAuditTrail,
  Transaction, JournalEntry, JournalEntryApproval,
  KycDocumentType, KycSubmission
};
