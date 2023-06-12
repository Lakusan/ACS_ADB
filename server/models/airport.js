

const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  airport_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  iata: {
    type: String,
    required: true,
  },
  icao: {
    type: String,
    required: true,
  },
  altitude: {
    type: String,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
  dst: {
    type: String,
    required: true,
  },
  tz_database_timezone: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

const Airport = mongoose.model('Airport', airportSchema);

module.exports = Airport;
