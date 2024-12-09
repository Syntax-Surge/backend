const express = require('express');
require('dotenv').config();
const cors = require('cors');
const uuid = require('uuid');
const db = require("./config/db")
const { connectRabbitMQ, publishToQueue } = require('./config/rabbitmq');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 


(async () => {
  try {
    await connectRabbitMQ();

    // publishToQueue("order_product",["ddd","dsdad","minaus one"])

  } catch (error) {
    console.error('Failed to initialize RabbitMQ:', error.message);
    process.exit(1); // Exit if RabbitMQ fails
  }
})();

db.sequelize.sync().then(function () {
  console.log("Database Connected...");
});


// app.post("/create-payment-intent", async (req, res) => {
//   try {
//     console.log("request",req.body.product,req.body.customer,req.body.shipping);

//     if (!req.body.product || !req.body.product.price || !req.body.shipping) {
//       return res.status(400).send({
//         error: {
//           message: "Product details are required, including a valid price.",
//         },
//       });
//     }

//     const amount = Math.round(req.body.product.price * 100);
    
//     const paymentIntent = await stripe.paymentIntents.create({
//       currency: "LKR",
//       amount: amount,
//       automatic_payment_methods: { enabled: true },
//       metadata: {
//         customer_name: req.body.customer.name,
//         age:"67"
//       },
//     });

//     // // Send publishable key and PaymentIntent details to client
//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (e) {
//     return res.status(400).send({
//       error: {
//         message: e.message,
//       },
//     });
//   }
// });


//routes
const paymentRoute=require("./routes/payment");
// const orderConfirmationRoute=require("./routers/orderConfirmationRoute")

const orderRoutes=require("./routes/orderRoutes");

app.use('/payment', paymentRoute);
// app.use('/api/orderConfirmation', orderConfirmationRoute);

const cartRouter = require("./routes/shoppingCart.route");
const { notFoundHandler, errorHandler } = require('./utils/errorHandler');

// api endpoints
app.use("/cart", cartRouter);

app.use('/orders', orderRoutes);

// Use the Not Found Handler
app.use(notFoundHandler);

// Use the General Error Handler
app.use(errorHandler);


const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});

module.exports = app;
