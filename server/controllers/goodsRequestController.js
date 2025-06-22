const GoodsRequest = require('../models/GoodsRequest');
const GoodsDelivery = require('../models/GoodsDelivery');
const sendNotification = require('../utils/sendNotification');
const User = require('../models/User');

// User requests delivery
exports.createRequest = async (req, res) => {
  try {
    const { deliveryId, itemDetails } = req.body;

    const delivery = await GoodsDelivery.findById(deliveryId).populate('captain');
    if (!delivery) return res.status(404).json({ msg: "Delivery trip not found" });

    const newRequest = new GoodsRequest({
      delivery: deliveryId,
      user: req.user.id,
      itemDetails,
    });

    await newRequest.save();

    // Use delivery.captain (populated)
    await sendNotification(
      delivery.captain._id,
      `New goods delivery request from ${req.user.name}`,
      req.app,
      delivery.captain.email
    );

    res.status(201).json({ msg: "Goods request sent", request: newRequest });
    

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Captain approves or rejects
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const request = await GoodsRequest.findById(req.params.id).populate('user').populate('delivery');
    if (!request) return res.status(404).json({ msg: "Request not found" });

    // Only captain of the delivery can respond
    if (request.delivery.captain.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    request.status = status;
    await request.save();

    // Send notification to user
    const user = await User.findById(request.user._id);
    const message = `Your goods delivery request for ${request.delivery.from} → ${request.delivery.to} on ${request.delivery.date} was ${status}.`;
    await sendNotification(user._id, message, req.app, user.email);

    res.json({ msg: "Request updated", request });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};



// Get all requests for deliveries of the logged-in captain
exports.getRequestsForCaptain = async (req, res) => {
  try {
    // Find all requests where delivery's captain is the logged-in user
    const requests = await GoodsRequest.find()
      .populate({
        path: 'delivery',
        match: { captain: req.user.id }
      })
      .populate('user', 'name email');

    // Filter out requests where delivery is null (because match failed)
    const filteredRequests = requests.filter(r => r.delivery !== null);

    res.status(200).json({ requests: filteredRequests });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get all requests made by the logged-in user
exports.getRequestsForUser = async (req, res) => {
  try {
    const requests = await GoodsRequest.find({ user: req.user.id })
      .populate('delivery')
      .populate('user', 'name email');

    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
