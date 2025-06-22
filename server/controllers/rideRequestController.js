const RideRequest = require('../models/RideRequest');
const Ride = require('../models/Ride');
const sendNotification = require('../utils/sendNotification');
const User = require('../models/User');

// User requests to join a ride
exports.requestRide = async (req, res) => {
  try {
    const { rideId, seatsRequested } = req.body;

    const foundRide = await Ride.findById(rideId);
    if (!foundRide) return res.status(404).json({ msg: "Ride not found" });

    const newRequest = new RideRequest({
      ride: rideId,
      user: req.user.id,
      seatsRequested,
    });

    await newRequest.save();

    // Send notification to the captain (if needed)
    await sendNotification(foundRide.captain, `New ride request from ${req.user.name}`);

    res.status(201).json({ msg: "Ride request sent", request: newRequest });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Captain approves or rejects a request
exports.respondToRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const request = await RideRequest.findById(req.params.id).populate('user').populate('ride');
    if (!request) return res.status(404).json({ msg: "Request not found" });

    // Only captain of the ride can respond
    if (request.ride.captain.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    request.status = status;
    await request.save();

    // Send notification to user
    const user = await User.findById(request.user._id);
    const message = `Your ride request for ${request.ride.from} → ${request.ride.to} on ${request.ride.date} was ${status}.`;
    await sendNotification(user._id, message, req.app, user.email);

    res.json({ msg: "Request updated", request });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// User gets their ride requests
exports.getUserRideRequests = async (req, res) => {
  try {
    const requests = await RideRequest.find({ user: req.user.id }).populate('ride');
    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Captain sees requests on their rides
exports.getCaptainRideRequests = async (req, res) => {
  try {
    const requests = await RideRequest.find()
      .populate({
        path: 'ride',
        match: { captain: req.user.id },
      })
      .populate('user');

    const filtered = requests.filter(req => req.ride); // Remove ones not matching captain
    res.status(200).json({ requests: filtered });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
