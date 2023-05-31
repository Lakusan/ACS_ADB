const router = require('express').Router();
const axios = require('axios');
const redis = require('redis');

const url = `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`;
const redisClient = redis.createClient({
  url
});

const publisher = redis.createClient({
  url
});

router.get('/opensky/flights/v2/:icao24', async (req, res) => {
  const icao24 = req.params.icao24.toLowerCase();

  try{

    (async () => {

      const article = {
        id: '123456',
        name: 'Using Redis Pub/Sub with Node.js',
        blog: 'Logrocket Blog',
      };

      await publisher.connect();

      await publisher.publish('article', JSON.stringify(article));
    })();


   
  
  }catch(err){
    console.log(err);
    res.status(500).json({ error: 'An error occurred while retrieving flight data' });
  }
 
  


  

});




router.get('/opensky/flights/:icao24', async (req, res) => {
  const icao24 = req.params.icao24.toLowerCase();
  const statesUrl = 'https://opensky-network.org/api/states/all';
  const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 hours ago
  const twelveHoursAgoTimestamp = Math.floor(twelveHoursAgo.getTime() / 1000); // 12 hours ago timestamp in seconds
  const flightsUrl = `https://opensky-network.org/api/flights/aircraft?icao24=${icao24}&begin=${twelveHoursAgoTimestamp}&end=${currentTimestamp}`;

  try {


    const statesResponse = await axios.get(statesUrl);
    const statesData = statesResponse.data;

    const flightsResponse = await axios.get(flightsUrl);
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
    

    res.json(flightInfo);
  } catch (error) {
    console.error('Error retrieving flight data:', error);
    res.status(500).json({ error: 'An error occurred while retrieving flight data' });
  }
});

module.exports = router;
