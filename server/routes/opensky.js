const router = require('express').Router();
const axios = require('axios');
const redis = require('redis');

const url = `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`;
const redisClient = redis.createClient({
  url
});
const redisClientListen = redis.createClient({
  url
});






router.get('/opensky/flights/:iata', async (req, res) => {
  const iata = req.params.iata.toLowerCase();


   //check if data exists in redis
   redisClientListen.connect();
   redisClientListen.on('error', err => console.log('Redis error: ', err.message));
   const value = await redisClientListen.get(`flight_info:${iata}`);
   if (value) {
     const cachedData = JSON.parse(value);
     res.status(200).json({data: cachedData , source: 'redis'});
     redisClientListen.quit();
     return;
   }
   redisClientListen.quit();
   


  try {
    const response = await axios.get(`http://api.aviationstack.com/v1/flights`, {
      params: {
        access_key: process.env.AVISTACK_API_KEY,
        flight_iata: iata,
      }
    });

    redisClient.connect();
    redisClient.setEx(`flight_info:${iata}`, 60*15, JSON.stringify(response.data.data)); // Cache for 15 min
    redisClient.quit();


    res.json({data: response.data.data, source: "api"});


  } catch (error) {
    console.error('Error retrieving flight data:', error);
    res.status(500).json({ error: 'An error occurred while retrieving flight data' });
  }
});








module.exports = router;
