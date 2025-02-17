// rabbitmqService.js
require('dotenv').config();
const amqp = require('amqplib');

let connection = null;
let channel = null;

/**
 * Connect to RabbitMQ and create a channel
 */
async function connectRabbitMQ() {
  try {
    // Connect to RabbitMQ server using the URL from .env
    connection = await amqp.connect(process.env.MSG_QUEUE_URL);
    console.log('Connected to RabbitMQ');

    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err.message);
    });

    connection.on('close', () => {
      console.error('RabbitMQ connection closed.'); // Attempt to reconnect
    });



    // Create a channel
    channel = await connection.createChannel();

    channel.on('error', (err) => {
      console.error('RabbitMQ channel error:', err.message);
    });

    channel.on('close', () => {
      console.error('RabbitMQ channel closed.');
    });
    
    console.log('RabbitMQ channel created');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error.message);
    throw error;
  }
}

/**
 * Publish a message to a queue
 */
async function publishToQueue(queueName, message) {
  if (!channel) throw new Error('RabbitMQ channel is not initialized');
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(message));
  console.log(`Message sent to queue "${queueName}": ${message}`);
}

/**
 * Consume messages from a queue
 */
async function consumeFromQueue(queueName, callback) {
  if (!channel) throw new Error('RabbitMQ channel is not initialized');
  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      callback(msg.content.toString());
      channel.ack(msg);
    }
  });
}

/**
 * Close the RabbitMQ connection gracefully
 */
async function closeConnection() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('RabbitMQ connection closed');
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error.message);
  }
}

module.exports = {
  connectRabbitMQ,
  publishToQueue,
  consumeFromQueue,
  closeConnection,
};
