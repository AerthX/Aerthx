const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { createOrder,  verifyPayment,  getMySubscription, getMyCertificates } = require("../controllers/paymentController");

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify", authMiddleware, verifyPayment);
router.get("/subscription/:userId", authMiddleware, getMySubscription);
router.get("/my-certificates/:userId", authMiddleware, getMyCertificates);

module.exports = router;