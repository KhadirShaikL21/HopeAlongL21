const express = require('express');
const router = express.Router();
const {
  createDelivery,
  getDeliveries,
  updateDelivery,
  deleteDelivery,
  searchDeliveries
} = require('../controllers/goodsController');
const verifyToken = require('../middleware/authMiddleware');


// Only captains can post, update, delete deliveries
router.post('/', verifyToken, createDelivery);
router.get('/', getDeliveries);
router.get('/search', searchDeliveries);
router.put('/:id', verifyToken, updateDelivery);
router.delete('/:id', verifyToken, deleteDelivery);

module.exports = router;
