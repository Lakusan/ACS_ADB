const express = require('express');
const redis = require('redis');
const axios = require('axios');
const router = require('express').Router();







const url = `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`;


// Function to fetch flight data from the OpenSky Network API
async function fetchFlightData(flightNumber) {
    try {
      const response = await axios.get(`https://opensky-network.org/api/states/all?icao24=${flightNumber}`);
      const data = response.data;
  
      if (data.states && data.states.length > 0) {
        const [first, icao24, , , , , latitude, longitude] = data.states[0];
       
        return { icao24, latitude, longitude };
      }
    } catch (error) {
      console.error('Error fetching flight data:', error);
    }
  
    return null;
  }

// Publish flight updates to the corresponding channel
async function publishFlightUpdate(flightNumber) {
  const flightData = await fetchFlightData(flightNumber);
  if (flightData) {
    redisClient.publish(`flight:${flightNumber}`, JSON.stringify(flightData));
  }
}

// Set up an endpoint to listen for flight updates
router.get('/flight/:flightNumber', async (req, res) => {
  const { flightNumber } = req.params;

  // Set up the response headers for server-sent events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');



  console.log( await fetchFlightData(flightNumber));

  
  const client = redis.createClient({
    url
  });

  const subscriber = client.duplicate();

  await subscriber.connect();

  await subscriber.subscribe('article', (message) => {
    res.write("new message"); // 'message'
    console.log(message);
  });

});


module.exports = router;