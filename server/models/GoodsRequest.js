const mongoose = require('mongoose');

const goodsRequestSchema = new mongoose.Schema({
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GoodsDelivery',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemDetails: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('GoodsRequest', goodsRequestSchema);
