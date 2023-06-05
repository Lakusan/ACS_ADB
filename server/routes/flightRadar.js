const router = require('express').Router();
const FlightDataRTPubService = require('../services/FlightDataRTPubService');

router.get('/flights/radar', async (req, res) => {
    const flightDataRTPubService = new FlightDataRTPubService("flight radar");
    const dataJson = flightDataRTPubService.parseAPIData('states/all');
    res.send(dataJson);
    // res.send("DATA");
});

module.exports = router;