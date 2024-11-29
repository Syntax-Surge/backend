const db = require('../config/db');
const crypto = require('crypto');
const { publishToQueue } = require('../config/rabbitmq');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Orders = db.orders;
const OrderItems = db.orderItems;
const Payemnts = db.payments;

exports.createPaymentIntent=async (req, res) => {
    const { total, customer, shipping,items } = req.body;
    try {
    //   console.log("request",req.body.product,req.body.customer,req.body.shipping);
  
      if ( !total || !customer || !shipping) {
        return res.status(400).send({
          error: {
            message: "Product, customer, and shipping details are required.",
          },
        });
      }

      console.log(customer, shipping);
      
      console.log("newOrder");
      const newOrder = await Orders.create({
        userId: customer.id,
        addressLine1: shipping.addressLine1,
        addressLine2: shipping.addressLine2 || null,
        city: shipping.city,
        state: shipping.state,
        postalCode: shipping.postalCode,
        country: shipping.country,
      });
      console.log("newOrder");
      const orderItems = items.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity || 1,
      }));
      
     
      
      // Bulk insert order items
      await OrderItems.bulkCreate(orderItems);
  
      const idempotencyKey = crypto.createHash('sha256').update(`payment_${newOrder.id}`).digest('hex');
      const amount = Math.round(total * 100);
      
      const paymentIntent = await stripe.paymentIntents.create(
        {
          currency: "LKR",
          amount: amount,
          automatic_payment_methods: { enabled: true },
          metadata: {
            customer_name: customer.name,
            order_id: newOrder.id, // Include Order ID for tracking
          },
        },
        { idempotencyKey } // Use idempotency key here
      );
  
      res.send({
        clientSecret: paymentIntent.client_secret,
        orderId: newOrder.id,
      });

    } catch (e) {
      return res.status(400).send({
        error: {
          message: e.message,
        },
      });
    }
  }


 exports.confirmPayment= async (req, res) => {
    const { paymentIntent,orderId } = req.body;

    console.log(paymentIntent);
    
  
    const PaymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id);
  
    if (PaymentIntent.status === 'succeeded') {
        console.log("jjj");
        
      const payment=await Payemnts.create({
        paymentIntentId:PaymentIntent.id,
        orderId: orderId,
        paymentMethod:'credit_card',
        paymentStatus:'success',
        amount:PaymentIntent.amount
      });

      publishToQueue("product","minaus one")

      res.status(200).json({payment});
    } else {
      res.status(400).send('Payment not successful');
    }
  };