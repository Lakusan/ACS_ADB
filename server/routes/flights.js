const router = require('express').Router();
// Import the FlightStatusReq model
const FlightStatusReq = require('../models/FlightStatusReq');

// GET route for fetching all flight details
router.get('/flights', async (req, res) => {
  try {
    const flights = await FlightStatusReq.find();
    res.json(flights);
  } catch (error) {
    console.error('Error querying flights:', error);
    res.status(500).send('An error occurred');
  }
});

// POST route for fetching flight details based on search criteria
router.post('/flights/search', async (req, res) => {
  const { departureAirport, arrivalAirport } = req.body;

  try {
    const flights = await FlightStatusReq.find({
      departureCity: departureAirport,
      arrivalCity: arrivalAirport
    });

    res.json(flights);
  } catch (error) {
    console.error('Error querying flights:', error);
    res.status(500).send('An error occurred');
  }
});


module.exports = router;