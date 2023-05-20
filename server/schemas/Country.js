const mongoose = require('mongoose');

// Define the schema
const countriesSchema = new mongoose.Schema({
  name: String,
  iso_code: String,
  dafif_code: String
});

// Create the model
const Country = mongoose.model('Data', countriesSchema);

module.exports = Country;
