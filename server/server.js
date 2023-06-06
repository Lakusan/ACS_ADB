//Import Libraries
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const {Server} = require('socket.io');

// DB imports
const neo4j = require('neo4j-driver');
const redis = require('redis');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

// Services 
const FlightDataRTPubService = require('./services/FlightDataRTPubService');
const flightDataRTSubService = require('./services/FlightDataRTSubService');
const redisServices = require('./services/redisServices');

//Configuration
dotenv.config();
const SERVER_PORT = process.env.SERVER_PORT;

//Import Routes
const testRoute = require('./routes/test');
const opensky = require('./routes/opensky');
const flightRadar = require('./routes/flightRadar');

//Middleware
app.use(express.json());
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

// Start Services for Flight Radar
const flightDataRTPubService = new FlightDataRTPubService("flight radar");
flightDataRTPubService.collectRTDataFromAPI();
//Socket IO
// WORKS
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("send_message", (data) => {
  console.log(data);
  });
});
//  app.io = io;
// app.use( function ( req, res, next){
//   req.io = io;
//   next();
// })
app.set('socketio', io);

module.exports.app = app;
