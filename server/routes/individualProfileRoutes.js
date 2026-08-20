const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  getIndividualProfile,
  updateIndividualProfile,
} = require("../controllers/individualProfileController");

const verifyIndividualToken = require("../middleware/individualAuthMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/profile", verifyIndividualToken, getIndividualProfile);

router.put(
  "/profile",
  verifyIndividualToken,
  upload.single("avatar"),
  updateIndividualProfile
);

module.exports = router;