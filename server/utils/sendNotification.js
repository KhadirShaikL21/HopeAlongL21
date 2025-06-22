const Notification = require('../models/Notification');
const sendEmailNotification = require('./sendEmailNotification');

const sendNotification = async (userId, message, app) => {
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

     if(email) {
      await sendEmailNotification(email, 'New Notification from HopeAlong', message);
    }
        

  } catch (err) {
    console.error("❌ Notification error:", err.message);
  }
};

module.exports = sendNotification;
