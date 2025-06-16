const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;

const connectDatabase = require("./config/database/connectionDb");

const UsersRoute = require("./user/user.routes");

const MarketRoutes = require("./market/market.routes");

const WalletRoutes = require("./wallet/wallet.routes");

const errorHandler = require("./middlewares/errorHandler");

const stkPushRoutes = require("./stkpush/stkpush.routes");
const responseFormatter = require("./middlewares/responseFormatter");

const cors = require("cors");

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

app.use("/api/v1/user", UsersRoute);
app.use("/api/v1/market", MarketRoutes);
app.use("/api/v1/wallet", WalletRoutes);
app.use("/api/v1/stk/push", stkPushRoutes);

app.use(errorHandler);



app.listen(PORT, async () => {
  try {
    console.log("server is somewhat running");

    await connectDatabase();

    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Error starting the server:", error);

    process.exit(1);
  }
});
