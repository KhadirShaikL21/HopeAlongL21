const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const verifyToken = require('../middleware/authMiddleware'); // your auth middleware

// GET chat history for a trip
router.get('/:tripId', verifyToken, async (req, res) => {
  const { tripId } = req.params;
  try {
    const messages = await ChatMessage.find({ tripId }).populate('sender', 'name email');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new chat message
router.post('/:tripId', verifyToken, async (req, res) => {
  const { tripId } = req.params;
  const { message, tripModel } = req.body; // tripModel: 'Ride' or 'GoodsDelivery'
  try {
    if (!message || !tripModel) {
      return res.status(400).json({ error: 'Message and tripModel are required' });
    }

    const chatMsg = new ChatMessage({
      tripId,
      tripModel,
      sender: req.user._id,
      message,
    });

    await chatMsg.save();

    // Emit message to recipient via socket
    const io = req.app.get('io');
    const userSocketMap = req.app.get('userSocketMap');

    // This example assumes you store trip participants somewhere, you should get the other user's ID
    // For demo, just emit to all connected sockets
    io.emit('newChatMessage', chatMsg);

    res.status(201).json(chatMsg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
