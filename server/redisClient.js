const redis = require('redis');
require('dotenv').config();

// Create Redis client
const url = `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`;
const redisClient = redis.createClient({
  url
});

redisClient.connect();
redisClient.on('error', err => console.log('Redis error: ', err.message));
redisClient.on('connect', () => console.log('Connected to Redis Server'));


// Export the Redis client
module.exports = redisClient;
