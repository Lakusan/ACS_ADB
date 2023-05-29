const mongoose = require('mongoose');

const flightStatusReqSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true
  },
  departureCity: {
    type: String,
    required: true
  },
  arrivalCity: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: Date,
    required: true
  },
  gate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

const FlightStatusReq = mongoose.model('FlightStatusReq', flightStatusReqSchema);

module.exports = FlightStatusReq;
