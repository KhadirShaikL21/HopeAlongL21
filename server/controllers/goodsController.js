const GoodsDelivery = require('../models/GoodsDelivery');
const GoodsRequest = require('../models/GoodsRequest');
const User = require('../models/User');
const sendNotification = require('../utils/sendNotification');

// POST /api/goods - Captain creates a delivery trip
exports.createDelivery = async (req, res) => {
  try {
    const { from, to, date, availableSpace, description, price } = req.body;

    const newDelivery = new GoodsDelivery({
      captain: req.user.id, // from token
      from,
      to,
      date,
      availableSpace,
      price,
      description,
    });

    await newDelivery.save();
    res.status(201).json({ msg: "Delivery trip created", delivery: newDelivery });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// GET /api/goods - Get all delivery trips
exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await GoodsDelivery.find().populate('captain', 'name email');
    res.status(200).json({ deliveries });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// PUT /api/goods/:id - Update a delivery (only by owner)
exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await GoodsDelivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ msg: "Delivery not found" });

    if (delivery.captain.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    const updated = await GoodsDelivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ msg: "Delivery updated", delivery: updated });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// GET /api/goods/search?from=CityX&to=CityY
// GET /api/goods/search?from=&to=&priceType=&price=&space=
// GET /api/goods/search?from=&to=&priceType=&price=&space=&date=&limit=&page=
exports.searchDeliveries = async (req, res) => {
  try {
    const {
      from,
      to,
      priceType,
      price,
      space,
      date,
      limit = 10,
      page = 1
    } = req.query;

    const query = {};

    // Location
    if (from) query.from = { $regex: from, $options: 'i' };
    if (to) query.to = { $regex: to, $options: 'i' };

    // Price
    if (price && priceType) {
      if (priceType === 'gte') query.price = { $gte: price };
      else if (priceType === 'lte') query.price = { $lte: price };
      else if (priceType === 'eq') query.price = Number(price);
    }

    // Available Space
    if (space) query.availableSpace = space;

    // Date (only show trips on or after a date)
    if (date) query.date = { $gte: new Date(date) };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const deliveries = await GoodsDelivery.find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('captain', 'name email');

    res.status(200).json({ count: deliveries.length, deliveries });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// DELETE /api/goods/:id - Delete a delivery (only by owner)
exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await GoodsDelivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ msg: "Delivery not found" });

    if (delivery.captain.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    // Cancel all related requests and notify users
    const requests = await GoodsRequest.find({ delivery: delivery._id });
    for (const reqObj of requests) {
      reqObj.status = "cancelled";
      await reqObj.save();
      const user = await User.findById(reqObj.user);
      await sendNotification(
        user._id,
        `Your goods delivery request for ${delivery.from} → ${delivery.to} was cancelled because the delivery was deleted.`,
        req.app,
        user.email
      );
    }

    await delivery.deleteOne();
    res.status(200).json({ msg: "Delivery deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
