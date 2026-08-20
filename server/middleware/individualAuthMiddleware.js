const jwt = require("jsonwebtoken");
const Individual = require("../models/Individual");

const verifyIndividual = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const individual = await Individual.findById(decoded.id).select("-password");

    if (!individual) {
      return res.status(404).json({ message: "Individual not found" });
    }

    req.user = {
      id: individual._id,
      fullName: individual.fullName,
      email: individual.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyIndividual;
