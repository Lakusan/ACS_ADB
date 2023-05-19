const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  coords: {
    lat: {
      type: String,
      required: true
    },
    lon: {
      type: String,
      required: true
    }
  },
  name: {
    type: String,
    required: true,
    index: true // Create an index on the "name" field
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true
  }
});

const City = mongoose.model('City', citySchema);

module.exports = City;
