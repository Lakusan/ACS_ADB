//Import Libraries
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const {Server} = require('socket.io');

// DB imports
const neo4j = require('neo4j-driver');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

// socket.io server config
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ["GET", "POST"]
//   }
// });
// Services 
const FlightDataRTPubService = require('./services/FlightDataRTPubService');
const FlightDataRTSubService = require('./services/FlightDataRTSubService');
const IO = require('./services/SocketServer');
const EventListener = require('./services/EventListener');

// nodjs server configuration
dotenv.config();
const SERVER_PORT = process.env.SERVER_PORT;

//Import Routes
const testRoute = require('./routes/test');
const opensky = require('./routes/opensky');
const flightRadar = require('./routes/flightRadar');

//Middleware
app.use(express.json());
// cors allow origin all
app.use(cors({
  origin: '*',
}));

//Route Middlewares
app.use('/api', testRoute);
app.use('/api', opensky);
app.use('/api', flightRadar);

//Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECT, {
  useNewUrlParser: true,
  
  useUnifiedTopology: true,
});
const db = mongoose.connection;
// Event handlers for connection success and error
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

//Connect to neo4J
const neo4jDriver = neo4j.driver(process.env.NEO4J_CONNECT, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));
const neo4jSession = neo4jDriver.session();

neo4jDriver.verifyConnectivity()
.then(() => {
  console.log('Connected to Neo4j');
})
.catch((error) => {
  console.error('Neo4j connection error:', error);
});

//Listen Server
server.listen(SERVER_PORT, () => console.log(`Server is running on PORT: ${SERVER_PORT}`));
//docker run -d -p 6379:6379 --name myredis --network redisnet redis

// attach socket.io server to app to get access to this instance from other modules
// app.set('socketio', io);

// start socket server
const io = IO.getInstance();
io.initialize(server);
// Start Services for Flight Radar
// gets data from API and publishes it on redis pub/sub channel -> ENV: REDIS_PUB_FLIGHT_RADAR
const flightDataRTPubService = FlightDataRTPubService.getInstance();
// subscribes to redis pub sub subscriber and gets data from topic.
const flightDataRTSubService = FlightDataRTSubService.getInstance();
const eventListener = new EventListener(flightDataRTSubService, flightDataRTPubService, io);
// Eventlistener: on message in redis channel triggers socket emit with data
flightDataRTPubService.collectRTDataFromAPI();
flightDataRTSubService.connect(process.env.REDIS_PUB_FLIGHT_RADAR);




//Socket IO
  
//   io.on("connection", (socket) => {
//     console.log(`User Connected: ${socket.id}`);
//     socket.on("send_message", (data) => {
//     console.log(data);
//   });
// });

module.exports.app = app;
