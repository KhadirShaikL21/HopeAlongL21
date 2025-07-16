const express = require("express");
const passport = require("passport");
const router = express.Router();

// @route   GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`, // frontend login
    successRedirect: `${process.env.FRONTEND_URL}/`, // frontend dashboard
  })
);

module.exports = router;
