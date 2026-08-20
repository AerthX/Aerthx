const express = require("express");
const router = express.Router();
const { registerOrganization } = require("../controllers/orgAuthController");
const { loginOrganization } = require("../controllers/authController");

router.post("/register", registerOrganization);
router.post("/login", loginOrganization);


module.exports = router;
