//Satish
const router = require('express').Router();
// Import the FlightStatusReq model TODO: Why do you import that, if you don't use it? AL
const FlightStatusReq = require('../models/FlightStatusReq');
const Flight = require('../models/Flight');

// GET route for fetching all flight details
router.get('/flights', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    console.error('Error querying flights:', error);
    res.status(500).send('An error occurred');
  }
});

// POST route for fetching flight details based on search criteria
router.post('/flights/search', async (req, res) => {
  const { departureAirport, arrivalAirport, date } = req.body;

  try {
    const flights = await Flight.find({
      departureCity: departureAirport,
      arrivalCity: arrivalAirport,
      operatingDays: { $in: [getDayOfWeek(date)] }
    });

    res.json(flights);
  } catch (error) {
    console.error('Error querying flights:', error);
    res.status(500).send('An error occurred');
  }
});

// Helper function to get the day of the week for a given date
function getDayOfWeek(date) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = new Date(date).getDay();
  return daysOfWeek[dayIndex];
}


module.exports = router;