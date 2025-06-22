const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  createRequest,
  updateRequestStatus,
  getRequestsForCaptain,
  getRequestsForUser
} = require('../controllers/goodsRequestController');

router.post('/', verifyToken, createRequest);
router.put('/:id/status', verifyToken, updateRequestStatus);
router.get('/captain', verifyToken, getRequestsForCaptain);
router.get('/user', verifyToken, getRequestsForUser);

module.exports = router;
