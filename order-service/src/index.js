const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connectDB } = require("./config/db");
const db = require("./config/db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

console.log("Line 14 called");

// Initialize DB Connection
db.sequelize.sync().then(function () {
  console.log("Database Connected...");
});

// Other middlewares and routes setup here
const cartRouter = require("./routes/shoppingCart.route");

// api endpoints
app.use("/api/v1/cart/", cartRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});
