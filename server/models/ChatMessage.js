const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'tripModel' }, 
  tripModel: { type: String, required: true, enum: ['Ride', 'GoodsDelivery'] }, // discriminates type
  sender: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
