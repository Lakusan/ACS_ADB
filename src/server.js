//Import Libraries
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const dotenv = require('dotenv');
const cors = require('cors');


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


const uri = process.env.DB_CONNECT;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);




//Listen Server
app.listen(SERVER_PORT, () => console.log(`Server is running on PORT: ${SERVER_PORT}`));

module.exports = app;
