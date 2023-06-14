const express = require('express');
const router = express.Router();
const FlightInfo = require('../models/FlightInfo');

router.get('/flightsinfo', async (req, res) => {
  try {
    const flights = await FlightInfo.find();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

module.exports = router;