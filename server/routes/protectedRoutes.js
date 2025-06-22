// routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

// Test protected route for all authenticated users
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.id}, you have access to your profile!`,
  });
});

module.exports = router;
