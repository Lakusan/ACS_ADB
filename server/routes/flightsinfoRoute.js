const express = require('express');
const router = express.Router();
const FlightsInfo = require('../models/flightsinfo'); 

router.get('/flightsinfo', async (req, res) => {
  try {
    const flights = await FlightsInfo.find(); 
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

module.exports = router;
