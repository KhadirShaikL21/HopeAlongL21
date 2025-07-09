const Notification = require('../models/Notification');
const sendEmailNotification = require('./sendEmailNotification');

// Add email as a parameter
const sendNotification = async (userId, message, app, email) => {
  try {
    const notif = new Notification({ user: userId, message });
    await notif.save();

    const io = app.get('io');
    const userSocketMap = app.get('userSocketMap');

    const socketId = userSocketMap[userId];
    if (socketId && io) {
      io.to(socketId).emit('new_notification', {
        message,
        timestamp: notif.createdAt,
      });
    }

    // Only send email if email is provided
    if (email) {
      await sendEmailNotification(email, 'New Notification from HopeAlong', message);
    }
  } catch (err) {
    console.error("❌ Notification error:", err.message);
  }
};

module.exports = sendNotification;
