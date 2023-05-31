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

const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 hours ago
const twelveHoursAgoTimestamp = Math.floor(twelveHoursAgo.getTime() / 1000); // 12 hours ago timestamp in seconds

router.get('/opensky/flights/:icao24', async (req, res) => {

  const icao24 = req.params.icao24.toLowerCase();
  const statesUrl = 'https://opensky-network.org/api/states/all';
  
  const flightsUrl = `https://opensky-network.org/api/flights/aircraft?icao24=${icao24}&begin=${twelveHoursAgoTimestamp}&end=${currentTimestamp}`;

  try {
    //check if data exists in redis
    redisClientListen.connect();
    redisClientListen.on('error', err => console.log('Redis error: ', err.message));
    const value = await redisClientListen.get(icao24);
    if (value) {
      const cachedData = JSON.parse(value);
      res.status(200).json({cachedData , source: 'redis'});
      redisClientListen.quit();
      return;
    }
    redisClientListen.quit();


    const statesResponse = await axios.get(statesUrl, {
      auth: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD
      }
    });
    const statesData = statesResponse.data;

    const flightsResponse = await axios.get(flightsUrl, {
      auth: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD
      }
    });
    const flightsData = flightsResponse.data;

    // Find the flight with the provided ICAO24 code
    const flight = statesData.states
      .map(state => ({
        icao24: state[0],
        callsign: state[1].replace(/\s/g, ''), // Remove spaces from the flight callsign
        originCountry: state[2],
        longitude: state[5],
        latitude: state[6],
        altitude: state[7]
      }))
      .find(state => state.icao24 === icao24);

    if (!flight) {
      res.status(404).json({ error: 'Flight not found' });
      return;
    }

    const flightDetails = flightsData[0];

    if (!flightDetails) {
      res.status(404).json({ error: 'Flight details not found' });
      return;
    }

    const flightInfo = {
      icao24: flight.icao24,
      callsign: flight.callsign,
      originCountry: flight.originCountry,
      longitude: flight.longitude,
      latitude: flight.latitude,
      altitude: flight.altitude,
      estDepartureAirport: flightDetails.estDepartureAirport,
      estArrivalAirport: flightDetails.estArrivalAirport,
      estDepartureTime: flightDetails.firstSeen,
      estArrivalTime: flightDetails.lastSeen
      // Add more details as needed
    };
    redisClient.connect();
    redisClient.setEx(icao24, 60, JSON.stringify(flightInfo)); // Cache for 1 min
    redisClient.quit();


    res.json({flightInfo, source: "api"});
  } catch (error) {
    console.error('Error retrieving flight data:', error);
    res.status(500).json({ error: 'An error occurred while retrieving flight data' });
  }
});


// Define a route to retrieve departure flights by departure airport
router.get('/opensky/flights/departure/:airport', async (req, res) => {
  const departureAirport = req.params.airport.toLowerCase();

  try {
    // Make a request to the OpenSky Network API
    const url = `https://opensky-network.org/api/flights/departure?airport=${departureAirport}&begin=${twelveHoursAgoTimestamp}&end=${currentTimestamp}`;
    const flightsResponse = await axios.get(url, {
      auth: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD
      }
    });
  

    // Extract the departure flights data from the response
    const flights = flightsResponse.data;

    // Return the departure flights as a JSON response
    res.json(flights);
  } catch (error) {
    console.error('Error fetching departure flights:', error);
    res.status(500).json({ error: 'Error fetching departure flights' });
  }
});



// Define a route to retrieve departure flights by departure airport
router.get('/opensky/flights/arrival/:airport', async (req, res) => {
  const departureAirport = req.params.airport.toLowerCase();

  try {
    // Make a request to the OpenSky Network API
    const url = `https://opensky-network.org/api/flights/arrival?airport=${departureAirport}&begin=${twelveHoursAgoTimestamp}&end=${currentTimestamp}`;
    const flightsResponse = await axios.get(url, {
      auth: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD
      }
    });
  

    // Extract the departure flights data from the response
    const flights = flightsResponse.data;

    // Return the departure flights as a JSON response
    res.json(flights);
  } catch (error) {
    console.error('Error fetching departure flights:', error);
    res.status(500).json({ error: 'Error fetching departure flights' });
  }
});



module.exports = router;
