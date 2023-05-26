const router = require('express').Router();
const axios = require('axios');






//test
router.get('/opensky',  async (req,res) => {
  
    const url = 'https://opensky-network.org/api/states/all';

    // Optional parameters
    const parameters = {
        lomin: -24,      // Minimum longitude for Europe
        lomax: 40,       // Maximum longitude for Europe
        lamin: 35,       // Minimum latitude for Europe
        lamax: 71        // Maximum latitude for Europe
    };
  
    axios.get(url, { params: parameters })
      .then(response => {
        const data = response.data;
  
        // Extract flight information
        const flights = data.states.map(flight => ({
          icao24: flight[0],                    // Unique ICAO24 aircraft address
          callsign: flight[1],                  // Callsign
          originCountry: flight[2],             // Country of origin
          longitude: flight[5],                 // Longitude
          latitude: flight[6],                  // Latitude
          altitude: flight[7]                   // Altitude in meters
        }));
  
        res.json(flights);
      })
      .catch(error => {
        res.status(500).json({ error: 'An error occurred while retrieving flight data' });
      });
   

});

module.exports = router;