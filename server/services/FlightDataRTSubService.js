const redisConnector = require('./redisServices');
require('dotenv').config();
const { EventEmitter } = require('events');

// class handles redis subsciption
// singleton
// state machine
// Events: connected, disconnected, redis_sub: data reveived

class FlightDataRTSubService extends EventEmitter {

    // singleton
    static getInstance() {
        if (!FlightDataRTSubService.instance) {
            FlightDataRTSubService.instance = new FlightDataRTSubService();
            return FlightDataRTSubService.instance;
        }
    }

    constructor(channel) {
        super();
        this.channel = null;
        this.subscriber = null;
        this.state = 'disconnected';
    }

    connect(channel) {
        if (this.state === 'disconnected') {
            this.channel = channel;
            this.subscriber = redisConnector.redisConnector();


            this.subscriber.subscribe(channel, (message) => {
                if (channel === this.channel) {
                    this.handleMessage(message);
                }
            });

            this.state = 'connected';
            this.emit('connected');
        }
    }

    handleMessage(message) {
        this.emit('redis_sub: data reveived', message);
    }

    disconnect() {
        if (this.state === 'connected') {
            this.subscriber.unsubscribe();
            this.subscriber.quit();
            this.channel = null;
            this.subscriber = null;
            this.state = 'disconnected';
            this.emit('disconnected');
        }
    }
};


module.exports = FlightDataRTSubService;
