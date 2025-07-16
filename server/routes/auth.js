const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// @route   GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    // Create JWT token for the user
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Create user data object
    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    };
    
    // Redirect to frontend with token as URL parameter
    const redirectUrl = `${process.env.FRONTEND_URL}?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
    res.redirect(redirectUrl);
  }
);

module.exports = router;
