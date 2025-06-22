const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');
const User = require('../models/User');
const sendNotification = require('../utils/sendNotification');
const axios = require("axios");

exports.createRide = async (req, res) => {
  try {
    console.log("Create ride called");
    const {
      from, to, date, time, seatsAvailable, costPerSeat, vehicleType, notes
    } = req.body;
    console.log("Request body:", req.body);

    // Geocode addresses
    const geocode = async (address) => {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
      const response = await axios.get(url);
      if (
        response.data.status === "OK" &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        return response.data.results[0].geometry.location; // { lat, lng }
      }
      throw new Error("Geocoding failed for: " + address);
    };

    const source = await geocode(from);
    const destination = await geocode(to);
    console.log("Geocoded:", { source, destination });

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Check req.user
    console.log("req.user:", req.user);

    // Create ride
    const ride = new Ride({
      captain: req.user ? req.user.id : null,
      from,
      to,
      date,
      time,
      seatsAvailable,
      costPerSeat,
      vehicleType,
      notes,
      source,
      destination,
      otp,
      status: "pending"
    });

    console.log("Ride to save:", ride);

    await ride.save();
    res.status(201).json({ message: 'Ride posted successfully', ride });
  } catch (error) {
    console.log("Error in createRide:", error);
    res.status(500).json({ message: 'Error creating ride', error: error.message });
  }
};


exports.getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find().populate('captain', 'name email'); // optional: show captain info
    res.status(200).json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rides', error: err.message });
  }
};



exports.updateRide = async (req, res) => {
  try {
    const rideId = req.params.id;
    const userId = req.user.id;

    const ride = await Ride.findById(rideId);

    if (!ride) return res.status(404).json({ msg: "Ride not found" });
    if (ride.captain.toString() !== userId) return res.status(403).json({ msg: "Not authorized" });

    const updatedRide = await Ride.findByIdAndUpdate(rideId, req.body, { new: true });
    res.status(200).json(updatedRide);
  } catch (err) {
    res.status(500).json({ msg: "Error updating ride", error: err.message });
  }
};



// GET /api/rides/search?from=CityA&to=CityB
// GET /api/rides/search
// GET /api/rides/search?from=&to=&priceType=&price=&seats=&date=&limit=&page=
exports.searchRides = async (req, res) => {
  try {
    const {
      from,
      to,
      priceType,
      price,
      seats,
      date,
      limit = 10,
      page = 1
    } = req.query;

    const query = {};

    // Location
    if (from) query.from = { $regex: from, $options: 'i' };
    if (to) query.to = { $regex: to, $options: 'i' };

    // Price filter
    if (price && priceType) {
      if (priceType === 'gte') query.price = { $gte: price };
      else if (priceType === 'lte') query.price = { $lte: price };
      else if (priceType === 'eq') query.price = Number(price);
    }

    // Seats filter
    if (seats) query.seatsAvailable = { $gte: parseInt(seats) };

    // Date filter
    if (date) query.date = { $gte: new Date(date) };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const rides = await Ride.find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('captain', 'name email');

    res.status(200).json({ count: rides.length, rides });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};



// Get rides offered by the logged-in captain
exports.getMyOfferedRides = async (req, res) => {
  try {
    const rides = await Ride.find({ captain: req.user.id }).populate('captain', 'name email');
    res.status(200).json(rides);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching offered rides", error: err.message });
  }
};



// DELETE /api/rides/:id - Delete a ride (captain only)
exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ msg: "Ride not found" });

    if (ride.captain.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    // Update all requests to cancelled and notify users
    const requests = await RideRequest.find({ ride: ride._id });
    for (const reqObj of requests) {
      reqObj.status = "cancelled";
      await reqObj.save();
      const user = await User.findById(reqObj.user);
      await sendNotification(
        user._id,
        `Your ride request for ${ride.from} → ${ride.to} was cancelled because the ride was deleted.`,
        req.app,
        user.email
      );
    }

    await ride.deleteOne();
    res.json({ msg: "Ride deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// GET /api/rides/:id - Get a single ride by ID
exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('captain', 'name email');
    if (!ride) return res.status(404).json({ msg: "Ride not found" });
    res.status(200).json({ ride });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


exports.completeRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    // Optionally, check if the user is the captain
    if (ride.captain.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    ride.status = "completed";
    await ride.save();
    res.json({ message: "Ride marked as completed" });
  } catch (error) {
    res.status(500).json({ message: "Error completing ride", error: error.message });
  }
};


exports.startRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.captain.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    // Optionally, check OTP here if you want
    ride.status = "started";
    await ride.save();
    res.json({ message: "Ride started" });
  } catch (error) {
    res.status(500).json({ message: "Error starting ride", error: error.message });
  }
};