const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  // Other necessary details specific to your flight tracking application
});

const State = mongoose.model('State', stateSchema);

module.exports = State;
