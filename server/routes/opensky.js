const router = require('express').Router();
const axios = require('axios');

// test
router.get('/opensky/:flightNumber?', async (req, res) => {
  const url = 'https://opensky-network.org/api/states/all';

  const flightNumber = req.params.flightNumber || '';

  axios
    .get(url)
    .then(response => {
      const data = response.data;

      // Extract flight information and filter by flight number if provided
      const flights = data.states
        .map(flight => ({
          icao24: flight[0],
          callsign: flight[1].replace(/\s/g, ''), // Remove spaces from the flight call number
          originCountry: flight[2],
          longitude: flight[5],
          latitude: flight[6],
          altitude: flight[7]
        }))
        .filter(flight => flightNumber === '' || flight.callsign === flightNumber);

      res.json(flights);
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred while retrieving flight data' });
    });
});

module.exports = router;
