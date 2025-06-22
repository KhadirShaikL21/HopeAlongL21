const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

// GET all notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching notifications", error: err.message });
  }
});

// Mark as read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ msg: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating notification", error: err.message });
  }
});


router.patch('/:id/read', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ error: 'Notification not found' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
