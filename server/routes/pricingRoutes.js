const express = require("express");
const router = express.Router();

const { getPricing } = require("../controllers/pricingController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getPricing);

module.exports = router;