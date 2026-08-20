const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userType",
    required: true,
  },
  userType: {
    type: String,
    enum: ["Individual", "Organization"],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

notificationSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
