const express = require('express');
const router = express.Router();

// Test cookie endpoint
router.post('/test-cookie', (req, res) => {
  // Set a simple test cookie
  res.cookie('test', 'working', {
    httpOnly: false, // Make it accessible via JavaScript for testing
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 60000 // 1 minute
  });
  
  res.json({ message: 'Test cookie set' });
});

// Get test cookie
router.get('/test-cookie', (req, res) => {
  const testCookie = req.cookies.test;
  res.json({ testCookie, allCookies: req.cookies });
});

module.exports = router;
