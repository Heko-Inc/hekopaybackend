# 🌍 Heko Pay

A robust, modular fintech infrastructure enabling secure, compliant digital wallets, KYC verification, multi-currency transactions, journal-based accounting, and audit tracking across multiple markets.

---

## 🔧 Technologies Used

- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (optional)
- **Hosting:** NeonDB / Any PostgreSQL-compatible platform
- **Others:** drawSQL for schema design

---

## 🌐 Overview

This system supports:

- User onboarding and business verification
- Country/market-specific rules and configurations
- KYC (Know Your Customer) submission and approval flows
- Wallets with multi-currency and reserved/frozen balances
- Secure, auditable transaction processing
- Double-entry journal accounting system
- Full audit logs for compliance and traceability

---

## 🔍 Key Functionalities

### 1. 🧑‍💼 User Management
- Users belong to a specific **market**
- Each user can have:
  - Business details
  - Default currency
  - Verified KYC status

---

### 2. 🪪 KYC Verification

- Each **market** has its own required **KYC document types**
- Users submit KYC documents for verification
- Admins review, approve, or reject submissions
- Documents stored with timestamps and reviewer details

---

### 3. 💰 Wallets & Balances

- Each user can have **multiple wallets**:
  - Tied to a market and currency
  - With balances: main, reserved, frozen
- Wallet actions are tracked in `wallet_audit_trail`

---

### 4. 💸 Transactions

- Users can send/receive funds
- Each transaction supports:
  - Fee calculation (flat or percentage)
  - Status tracking (pending, completed, failed)
  - Reversal via `parent_transaction_id`
- Transfers between wallets are supported with sender/recipient fields

---

### 5. 📘 Journal Entries (Ledger System)

- Each transaction generates **journal entries**
  - Supports credit/debit logic
  - Follows double-entry bookkeeping standards
- Journal entries may require approval via `journal_entry_approvals`

---

### 6. ⚙️ Market Configurations

- Define rules per market, including:
  - Fee percentages
  - Supported currencies
  - Transaction limits
  - Experiment flags for A/B testing

---

### 7. 🕵️ Audit Logging

- Every important entity change is logged
  - Before & after values
  - Who made the change and why
- Ensures compliance with financial audit standards

---

## 🧠 What This System Enables

- ✅ Regulatory-compliant user onboarding
- ✅ Transparent, traceable financial transactions
- ✅ Full audit history for all critical changes
- ✅ Custom rules per region, business unit, or partner
- ✅ Journal-based accounting to meet financial reporting needs

---
