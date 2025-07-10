const express = require("express");
const passport = require("passport");
const router = express.Router();

// @route   GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login", // frontend login
    successRedirect: "http://localhost:5173/", // frontend dashboard
  })
);

module.exports = router;
