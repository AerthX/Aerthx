const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  userType: {
    type: String,
    enum: ["individual", "organization"],
    default: "individual",
  },

  plan: {
    type: String,
    required: true,
  },

  duration: {
    type: String,
    required: true,
  },

  paymentMethod: {
    type: String,
    enum: ["card", "upi", "netbanking", "unknown"],
  },

  razorpay_payment_id: String,
  razorpay_order_id: String,

  startDate: {
    type: Date,
    default: Date.now,
  },

  endDate: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["active", "expired", "suspended"],
    default: "active",
  },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);