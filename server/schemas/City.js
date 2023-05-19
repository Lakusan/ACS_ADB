const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  area: {
    type: String,
    required: true,
  },
  coords: {
    lat: {
      type: String,
      required: true,
    },
    lon: {
      type: String,
      required: true,
    },
  },
  district: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  population: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

const City = mongoose.model('City', citySchema);

module.exports = City;
