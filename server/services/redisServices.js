const redis = require('redis');
require('dotenv').config();

module.exports.redisConnector = function () {
  const url = `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`;

  const redisClient = redis.createClient({
    url
  });

  redisClient.connect();

  redisClient.on('error', (err) => {
    console.log('Redis error: ', err.message);
    return err;
  }
  );

  return redisClient;
}
