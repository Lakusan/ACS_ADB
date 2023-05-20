// Import required libraries
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });


// Connection URI

const uri = process.env.MONGODB_CONNECT // Replace with your MongoDB connection string

// MongoDB database and collection names
const databaseName = 'test'; // Replace with your database name
const collectionName = 'airports'; // Replace with your collection name

// Specify the latitude and longitude of the coordinate
// Uskudar, Istanbul Turkey
const latitude = 41.022809636921075
const longitude =29.02077515458944;


// Maximum distance in kilometers
const maxDistance = 500;

const client = new MongoClient(uri);

async function findNearestAirports() {
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
          maxDistance: maxDistance * 1000, // Convert kilometers to meters
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          name: 1,
          distance: { $divide: ['$distance', 1000] }, // Convert meters to kilometers
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await collection.aggregate(pipeline).toArray();

    console.log('Nearest airports:');
    console.log(result);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Call the findNearestAirports function
findNearestAirports();