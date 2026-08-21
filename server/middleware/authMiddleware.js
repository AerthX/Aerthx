const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization");

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace(/^Bearer\s+/i, "");


      
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const org = await Organization.findById(decoded.id).select("-password");

    if (!org) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    req.user = {
      id: org._id,
      orgName: org.orgName,
      email: org.email,
      role: org.role,
      userType: "Organization",
    };

    next();
  } catch (err) {
    console.error("Organization auth error:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = verifyToken;