const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  createRide,
  getAllRides,
  updateRide,
  deleteRide,
  searchRides,
  getMyOfferedRides,
  getRideById,
  completeRide,
  startRide
} = require('../controllers/rideController.js');

// POST /api/rides - Create a new ride (captain only)
router.post('/', verifyToken, createRide);

// GET /api/rides - List all rides
router.get('/', getAllRides);

// GET /api/rides/search - Search rides
router.get('/search', searchRides);

// PUT /api/rides/:id - Update a ride
router.put('/:id', verifyToken, updateRide);

// DELETE /api/rides/:id - Delete a ride
router.delete('/:id', verifyToken, deleteRide);

// GET /api/rides/my-offered - Get rides offered by the logged-in captain
router.get('/my-offered', verifyToken, getMyOfferedRides);

// GET /api/rides/:id - Get a single ride by ID
router.get('/:id', getRideById);

// POST /api/rides/:rideId/start - Start a ride with OTP verification
router.post('/:id/start', verifyToken, startRide);

// POST /api/rides/:id/complete - Mark a ride as complete
router.post('/:id/complete', verifyToken, completeRide);

module.exports = router;
