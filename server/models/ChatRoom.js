const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'tripModel' },
  tripModel: { type: String, required: true, enum: ['Ride', 'GoodsDelivery'] },
  createdAt: { type: Date, default: Date.now },
  // Optionally, add participants, name, etc.
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
