const mongoose = require("mongoose");

const bugReportSchema = new mongoose.Schema(
  {
    title: { type: [String], required: true },
    description: { type: String, required: true },
    reporterName: { type: String, required: true },
    userType: {
      type: String,
      enum: ["Individual", "Organization"], 
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userType", 
      required: true,
    },
    seen: { type: Boolean, default: false },
    star: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high", null],
      default: null,
    },
    assignedAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Individual", 
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BugReport", bugReportSchema);
