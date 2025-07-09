const express = require('express');
const router = express.Router();
const ChatRoom = require('../models/ChatRoom');
const verifyToken = require('../middleware/authMiddleware');

// GET chat room details by roomId
router.get('/:roomId', verifyToken, async (req, res) => {
  const { roomId } = req.params;
  try {
    const chatRoom = await ChatRoom.findOne({ roomId });
    if (!chatRoom) return res.status(404).json({ error: 'Chat room not found' });
    res.json(chatRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// You can add POST/PUT endpoints for creating/updating chat rooms as needed

module.exports = router;
