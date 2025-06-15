# HEKO PAY API BREAKDOWN

## ✅ CORE MODULES & REQUIRED APIs

### 1. User & Authentication Module
Handles registration, login, and user management.

| API | Method | Purpose |
|-----|--------|---------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Authenticate user |
| `/api/users/:id` | GET | Get user profile |
| `/api/users/:id` | PUT | Update user details |
| `/api/users` | GET | Admin: List users |

**✅ Total: 5 APIs**

### 2. KYC Module
Handles user identity verification via document submission.

| API | Method | Purpose |
|-----|--------|---------|
| `/api/kyc/document-types` | GET | Get available KYC document types |
| `/api/kyc/submit` | POST | Submit a KYC document |
| `/api/kyc/submissions/:id` | GET | View user's KYC submission |
| `/api/kyc/submissions/:id` | PUT | Admin: Approve/Reject submission |

**✅ Total: 4 APIs**

### 3. Market & Currency Module
Handles market setup and configuration.

| API | Method | Purpose |
|-----|--------|---------|
| `/api/markets` | GET | List markets |
| `/api/markets` | POST | Create new market |
| `/api/currencies` | GET | List currencies |
| `/api/market-config` | GET | Get market config |
| `/api/market-config` | POST | Admin: Add market config |

**✅ Total: 5 APIs**

### 4. Wallet Module
Wallet creation, management, balance retrieval, and freeze logic.

| API | Method | Purpose |
|-----|--------|---------|
| `/api/wallets` | GET | List user's wallets |
| `/api/wallets/:id` | GET | Get wallet details |
| `/api/wallets/create` | POST | Create wallet |
| `/api/wallets/:id/freeze` | POST | Freeze wallet |
| `/api/wallets/:id/unfreeze` | POST | Unfreeze wallet |

**✅ Total: 5 APIs**

### 5. Transactions Module
Handles transfer flows and transaction tracking.

| API | Method | Purpose |
|-----|--------|---------|
| `/api/transactions/initiate` | POST | Initiate a transfer |
| `/api/transactions/:id` | GET | Get transaction details |
| `/api/transactions` | GET | List all transactions (user/admin) |
| `/api/transactions/:id/status` | PUT | Update transaction status (if needed) |

**✅ Total: 4 APIs**

### 6. Journal Entries & Ledger Module
For double-entry records and auditing.

| API | Method | Purpose |
|-----|--------|---------|
| `/api/journals/:transactionId` | GET | Get journal entries for transaction |
| `/api/journal-entries` | GET | List journal entries |
| `/api/journal-entry-approvals` | POST | Approve journal entry (if manual process) |

**✅ Total: 3 APIs**

### 7. Wallet Audit Trail
For balance before/after tracking per wallet.

| API | Method | Purpose |
|-----|--------|---------|
| `/api/wallet-audit/:walletId` | GET | Get audit trail for a wallet |
| `/api/wallet-audit` | GET | Admin: view audit records |

**✅ Total: 2 APIs**

## 🧮 GRAND TOTAL

| Module | APIs |
|--------|------|
| Auth & User | 5 |
| KYC | 4 |
| Market & Currency | 5 |
| Wallet | 5 |
| Transactions | 4 |
| Journal Entries | 3 |
| Wallet Audit Trail | 2 |

**✅ Total APIs needed = 28**

## 🚀 Optional (Nice-to-Have) APIs

| API | Purpose |
|-----|---------|
| `/api/dashboard/summary` | User/admin overview |
| `/api/notifications` | In-app messages for transfers, KYC updates |
| `/api/analytics` | Track transaction trends, volume |
| `/api/bnct/redeem` | Convert BNCT to fiat or services |