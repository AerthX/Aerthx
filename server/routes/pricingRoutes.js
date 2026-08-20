const express = require("express");
const router = express.Router();

const { getPricing } = require("../controllers/pricingController");

// GET /api/pricing
router.get("/", getPricing);

module.exports = router;