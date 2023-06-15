const { setDriver } = require("mongoose");

class EventListener {
    constructor(redisSubscriber, redisPublisher, socketServer) {

        // Redis Subscriber Events: connected, disconnected, redis_sub: data reveived
        this.redisSubscriber = redisSubscriber;
        // Redis Publisher Events: idle, fetching, publishing, sleeping
        this.redisPublisher = redisPublisher;
        // socketServer Events: disconnected, user connected, socket: data, user disconnected
        this.socketServer = socketServer;

        // bindings
        this.onRedisSubConnected = this.onRedisSubConnected.bind(this);
        this.onRedisSubDisconnected = this.onRedisSubDisconnected.bind(this);
        this.onRedisSubData = this.onRedisSubData.bind(this);

        this.onRedisPubIdle = this.onRedisPubIdle.bind(this);
        this.onRedisPubFetching = this.onRedisPubFetching.bind(this);
        this.onRedisPubPublishing = this.onRedisPubPublishing.bind(this);
        this.onRedisPubSleeping = this.onRedisPubSleeping.bind(this);

        this.onSocketServerDisconnected = this.onSocketServerDisconnected.bind(this);    
        this.onSocketServerUserConnected = this.onSocketServerUserConnected.bind(this);    
        this.onSocketServerData = this.onSocketServerData.bind(this);    
        this.onSocketServerUserDisconnected = this.onSocketServerUserDisconnected.bind(this);    
        
        // Register event listeners
        this.redisSubscriber.on('connected', this.onRedisSubConnected);
        this.redisSubscriber.on('disconnected', this.onRedisSubDisconnected);
        this.redisSubscriber.on('redis_sub: data reveived', this.onRedisSubData);

        this.redisPublisher.on('idle', this.onRedisPubIdle);
        this.redisPublisher.on('fetching', this.onRedisPubFetching);
        this.redisPublisher.on('publishing', this.onRedisPubPublishing);
        this.redisPublisher.on('sleeping', this.onRedisPubSleeping);

        this.socketServer.on('disconnected', this.onSocketServerDisconnected);
        this.socketServer.on('user connected', this.onSocketServerUserConnected);
        this.socketServer.on('socket: data', this.onSocketServerData);
        this.socketServer.on('user disconnected', this.onSocketServerUserDisconnected);

    }

    // subscriber

    onRedisSubConnected() {
        console.log('EVENT: Redis Subsciber connection is now established');
    }

    onRedisSubDisconnected() {
        console.log('EVENT: Redis Subsciber is now disconnected');
    }

    onRedisSubData(data) {
        if(data){
            console.log('EVENT: Data on Subscriber received!');
            this.socketServer.io.emit('message', data);
        } else {
            console.log('EVENT: NO! Data on Subscriber received!');
        }
    }

    // publisher

    onRedisPubIdle() {
        console.log('EVENT: Redis Publisher Idle');
    }

    onRedisPubFetching() {
        console.log('EVENT: Redis Publisher Fetching');
    }

    onRedisPubPublishing() {
        console.log('EVENT: Redis Publisher Publishing');
    }

    onRedisPubSleeping() {
        console.log('EVENT: Redis Publisher Sleeping');
    }

    // Socket Server 
    onSocketServerDisconnected() {
        console.log('EVENT: Socket Server disconnected');
    }

    onSocketServerUserConnected() {
        console.log('EVENT: Socket Server User Connected');
    }

    onSocketServerData() {
        console.log('EVENT: Socket Server Data');
    }

    onSocketServerUserDisconnected() {
        console.log('EVENT: Socket Server User Disconnected');
    }
}

module.exports = EventListener;
