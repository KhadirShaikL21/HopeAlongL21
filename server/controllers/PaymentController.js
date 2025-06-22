const Razorpay = require("razorpay");

exports.createOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const { amount } = req.body; // amount in rupees
    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await instance.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Payment order error", error: err.message });
  }
};