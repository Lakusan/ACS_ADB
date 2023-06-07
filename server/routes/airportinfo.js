const express = require('express');
const router = express.Router();
const AirportInfo = require('../models/AirportInfo');

 

// Defining the route handler for /api/flights
router.get('/flights', async (req, res) => {
  try {
    const airport = req.query.airport;
    const flights = await AirportInfo.find({ departureAirport: airport });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

 

module.exports = router;