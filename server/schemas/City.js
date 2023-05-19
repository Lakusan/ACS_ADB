const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  // Other necessary details specific to your flight tracking application
});

const City = mongoose.model('City', citySchema);

module.exports = City;
