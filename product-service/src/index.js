const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();
const { connectRabbitMQ, publishToQueue, consumeFromQueue } = require('./config/rabbitmq');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 


(async () => {
  try {
    await connectRabbitMQ();

    consumeFromQueue("product",(m)=>{
      console.log(m); 
    })

    // // Example: Consume messages from the queue on startup
    // await consumeFromQueue(process.env.QUEUE_NAME, (message) => {
    //   console.log(`Received message: ${message}`);
    // });
  } catch (error) {
    console.error('Failed to initialize RabbitMQ:', error.message);
    process.exit(1); // Exit if RabbitMQ fails
  }
})();
// Initialize DB Connection
connectDB();

// Other middlewares and routes setup here
app.get('/', (req,res)=>{
  console.log("product");
  res.status(200).json({"service":"product"})
  
});

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});
