const jwt = require("jsonwebtoken");
const Individual = require("../models/Individual");
const Organization = require("../models/Organization");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userType = decoded.userType || (decoded.role === "organization" ? "Organization" : "Individual");

    let user;
    if (userType === "Organization") {
      user = await Organization.findById(decoded.id).select("-password");
    } else {
      user = await Individual.findById(decoded.id).select("-password");
    }

    if (!user) return res.status(401).json({ message: "User not found or account is no longer active" });

    req.user = {
      id: user._id,
      email: user.email,
      userType,
      role: user.role || (user.isAdmin ? "admin" : (userType === "Organization" ? "organization" : "individual")),
      fullName: user.fullName,
      orgName: user.orgName,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
