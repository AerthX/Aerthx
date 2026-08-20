const express = require("express");
const router = express.Router();
const multer = require("multer");

const { getProfile, updateProfile } = require("../controllers/profileController");
const verifyToken = require("../middleware/authMiddleware");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/profile", verifyToken, getProfile);

router.put(
  "/profile",
  verifyToken,
  upload.single("avatar"),
  updateProfile
);

module.exports = router;