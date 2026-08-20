const Organization = require("../models/Organization");
const { uploadToImageKit } = require("../utils/imagekit");

const getProfile = async (req, res) => {
  try {
    const org = await Organization.findById(req.user.id).select("-password");
    if (!org) return res.status(404).json({ message: "Organization not found" });

    res.json({ org }); 
  } catch (err) {
    console.error("Error in getProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedData = {};
    const allowedFields = [
      "orgName", "orgType", "industry", "website", "phone", "fullName", 
      "country", "state", "city", "about", "description", "designation"
    ];

    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== "") {
        updatedData[key] = req.body[key];
      }
    });
if (req.file && req.file.buffer) {
  const result = await uploadToImageKit(
    req.file.buffer,
    `org_${userId}_${Date.now()}`,
    "/organizations"
  );

  updatedData.avatarUrl = result.url;
} else {
  console.log("❌ No file buffer received:", req.file);
}

    const updatedProfile = await Organization.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


module.exports = { getProfile, updateProfile };
