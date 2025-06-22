const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const rideRequestController = require('../controllers/rideRequestController');

router.post('/request', verifyToken, rideRequestController.requestRide);
router.put('/respond/:id', verifyToken, rideRequestController.respondToRequest);
router.get('/my-requests', verifyToken, rideRequestController.getUserRideRequests);
router.get('/captain', verifyToken, rideRequestController.getCaptainRideRequests);

module.exports = router;
