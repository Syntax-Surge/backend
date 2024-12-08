const db = require('../config/db');
const crypto = require('crypto');
const { publishToQueue } = require('../config/rabbitmq');
const { Sequelize } = require('sequelize');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Orders = db.orders;
const OrderItems = db.orderItems;
const Payments = db.payments;

exports.createPaymentIntent=async (req, res) => {
    const { total, customer, shipping,items } = req.body;

    try {
      console.log("kkkk");
      
    //   console.log("request",req.body.product,req.body.customer,req.body.shipping);
  
      if ( !total || !customer || !shipping) {
        return res.status(400).send({
          error: {
            message: "Product, customer, and shipping details are required.",
          },
        });
      }

    

      console.log(customer, shipping);
      const newOrder = await Orders.create({
        userId: customer.id,
        firstName: shipping.firstName,
        lastName: shipping.lastName || null,
        addressLine1: shipping.addressLine1,
        addressLine2: shipping.addressLine2 || null,
        city: shipping.city,
        postalCode: shipping.postalCode,
        phone: shipping.phone,
        note: shipping.note,
        shippingMethod: shipping.shippingMethod,
        status: shipping.status,
      });
      
      console.log("hh",newOrder);
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
 
    console.error("Order creation failed:", e);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: e.message,
    });
    }
  }


//  exports.confirmPayment= async (req, res) => {
//     const { paymentIntent,orderId } = req.body;

//     console.log(paymentIntent);
    
  
//     const PaymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id);
  
//     if (PaymentIntent.status === 'succeeded') {
//       let transaction = await Sequelize.transaction();
//         console.log("jjj");
        
//       const payment=await Payemnts.create({
//         paymentIntentId:PaymentIntent.id,
//         orderId: orderId,
//         paymentMethod:'credit_card',
//         paymentStatus:'success',
//         amount:PaymentIntent.amount
//       },
//       { transaction });

//       await Orders.update(
//         { status: 'in_progress' },
//         {
//           where: { id: orderId },
//           transaction, // Pass transaction to ensure atomicity
//         }
//       );

//       publishToQueue("product","minaus one")

//       await transaction.commit();

//       res.status(200).json({payment});
//     } else {
//       res.status(400).send('Payment not successful');
//     }
//   };

exports.confirmPayment = async (req, res) => {
    const { paymentIntent, orderId } = req.body;
  

  
    try {
      console.log("Payment Intent Received:", paymentIntent);
  
      // Retrieve the payment intent from Stripe
      const retrievedPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id);
  
      if (retrievedPaymentIntent.status === 'succeeded') {
       
  
        // Log payment intent details
        console.log("Payment Intent Retrieved:", retrievedPaymentIntent);
  
        // Create a new payment record
        const payment = await Payments.create(
          {
            paymentIntentId: retrievedPaymentIntent.id,
            orderId: retrievedPaymentIntent.metadata.order_id,
            paymentMethod: 'credit_card',
            paymentStatus: 'success',
            amount: retrievedPaymentIntent.amount,
          },// Pass transaction to ensure atomicity
        );
  
        // Update the order's status to 'in_progress'
        await Orders.update(
          { status: 'Inprogress' },
          {
            where: { id: retrievedPaymentIntent.metadata.order_id },// Pass transaction to ensure atomicity
          }
        );
  
        // Publish a message to the queue
        publishToQueue("product", "minus one");
  

  
        // Respond with the payment record
        res.status(200).json({ payment });
      } else {
        console.error("Payment was not successful:", retrievedPaymentIntent.status);
        res.status(400).json({ error: 'Payment not successful' });
      }
    } catch (e) {
      // Rollback the transaction if any error occurs

      console.error("Error confirming payment:", e);
      res.status(500).json({
        success: false,
        message: "Payment confirmation failed",
        error: e.message,
      });
    }
  };