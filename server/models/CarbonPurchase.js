const mongoose = require("mongoose");

const carbonPurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userType",
    },

    userType: {
      type: String,
      enum: ["individual", "organization"],
      required: true,
    },

    // 👤 USER INFO (snapshot for audit)
    userName: String,
    userEmail: String,

    // 🌱 PROJECT INFO
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarbonProject",
      required: true,
    },
    projectName: String,

    // 📦 PURCHASE DETAILS
    tonsBought: {
      type: Number,
      required: true,
    },

    pricePerTon: {
      type: Number,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    platformFee: Number,
    gatewayFee: Number,
    gst: Number,

    totalAmountPaid: {
      type: Number,
      required: true,
    },

    // 💳 PAYMENT
    paymentMethod: String,
    razorpay_payment_id: String,
    razorpay_order_id: String,

    // 📊 STATUS
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    certificateId:{ type: String, unique: true },
certificateUrl: String,
issuedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarbonPurchase", carbonPurchaseSchema);