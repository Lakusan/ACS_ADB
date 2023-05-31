const router = require('express').Router();
const axios = require('axios');
const redis = require('redis');


require('dotenv').config({ path: '../.env' });



// Create a Redis client
const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
  }
});


redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (error) => {
  console.error('Redis error:', error);
});



// test
router.get('/opensky/:flightNumber?', async (req, res) => {

  const url = 'https://opensky-network.org/api/states/all';

  const flightNumber = req.params.flightNumber || '';

  const cacheKey = `${url}_${flightNumber}`;

  // Check if the data is already cached
  redisClient.get(cacheKey, (err, cachedData) => {
    if (err) {
      console.error('Error retrieving cached data from Redis:', err);
    }

    if (cachedData) {
      // Data is found in cache, return the cached data
      const flights = JSON.parse(cachedData);
      res.json(flights);
    } else {
      // Data is not cached, make the API request
      axios
        .get(url)
        .then(response => {
          const data = response.data;

          // Extract flight information and filter by flight number if provided
          const flights = data.states
            .map(flight => ({
              icao24: flight[0],
              callsign: flight[1].replace(/\s/g, ''), // Remove spaces from the flight call number
              originCountry: flight[2],
              longitude: flight[5],
              latitude: flight[6],
              altitude: flight[7]
            }))
            .filter(flight => flightNumber === '' || flight.callsign === flightNumber);

          // Store the data in Redis cache with a 2-minute expiration
          redisClient.setex(cacheKey, 120, JSON.stringify(flights));

          res.json(flights);
        })
        .catch(error => {
          res.status(500).json({ error: 'An error occurred while retrieving flight data' });
        });
    }
  });
});

module.exports = router;
