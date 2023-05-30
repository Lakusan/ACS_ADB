//Import Libraries
const express = require('express');
const cors = require('cors');

const dotenv = require('dotenv');

const neo4j = require('neo4j-driver');
const redis = require('redis');
const mongoose = require('mongoose');




//Configuration
const app = express();
dotenv.config();
const SERVER_PORT = process.env.SERVER_PORT;



//Import Routes
const testRoute = require('./routes/test');



//Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    
}));
//Route Middlewares
app.use('/api', testRoute);


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

//Connect to Redis
const url = `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`;
const redisClient = redis.createClient({
  url,
  password: `${process.env.REDIS_PASSWORD}`
});

const startRedisClient = async () => {
    await new Promise((resolve, reject) => {
      redisClient.on('connect', () => {
        console.log('Connected to Redis');
        resolve();
      });
  
      redisClient.on('error', (error) => {
        reject(error);
      });
    });
  
    try {
      const result = await pingAsync();
      console.log('Redis ping result:', result);
    } catch (error) {
      console.error('Redis ping error:', error);
    } finally {
      await quitAsync();
      console.log('Redis connection closed');
    }
  };
// startRedisClient();
redisClient.connect();
redisClient.on('error', err => console.log('Redis error: ', err.message));
redisClient.on('connect', () => console.log('Connected to redis server'));

/// WORKS
const val = 'hello12';

redisClient.set('key', val, function(err) {  
  if (err) {
    throw err
  } else {
    console.log("REDIS SET OK");
  }
})
.then(console.log("DONE"));


// redisClient.get('key', function(err, value) {
//   if (err) {
//     throw err
//   }
//   // assert.equal(value, val);
//   console.log('it works!');
//   redisClient.quit();
//   console.log("REDIS QUIT")
// });

//Listen Server
app.listen(SERVER_PORT, () => console.log(`Server is running on PORT: ${SERVER_PORT}`));

module.exports = app;