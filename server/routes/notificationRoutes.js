const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

const verifyIndividual = require("../middleware/individualAuthMiddleware");
const verifyToken = require("../middleware/authMiddleware");

router.get("/individual", verifyIndividual, async (req, res) => {
  try {
    const notifications = await Notification.find({
           userId: req.user.id,
      userType: "Individual",
    }).sort({ timestamp: -1 });

    res.json({ notifications });
  } catch (error) {
    console.error("Fetch Individual Notifications Error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.get("/organization", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
      userType: "Organization",
    }).sort({ timestamp: -1 });

    res.json({ notifications });
  } catch (error) {
    console.error("Fetch Organization Notifications Error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.post("/mark-read", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { userType } = req.body;

    await Notification.updateMany(
      { userId, userType, read: false },
      { $set: { read: true } }
    );

    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Mark Notifications Read Error:", error);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
});


router.post("/mark-one/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Notification.findByIdAndUpdate(
      id,
      { $set: { read: true } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read", notification: updated });
  } catch (error) {
    console.error("Mark single notification error:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});

module.exports = router;
