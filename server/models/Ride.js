const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  // departureTime: {
  //   type: String,
  //   required: true
  // },
  seatsAvailable: {
    type: Number,
    required: true
  },
  costPerSeat: {
    type: Number,
    required: true
  },
  vehicleType: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  otp: Number,
  status: { type: String, default: "pending" }, // pending, started, completed
  source: { lat: Number, lng: Number },
  destination: { lat: Number, lng: Number },
});

module.exports = mongoose.model('Ride', rideSchema);
