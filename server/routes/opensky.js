const router = require('express').Router();
const axios = require('axios');
const { get } = require('mongoose');
const redis = require('redis');
const MongoClient = require('mongodb').MongoClient;

const url = `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`;
const redisClient = redis.createClient({
  url
});

//Functions to get data from mongodb (airport info)
//get airport info

async function getAirportInformation(iataCode) {
  const client = new MongoClient(process.env.MONGODB_CONNECT, { useUnifiedTopology: true });
  client.connect();

  try {

    const db = client.db(process.env.MONGODB_DB_NAME);
    const airportsCollection = db.collection('airports');

    const airportInfo = await airportsCollection.findOne({ iata: iataCode });
    if (!airportInfo) {
      throw new Error('Airport not found');
    }

    const airportWithInformation = {
      name: airportInfo.name,
      iata: airportInfo.iata,
      icao: airportInfo.icao,
      location: airportInfo.location,
      city: airportInfo.city
    };

    return airportWithInformation;
  } finally {
    console.log("--> OPENSKY: Close MongoDB");
    client.close();
  }
}


router.get('/opensky/flights/:iata', async (req, res) => {
  const iata = req.params.iata.toLowerCase();
  console.log("/opensky/flights/:iata");
  
  if (redisClient.isOpen){
    console.log("REDIS IS OPEN")
  } else {
    redisClient.connect();
    redisClient.on('connection', () => console.log('--> OPENSKY:; Connected to REDIS'));
  }
  //check if data exists in redis
  redisClient.on('error', err => console.log('Redis error: ', err.message));
  const value = await redisClient.get(`flight_info:${iata}`);
  if (value) {
    const cachedData = JSON.parse(value);
    // redisClient.quit();
    console.log('--> AVIATIONSTACK: REDIS Disconnect checking data');
    res.status(200).json({ data: cachedData, source: 'redis' });
    return;
  }

  try {
    console.log('--> AVIATIONSTACK: GETTING DATA FROM API');
    const response = await axios.get(`http://api.aviationstack.com/v1/flights`, {
      params: {
        access_key: process.env.AVISTACK_API_KEY,
        flight_iata: iata
      }
    });

    redisClient.setEx(`flight_info:${iata}`, 60 * 15, JSON.stringify(response.data.data)); // Cache for 15 min    
    // redisClient.quit();
    console.log('--> AVIATIONSTACK: REDIS Disconnect at the end');


    res.json({ data: response.data.data, source: "api" });


  } catch (error) {
    console.error('Error retrieving flight data:', error);
    res.status(500).json({ error: 'An error occurred while retrieving flight data' });
  }
});


router.get('/opensky/airportInfo/:iata', async (req, res) => {
  console.log("/opensky/airportInfo/:iata");
try{

  const iata = req.params.iata.toUpperCase();

  getAirportInformation(iata)
  .then(airportInfo => {
    res.json(airportInfo);
  }
  )
  .catch(error => {
    console.error('Error retrieving airport data:', error);
    res.status(500).json({ error: 'An error occurred while retrieving airport data' });
  }
  );


}catch(error){
  console.error('Error retrieving airport data:', error);
  res.status(500).json({ error: 'An error occurred while retrieving airport data' });
}
});




module.exports = router;
