const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connectDB } = require("./config/db");
const db = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const productOpRoutes = require("./routes/productOp routes/productOp.route");
const { connectRabbitMQ, consumeFromQueue } = require("./config/rabbitmq");
const { updateProduct_OrderItem } = require("./controllers/productController");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors()); 
app.use(cors({origin: [ "http://localhost:3001" , "http://localhost:3000" ] ,credentials: true} )); 


console.log("Line 15 called");

(async () => {
  try {
    await connectRabbitMQ();

    consumeFromQueue("order_product", (message) => {
      const parsedMessage = JSON.parse(message);
      console.log("order", parsedMessage);
      updateProduct_OrderItem(parsedMessage);
    });
  } catch (error) {
    console.error("Failed to initialize RabbitMQ:", error.message);
    process.exit(1); // Exit if RabbitMQ fails
  }
})();

// Initialize DB Connection

db.sequelize.sync().then(function () {
  console.log("Database Connected");
});

app.get("/", (req, res) => {
  console.log("product");
  res.status(200).json({"service":"product"})
});


// Other middlewares and routes setup here

app.use('/categories', categoryRoutes);
app.use('/products', productOpRoutes);
app.use('/reviews', reviewRoutes);



const PORT = process.env.PORT || 3004;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Service running on port ${PORT}`);
  });
}

module.exports = app;
