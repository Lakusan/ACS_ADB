const router = require('express').Router();
const axios = require('axios');
const { get } = require('mongoose');
const redis = require('redis');
const MongoClient = require('mongodb').MongoClient;

const url = `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`;
const redisClient = redis.createClient({
  url
});
const redisClientListen = redis.createClient({
  url
});



//Functions to get data from mongodb (airport info)
//get airport info

async function getAirportInformation(iataCode) {
  const client = new MongoClient(process.env.MONGODB_CONNECT, { useUnifiedTopology: true });

  try {
    await client.connect();

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
    client.close();
  }
}






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


router.get('/opensky/airportInfo/:iata', async (req, res) => {
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
