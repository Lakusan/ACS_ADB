const Redis = require('ioredis');
require('dotenv').config();
const io = require('socket.io');

module.exports.redisSubscriber = function() {

    const subscriber = new Redis();
    const channel = process.env.REDIS_PUB_FLIGHT_RADAR;
    
    subscriber.subscribe(channel, (err) => {
        if (err) {
            console.error(`subscription to${channel} failed successfully`);
        }
    });
}

