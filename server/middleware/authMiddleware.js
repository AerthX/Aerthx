const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const org = await Organization.findById(decoded.id).select("-password");


    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    req.user = {
      id: org._id,
      orgName: org.orgName,
      email: org.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
