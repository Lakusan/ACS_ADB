const router = require('express').Router();
const neo4j = require('neo4j-driver');
const { MongoClient } = require('mongodb');


const databaseName = 'test'; 
const collectionName = 'airports';
const uri = process.env.MONGODB_CONNECT
const client = new MongoClient(uri);



//find nearest airport based on the given point on mongodb

const maxDistance = 300;
  async function findNearestAirports(longitude, latitude) {
    try {
      await client.connect();
      const database = client.db(databaseName);
      const collection = database.collection(collectionName);
      const geoPoint = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
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
          $limit: 1,
        },
        {
          $project: {
            _id: 0,
            name: 1,
            icao: 1,
            iata: 1,
            city: 1,
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




async function calculateDistance(icao1, icao2) {
    const driver = neo4j.driver(process.env.NEO4J_CONNECT, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));
    const query = `
      MATCH (a1:Airport {icao: $icao1})
      MATCH (a2:Airport {icao: $icao2})
      WITH a1, a2,
           point({ x: a1.location.x, y: a1.location.y, crs: a1.location.crs }) AS point1,
           point({ x: a2.location.x, y: a2.location.y, crs: a2.location.crs }) AS point2
      RETURN point.distance(point1, point2)/1000 as kmDistance, a1, a2
    `;
    const session = driver.session();
    try {
      const result = await session.run(query, { icao1, icao2 });
      const record = result.records[0];
      const kmDistance = record.get('kmDistance');
      const airport1 = record.get('a1');
      const airport2 = record.get('a2');
      return {origin: airport1, destination:airport2, kmDistance, ...estimateFlight(kmDistance)};


    } catch (error) {
      throw error;
    } finally {
      session.close();
      driver.close();
    }
  }
  

function estimateFlight(distanceInKm){
  
// Range of Airbus A320neo in kilometers
const aircraftRange = 6000;
// Average speed 
const groundSpeed = 800;
const climbTime = 15;
const descentTime = 20;
// Fuel consumption rate in liters per hour 
const fuelConsumptionRate = 2500;
// Average fuel burn factor 
const fuelBurnFactor = 0.8;

// Calculate the flight time in minutes
const flightTime = (distanceInKm / groundSpeed) * 60 + climbTime + descentTime;

// Calculate fuel consumption in liters
const fuelConsumption = (flightTime / 60) * fuelConsumptionRate * fuelBurnFactor;


const fuelPriceInEuros = 0.543;
const fuelCost = fuelConsumption * fuelPriceInEuros;

let flightStatus;
if (distanceInKm <= aircraftRange) {
  flightStatus = 'Direct flight is possible.';
} else {
  const numberOfStops = Math.ceil(distanceInKm / aircraftRange);
  flightStatus = `Stops are required. Total stops: ${numberOfStops}.`;
}

const hours = Math.floor(flightTime / 60);
const minutes = Math.round(flightTime % 60);

return {flightStatus, hours, minutes, fuelConsumption, fuelCost};
}

router.get('/route/:latitude0/:longitude0/:latitude1/:longitude1',  async (req,res) => {


  /*
    Origin Location: latitide0, longitude0 -> i have to create a point from this
    Destination Location: latitude1, longitude1 -> another point needed

  */

try{
    const latitude0 = parseFloat(req.params.latitude0);
    const longitude0 = parseFloat(req.params.longitude0);

    const latitude1 = parseFloat(req.params.latitude1);
    const longitude1 = parseFloat(req.params.longitude1);
    //find the nearest airport to the given point - origin
    const airport1 = await findNearestAirports(longitude0, latitude0);
    //find the nearest airport to the given point - destination
    const airport2 = await findNearestAirports(longitude1, latitude1);

    //calculate the distance between the two airports
    calculateDistance(airport1[0].icao, airport2[0].icao)
    .then(ret => {

    res.json(ret)
    })
    .catch(error => {
      console.error('Error:', error);
      res.json(error);
    });
}
catch(error){
  console.log(error);
  res.json(error);
}



 


});

module.exports = router;