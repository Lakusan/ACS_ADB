const router = require('express').Router();
// Import the FlightStatusReq model
const FlightStatusReq = require('../models/FlightStatusReq');

// GET route for fetching all flight details
router.get('/api/flights', async (req, res) => {
  try {
    const flights = await FlightStatusReq.find();
    res.json(flights);
  } catch (error) {
    console.error('Error querying flights:', error);
    res.status(500).send('An error occurred');
  }
});

// POST route for fetching flight details based on search criteria
router.post('/api/flights/search', async (req, res) => {
  const { date, departureAirport, arrivalAirport } = req.body;

  try {
    const flights = await FlightStatusReq.find({
      departureCity: departureAirport,
      arrivalCity: arrivalAirport,
      departureTime: {
        $gte: new Date(date + 'T00:00:00'),
        $lt: new Date(date + 'T23:59:59')
      }
    });

    res.json(flights);
  } catch (error) {
    console.error('Error querying flights:', error);
    res.status(500).send('An error occurred');
  }
});


module.exports = router;