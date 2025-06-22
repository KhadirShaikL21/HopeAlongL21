const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/PaymentController.js");

router.post("/create-order", createOrder);

module.exports = router;