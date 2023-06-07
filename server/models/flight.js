const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  airline: {
    type: String,
    required: true,
  },

  flightNumber: {
    type: String,
    required: true,
  },

  departureCity: {
    type: String,
    required: true,
  },

  arrivalCity: {
    type: String,
    required: true,
  },

  departureTime: {
    type: Date,
    required: true,
  },

  arrivalTime: {
    type: Date,
    required: true,
  },

  gate: {
    type: String,
    required: true,
  },

  operatingDays: {
    type: [String],
    required: true,
  },

  status: {
    type: String,
    required: true,
  },

});



const Flight = mongoose.model('Flight', flightSchema);



module.exports = Flight;