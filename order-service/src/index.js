const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connectDB } = require("./config/db");
const cartRouter = require("./routes/cartRoute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Initialize DB Connection
connectDB();

// Other middlewares and routes setup here

// api endpoints
app.use("/api/cart/", cartRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});
