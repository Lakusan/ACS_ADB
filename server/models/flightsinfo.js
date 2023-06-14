const mongoose = require('mongoose');

const flightsinfoSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  flight: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    callsign: {
      type: String,
      required: true,
    },
    iata: {
      type: String,
      required: true,
    },
    altitude: {
      type: Number,
      required: true,
    },
    heading: {
      type: Number,
      required: true,
    },
    groundspeed: {
      type: Number,
      required: true,
    },
    dep_scheduled: {
      type: String,
      required: true,
    },
    dep_actual: {
      type: String,
      required: true,
    },
    arr_scheduled: {
      type: String,
      required: true,
    },
    arr_estimated: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  airline: {
    icao: {
      type: String,
      required: true,
    },
    iata: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  aircraft: {
    reg: {
      type: String,
      required: true,
    },
    photo1: {
      type: String,
      required: true,
    },
    photo2: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
  },
  dep_airport: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    icao: {
      type: String,
      required: true,
    },
    iata: {
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
    timezone_abbr: {
      type: String,
      required: true,
    },
    timezone_name: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    },
  },
  arr_airport: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    icao: {
      type: String,
      required: true,
    },
    iata: {
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
    timezone_abbr: {
      type: String,
      required: true,
    },
    timezone_name: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    },
  },
  source: {
    type: String,
    required: true,
  },
  station: {
    type: String,
    required: true,
  },
});

const Flight = mongoose.model('Flight', flightsinfoSchema);

module.exports = Flight;
