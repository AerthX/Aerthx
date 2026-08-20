const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
};

const {
  getIndividualPricing,
  updateIndividualPricing,
  deleteIndividualPricing,
  resetIndividualPricing,
} = require("../controllers/individualPricingController");

router.get("/", getIndividualPricing);
router.post("/", authMiddleware, requireAdmin, updateIndividualPricing);
router.delete("/", authMiddleware, requireAdmin, deleteIndividualPricing);
router.post("/reset", authMiddleware, requireAdmin, resetIndividualPricing);

module.exports = router;