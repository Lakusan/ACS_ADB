//Import Libraries
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


//Configuration
const app = express();
dotenv.config();
mongoose.set('strictQuery', true);
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


//Connect to Database
mongoose.connect(process.env.DB_CONNECT)


//Listen Server
app.listen(SERVER_PORT, () => console.log(`Server is running on PORT: ${SERVER_PORT}`));

module.exports = app;
