const mongoose = require('mongoose');

const goodsDeliverySchema = new mongoose.Schema({
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: Date, required: true },
  availableSpace: { type: String }, // "Small", "Medium", "Large"
  price: { type: Number, required: true },
  description: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('GoodsDelivery', goodsDeliverySchema);
