const bcrypt = require("bcryptjs");
const Individual = require("../models/Individual");
const Organization = require("../models/Organization");
const RefreshToken = require("../models/RefreshToken");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    const user = (await Individual.findOne({ email })) || (await Organization.findOne({ email }));
    if (!user) return res.status(401).json({ message: "Invalid admin credentials." });

    const allowed = user.role === "admin" || user.isAdmin === true;
    if (!allowed) return res.status(403).json({ message: "This account is not an admin account." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid admin credentials." });

    const userType = user.orgName ? "Organization" : "Individual";
    const accessToken = generateAccessToken({ _id: user._id, email: user.email, role: "admin", userType });
    const refreshToken = generateRefreshToken({ _id: user._id });
    await RefreshToken.create({ userId: user._id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

    return res.json({
      message: "Admin login successful",
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.fullName || user.orgName, email: user.email, role: "admin", userType }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginAdmin };
