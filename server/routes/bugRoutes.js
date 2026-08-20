const express = require("express");
const BugReport = require("../models/BugReport.js");
const Individual = require("../models/Individual.js");
const Organization = require("../models/Organization.js");
const authMiddleware = require("../middleware/auth.js");
const router = express.Router();

router.post("/bugs", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    let reporterName = "Unknown User";
    let userType = req.user.userType || "Individual";

    if (userType === "Individual") {
      const user = await Individual.findById(req.user.id);
      if (user) reporterName = user.fullName;
    } else if (userType === "Organization") {
      const user = await Organization.findById(req.user.id);
      if (user) reporterName = user.orgName;
    }

    const bug = await BugReport.create({
      title,
      description,
      reporterName,
      userType,
      userId: req.user.id,
    });

    res.status(201).json({ message: "Bug report saved", bug });
  } catch (err) {
    console.error("Error saving bug report:", err);
    res.status(500).json({ message: "Error saving bug report" });
  }
});

module.exports = router;
