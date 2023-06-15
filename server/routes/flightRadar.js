const router = require('express').Router();
const Redis = require('ioredis');
const flightDataRTSubService = require('../services/FlightDataRTSubService');


router.get('/flights/radar', async (req, res) => {
    res.send("OK");
});

router.get('/flights/radar/subscribe', (req, res) => {
    const subscriber = new Redis();
    const channel = process.env.REDIS_PUB_FLIGHT_RADAR;
    const io = req.app.get('socketio');

    subscriber.subscribe(channel, (err) => {
        if (err) {
            console.error(`subscription to ${channel} failed`);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(`New REDIS Subscriber to ${channel}`);
            subscriber.on('message', (channel, message) => {
                console.log(`----> New MESSAGE on ${channel}`);
                io.on('connection', (socket) => {
                    console.log("----> send Message");
                    socket.emit('send_message', message);
                })
            })
        }
    });

    res.send("jsonData");
});

module.exports = router;