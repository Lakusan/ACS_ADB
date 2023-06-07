const router = require('express').Router();
const neo4j = require('neo4j-driver');



async function calculateDistance(icao1, icao2) {
    // Create a Neo4j driver instance
    const driver = neo4j.driver(process.env.NEO4J_CONNECT, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));
  
    // Define the Neo4j query with parameters
    const query = `
      MATCH (a1:Airport {icao: $icao1})
      MATCH (a2:Airport {icao: $icao2})
      WITH a1, a2,
           point({ x: a1.location.x, y: a1.location.y, crs: a1.location.crs }) AS point1,
           point({ x: a2.location.x, y: a2.location.y, crs: a2.location.crs }) AS point2
      RETURN point.distance(point1, point2)/1000 as kmDistance, a1, a2
    `;
  
    // Create a session to run the query
    const session = driver.session();
  
    try {
      // Run the query with parameters
      const result = await session.run(query, { icao1, icao2 });
  
      // Process the result
      const record = result.records[0];
      const kmDistance = record.get('kmDistance');
      const airport1 = record.get('a1');
      const airport2 = record.get('a2');


      return {airport1, airport2, kmDistance};
    } catch (error) {
      throw error;
    } finally {
      // Close the session and driver
      session.close();
      driver.close();
    }
  }
  



router.get('/route/:airport1/:airport2',  async (req,res) => {
    const airport1 = (req.params.airport1).toUpperCase();
    const airport2 = (req.params.airport2).toUpperCase();
    calculateDistance(airport1, airport2)
  .then(ret => {
   res.json(ret)
  })
  .catch(error => {
    console.error('Error:', error);
    res.json(error);
  });


});

module.exports = router;