
const express = require('express');
const router = express.Router();
const Airport = require('../models/airport');


// Defining the route handler for /api/airports
router.get('/airports', async (req, res) => {
  try {
    const airports = await Airport.find();
    res.json(airports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch airports' });
  }
});

module.exports = router;
