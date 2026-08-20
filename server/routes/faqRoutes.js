const express = require("express");
const FAQ = require("../models/FAQ");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ success: false, error: "Admin access required" });
  next();
};

router.get("/", async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json({ success: true, faqs });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.post("/", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    const faq = new FAQ({ question, answer, category });
    await faq.save();
    res.status(201).json({ success: true, faq });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
