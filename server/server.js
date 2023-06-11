//Import Libraries
const express = require('express');
const cors = require('cors');

const dotenv = require('dotenv');

const neo4j = require('neo4j-driver');
const redis = require('redis');
const mongoose = require('mongoose');
const redisClient = require('./redisClient');




//Configuration
const app = express();
dotenv.config();
const SERVER_PORT = process.env.SERVER_PORT;



//Import Routes
const testRoute = require('./routes/test');
const opensky = require('./routes/opensky');
const flightStatus = require('./routes/flights');
const airports = require('./routes/airports');
const route = require('./routes/route');


//Middleware
app.use(express.json());
app.use(cors());
//Route Middlewares
app.use('/api', testRoute);
app.use('/api', opensky);
app.use('/api', flightStatus);
app.use('/api/', airports);
app.use('/api/', route);


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
app.listen(SERVER_PORT, () => console.log(`Server is running on PORT: ${SERVER_PORT}`));
//docker run -d -p 6379:6379 --name myredis --network redisnet redis
module.exports.app = app;

