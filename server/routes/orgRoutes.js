const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const { registerOrganization } = require("../controllers/orgAuthController");
const { loginOrganization, sendOtp, resetPassword } = require("../controllers/authController");
const { getProfile, updateProfile } = require("../controllers/profileController");
const { sendRegisterOtp, verifyRegisterOtp } = require("../controllers/otpController");

const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", registerOrganization);
router.post("/login", loginOrganization);

router.get("/profile", verifyToken, getProfile);

router.put("/profile", verifyToken, upload.single("avatar"), updateProfile);

router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyRegisterOtp);
router.post("/send-register-otp", sendRegisterOtp);

module.exports = router;