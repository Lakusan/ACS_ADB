const router = require('express').Router();
const { MongoClient } = require('mongodb');


const databaseName = 'test'; 
const collectionName = 'airports';


const uri = process.env.MONGODB_CONNECT
const client = new MongoClient(uri);


const maxDistance = 300;
  async function findNearestAirports(longitude, latitude) {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
  
      const database = client.db(databaseName);
      const collection = database.collection(collectionName);
  
      // Create the GeoJSON point
      const geoPoint = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
  
      // Find the nearest airports using the $geoNear aggregation
      const pipeline = [
        {
          $geoNear: {
            near: geoPoint,
            distanceField: 'distance',
            spherical: true,
            query: { type: 'airport' },
            maxDistance: maxDistance * 1000,
          },
        },
        {
          $limit: 5,
        },
        {
          $project: {
            _id: 0,
            name: 1,
            distance: { $divide: ['$distance', 1000] }, 
          },
        },
      ];
  
      // Execute the aggregation pipeline
      const result = await collection.aggregate(pipeline).toArray();
    
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
      return error
    } finally {
      await client.close();
    }
  }


router.get('/airports/:latitude/:longitude',  async (req,res) => {
    const latitude = parseFloat(req.params.latitude);
    const longitude = parseFloat(req.params.longitude);
  

    try {

        const result = await findNearestAirports(longitude, latitude);
        res.json(result);
   

    } catch (error) {
        console.error('An error occurred:', error);
         res.send(error)
      }

});

module.exports = router;
const express = require('express');
const router = express.Router();
const Airport = require('../models/airport');


// Defining the route handler for /api/airports
router.get('/airports', async (req, res) => {
  try {
    const airports = await Airport.find();
    res.json(airports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch airports' });
  }
});

module.exports = router;
