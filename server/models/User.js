const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // only for normal login
  googleId: { type: String }, // for Google login later
  role: {
    type: String,
    enum: ['user', 'captain'],
    default: 'user',
  },
  phone: String,
  profilePicture: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);
