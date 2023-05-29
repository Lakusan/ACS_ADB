const express = require('express');
const dotenv = require('dotenv');
const path = require('path');



dotenv.config();
const app = express();

const CLIENT_PORT = process.env.CLIENT_PORT || 80;

// Route Middlewares
//app.use(express.static('public'));
// Serve the static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(CLIENT_PORT, () => console.log(`Client is listening on port ${CLIENT_PORT}!`));