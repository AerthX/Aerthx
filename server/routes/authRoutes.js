const express = require("express");
const router = express.Router();
const { sendOtp, resetPassword, refreshTokenHandler,   logoutHandler } = require("../controllers/authController");
const { changePassword } = require("../controllers/changePasswordController");
const verifyIndividual = require("../middleware/individualAuthMiddleware");
const verifyToken = require("../middleware/authMiddleware");
const { sendRegisterOtp, verifyRegisterOtp } = require("../controllers/otpController"); 


router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword);
router.post("/change-password/individual", verifyIndividual, changePassword);
router.post("/change-password/organization", verifyToken, changePassword);
router.post("/send-register-otp", sendRegisterOtp);
router.post("/verify-otp", verifyRegisterOtp);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logoutHandler);

module.exports = router;
