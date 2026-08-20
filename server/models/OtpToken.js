const mongoose = require("mongoose");

const otpTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now, expires: 300 } 
});

module.exports = mongoose.model("OtpToken", otpTokenSchema);
