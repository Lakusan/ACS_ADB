const { MongoClient } = require('mongodb');
const neo4j = require('neo4j-driver');


// MongoDB connection
const mongoURI = '';
const dbName = '';
const countriesCollectionName = '';
const airportsCollectionName = '';

// Neo4j connection
const neoURI = '';
const neoUser = '';
const neoPassword = '';



async function importData() {
  // Connect to MongoDB
  const mongoClient = await MongoClient.connect(mongoURI, { useUnifiedTopology: true });
  const mongoDb = mongoClient.db(dbName);
  const airportsCollection = mongoDb.collection(airportsCollectionName);
  const countriesCollection = mongoDb.collection(countriesCollectionName);

  // Connect to Neo4j
  const neoDriver = neo4j.driver(neoURI, neo4j.auth.basic(neoUser, neoPassword));
  const neoSession = neoDriver.session();

  try {
    // Retrieve airport records from MongoDB
    const airportRecords = await airportsCollection.find().toArray();

    for (const airport of airportRecords) {
      const country = await countriesCollection.findOne({ _id: airport.country });

      await neoSession.run(
        `
        CREATE (a:Airport { airport_id: $airport_id, name: $name, city: $city, altitude: $altitude, location: point({latitude: $latitude, longitude: $longitude}), iata: $iata, icao: $icao })
        WITH a
        MERGE (c:Country { country_id: $country_id, name: $country_name })
        CREATE (a)-[:BELONGS_TO]->(c)
        `,
        {
          airport_id: airport.airport_id,
          name: airport.name,
          city: airport.city,
          altitude: airport.altitude,
          latitude: airport.location.coordinates[1],
          longitude: airport.location.coordinates[0],
          iata: airport.iata,
          icao: airport.icao,
          country_id: country._id.toString(),
          country_name: country.name,
        }
      );
    }

    console.log('Data imported successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    // Close connections
    await mongoClient.close();
    await neoSession.close();
    await neoDriver.close();
  }
}

// Run the importData function
importData();