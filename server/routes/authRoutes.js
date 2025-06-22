const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe, updateProfile } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
