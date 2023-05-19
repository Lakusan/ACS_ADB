const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // Other necessary details specific to your flight tracking application
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;