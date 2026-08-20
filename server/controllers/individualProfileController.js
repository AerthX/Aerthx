const Individual = require("../models/Individual");
const { uploadToImageKit } = require("../utils/imagekit");

const getIndividualProfile = async (req, res) => {
  try {
    const user = await Individual.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Individual not found" });
    
    res.json({ user }); 
  } catch (err) {
    console.error("Error in getIndividualProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateIndividualProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedData = {};
    const allowedFields = [
      "fullName", "country", "state", "city", "phone", 
      "designation", "about", "description"
    ];

    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== "") {
        updatedData[key] = req.body[key];
      }
    });

 if (req.file) {
  const fileBuffer = req.file.buffer;

  const result = await uploadToImageKit(
    fileBuffer,
    `user_${userId}_${Date.now()}`,
    "/users"
  );

  updatedData.avatarUrl = result.url;
}

    const updatedUser = await Individual.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Individual not found" });
    }

    res.status(200).json({ user: updatedUser }); 
  } catch (err) {
    console.error("Error updating individual:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


module.exports = {
  getIndividualProfile,
  updateIndividualProfile,
};
