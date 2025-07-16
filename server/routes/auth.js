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
    
    // Redirect to frontend with token as URL parameter
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }))}`);
  }
);

module.exports = router;
