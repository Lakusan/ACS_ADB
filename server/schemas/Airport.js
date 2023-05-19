const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  iataCode: {
    type: String,
    required: true,
    unique: true,
  },
  icaoCode: {
    type: String,
    required: true,
    unique: true,
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
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  // Other necessary details specific to your flight tracking application
});

airportSchema.index({ location: '2dsphere' });

const Airport = mongoose.model('Airport', airportSchema);

module.exports = Airport;
