const { Sequelize, DataTypes } = require('sequelize');
const { DATABASE_URL } = require('../database/db');

// Initialize Sequelize
const sequelize = new Sequelize(DATABASE_URL, { logging: false });

// Load models
const User = require('../../user/user.model')(sequelize, DataTypes);
const Market = require('../../market/market.model')(sequelize, DataTypes);
const Currency = require('../../currency/currency.model')(sequelize, DataTypes);
const Wallet = require('../../wallet/wallet.model')(sequelize, DataTypes);
const WalletAuditTrail = require('../../wallet/walletAuditTrail.model')(sequelize, DataTypes);
const Transaction = require('../../transaction/transaction.model')(sequelize, DataTypes);
const JournalEntry = require('../../journal/journalEntry.model')(sequelize, DataTypes);
const JournalEntryApproval = require('../../journal/journalApproval.model')(sequelize, DataTypes);
const KycDocumentType = require('../../kyc/kycDocumentType.model')(sequelize, DataTypes);
const KycDocument = require('../../kyc/kycDocument.model')(sequelize, DataTypes);
const KycSubmission = require('../../kyc/kycSubmission.model')(sequelize, DataTypes);
const RefreshToken = require("../../refreshToken/refreshtoken.model")(sequelize, DataTypes);

// Associations
User.belongsTo(Market, { foreignKey: 'marketId', as: 'market' });
User.hasMany(Wallet, { foreignKey: 'userId', as: 'wallets' });
User.hasMany(KycSubmission, { foreignKey: 'userId', as: 'kycSubmissions' });
User.hasMany(Transaction, { foreignKey: 'initiatedBy', as: 'initiatedTransactions' });

Market.hasMany(User, { foreignKey: 'marketId', as: 'users' });
Market.hasMany(Wallet, { foreignKey: 'marketId', as: 'wallets' });
Market.hasMany(Transaction, { foreignKey: 'marketId', as: 'transactions' });
Market.hasMany(KycDocumentType, { foreignKey: 'marketId', as: 'kycDocumentTypes' });

Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Wallet.belongsTo(Market, { foreignKey: 'marketId', as: 'market' });
Wallet.hasMany(Transaction, { foreignKey: 'senderWalletId', as: 'sentTransactions' });
Wallet.hasMany(Transaction, { foreignKey: 'recipientWalletId', as: 'receivedTransactions' });
Wallet.hasMany(WalletAuditTrail, { foreignKey: 'walletId', as: 'auditTrails' });

Transaction.belongsTo(Wallet, { foreignKey: 'senderWalletId', as: 'senderWallet' });
Transaction.belongsTo(Wallet, { foreignKey: 'recipientWalletId', as: 'recipientWallet' });
Transaction.belongsTo(User, { foreignKey: 'initiatedBy', as: 'initiatedByUser' });
Transaction.belongsTo(Market, { foreignKey: 'marketId', as: 'market' });
Transaction.belongsTo(Currency, { foreignKey: 'currency' });

WalletAuditTrail.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });
WalletAuditTrail.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });

JournalEntry.belongsTo(Transaction, { foreignKey: 'transaction_id' });
JournalEntry.belongsTo(Wallet, { foreignKey: 'wallet_id' });

JournalEntryApproval.belongsTo(JournalEntry, { foreignKey: 'journal_entry_id' });

KycDocument.belongsTo(KycSubmission, { foreignKey: 'submissionId', as: 'submission' });
KycDocument.belongsTo(KycDocumentType, { foreignKey: 'documentTypeId', as: 'documentType' });

KycSubmission.belongsTo(User, { foreignKey: 'userId', as: 'user' });
KycSubmission.belongsTo(Market, { foreignKey: 'marketId', as: 'market' });
KycSubmission.hasMany(KycDocument, { foreignKey: 'submissionId', as: 'documents' });
KycSubmission.belongsTo(KycDocumentType, { foreignKey: 'documentTypeId', as: 'documentType' });

KycDocumentType.belongsTo(Market, { foreignKey: 'marketId', as: 'market' });
KycDocumentType.hasMany(KycDocument, { foreignKey: 'documentTypeId', as: 'documents' });

// Export
module.exports = {
  sequelize,
  Sequelize,
  User,
  Market,
  Currency,
  Wallet,
  WalletAuditTrail,
  Transaction,
  JournalEntry,
  JournalEntryApproval,
  KycDocumentType,
  KycDocument,
  KycSubmission,
  RefreshToken
};
