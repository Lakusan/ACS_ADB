const router = require('express').Router();
const Redis = require('ioredis');
const flightDataRTSubService = require('../services/FlightDataRTSubService');


router.get('/flights/radar', async (req, res) => {
    // io.on("connection", (socket) => {
    //     console.log(`User Connected: ${socket}`);
    //     socket.on("send_message", (data) => {
    //         console.log(data);
    //         console.log("!!! DATA");
    //     });
    // });
    res.send("OK");
});

router.get('/flights/radar/subscribe', (req, res) => {

    const subscriber = new Redis();
    const channel = process.env.REDIS_PUB_FLIGHT_RADAR;
    const io = req.app.get('socketio');

    subscriber.subscribe(channel, (err) => {
        if (err) {
            console.error(`subscription to ${channel} failed successfully`);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(`New REDIS Subscriber to ${channel}`);
            subscriber.on('message', (channel, message) => {
                io.on('connection', (socket) => {
                    socket.emit('send_message', message);
                })
            })
        }
    });

    //   redisSubscriber.subscribe(process.env.REDIS_PUB_FLIGHT_RADAR);

    //   redisSubscriber.on('message', (channel, message) => {
    //     // console.log(`Received message on channel '${channel}': ${message}`);
    //     console.log("message send");
    //   });

    // SSE (Server-Sent Events)
    //   res.setHeader('Content-Type', 'text/event-stream');
    //   res.setHeader('Cache-Control', 'no-cache');
    //   res.setHeader('Connection', 'keep-alive');
    //   res.flushHeaders();

    // keep-alive every 5 seconds
    //   const keepAliveInterval = setInterval(() => {
    //     res.write(': keep-alive\n\n');
    //   }, 5000);

    //   // hjandle client disconnects
    //   req.on('close', () => {
    //     redisSubscriber.unsubscribe('myChannel');
    //     clearInterval(keepAliveInterval);
    //   });
    // const data = flightDataRTSubService.redisSubscriber();
    // const jsonData = JSON.parse(data);

    // Socket IO
    // io.on('connection', (socket) => {
    //   console.log("---> Client connected to Socket");
    //   io.emit("Hello from socket.io");
    // });

    res.send("jsonData");
});

module.exports = router;