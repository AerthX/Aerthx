const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema({
  userType: { type: String, enum: ["Individual", "Organization"], required: true },
  project: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  quantity: { type: Number },
  timeline: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
