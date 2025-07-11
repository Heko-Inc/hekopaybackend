const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connectDatabase = require("./config/database/connectionDb");

const UsersRoute = require("./user/user.routes");
const MarketRoutes = require("./market/market.routes");
const WalletRoutes = require("./wallet/wallet.routes");
const stkPushRoutes = require("./stkpush/stkpush.routes");


const currencyRoutes = require("./currency/currency.routes");


const TransactionRoute = require("./transaction/transaction.routes")
const KycRoutes = require("./kyc/kyc.routes")
const errorHandler = require("./middlewares/errorHandler");
const responseFormatter = require("./middlewares/responseFormatter");
const { verifyToken, tokenValidator } = require("./middlewares/verifyToken");




require("dotenv").config();


app.use(cors());
app.use(express.json());
app.use(responseFormatter); // Response Formatter
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the backend server",
  });
});

app.use("/api/v1/auth", require("./auth/auth.routes"));

app.use(tokenValidator())
app.use("/api/v1/users", UsersRoute);
app.use("/api/v1/currencies", require("./currency/currency.route"));
app.use("/api/v1/markets", MarketRoutes);
app.use("/api/v1/kyc", KycRoutes);
app.use("/api/v1/wallets", WalletRoutes);
app.use("/api/v1/stk/push", stkPushRoutes);

app.use("/api/v1/transactions", TransactionRoute);


app.use("/api/v1/transaction",TransactionRoute);
app.use("/api/v1/currency",currencyRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await connectDatabase();
    console.log(`SERVER IS RUNNING ON: http://localhost:${PORT}`);

  } catch (error) {
    console.error("❌ Error starting the server:", error);
    process.exit(1);
  }
});
