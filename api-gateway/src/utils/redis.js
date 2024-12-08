const { createClient } = require('redis');
require('dotenv').config();

let redisClient;

async function connectRedis() {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('ready', () => {
      console.log('Redis client is ready and connected.');
    });

    await redisClient.connect();
    console.log('Connected to Redis successfully');
  } catch (error) {
    console.error('Failed to connect to Redis. Running without Redis cache:', error);
    redisClient = null;
  }
}

connectRedis();

module.exports = {
  redisClient,
  isRedisConnected: () => redisClient && redisClient.isOpen,
};