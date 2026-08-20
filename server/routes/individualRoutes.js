const express = require("express");
const router = express.Router();
const {
  registerIndividual,
  loginIndividual,
} = require("../controllers/individualAuthController");
const { sendRegisterOtp, verifyRegisterOtp } = require("../controllers/otpController");

router.post("/register", registerIndividual);
router.post("/login", loginIndividual);
router.post("/verify-otp", verifyRegisterOtp);
router.post("/send-register-otp", sendRegisterOtp);

module.exports = router;
