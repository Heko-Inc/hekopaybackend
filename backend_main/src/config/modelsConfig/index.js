const { Sequelize, DataTypes } = require('sequelize');


const { DATABASE_URL } = require('../database/db');

const sequelize = new Sequelize(DATABASE_URL);

const User = require('../../user/user.model')(sequelize, DataTypes);
const Market = require('../../market/market.model')(sequelize, DataTypes);
const Currency = require('../../currency/currency.model')(sequelize, DataTypes);
const Wallet = require('../../wallet/wallet.model')(sequelize, DataTypes);
const WalletAuditTrail = require('../../wallet/walletAuditTrail.model')(sequelize, DataTypes);
const Transaction = require('../../transaction/transaction.model')(sequelize, DataTypes);
const JournalEntry = require('../../journal/journalEntry.model')(sequelize, DataTypes);
const JournalEntryApproval = require('../../journal/journalApproval.model')(sequelize, DataTypes);
const KycDocumentType = require('../../kyc/kycDocumentType.model')(sequelize, DataTypes);
const KycSubmission = require('../../kyc/kycSubmission.model')(sequelize, DataTypes);

const RefreshToken = require("../../refreshToken/refreshtoken.model")(sequelize,DataTypes);

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
  KycDocumentType, KycSubmission,RefreshToken
};


// sequelize
//   .sync({ alter: true }) 
//   .then(() => {
//     console.log('✅ All models synchronized (altered) successfully.');
//   })
//   .catch((err) => {
//     console.error('❌ Error syncing models:', err);
//   });