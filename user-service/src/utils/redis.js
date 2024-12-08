const { createClient } = require('redis');
require('dotenv').config();

let redisClient;

async function connectRedis() {
  try {
    // Create and configure the Redis client
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    // Handle errors gracefully
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('ready', () => {
      console.log('Redis client is ready and connected.');
    });

    // Connect to Redis
    await redisClient.connect();
    console.log('Connected to Redis successfully');
  } catch (error) {
    console.error('Failed to connect to Redis. Running without Redis cache:', error);
    // Set up a fallback if Redis is unavailable
    redisClient = null;
  }
}

// Call the function to connect to Redis
connectRedis();

// Export redisClient for use in other modules, with a fallback to ensure app doesn't crash
module.exports = {
  redisClient,
  isRedisConnected: () => redisClient && redisClient.isOpen,
};