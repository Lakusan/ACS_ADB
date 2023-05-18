const express = require('express');
const dotenv = require('dotenv');




dotenv.config();
const app = express();

const CLIENT_PORT = process.env.CLIENT_PORT || 80;

// Route Middlewares
app.use(express.static('public'));

app.listen(CLIENT_PORT, () => console.log(`Client is listening on port ${CLIENT_PORT}!`));