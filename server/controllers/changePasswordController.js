const bcrypt = require("bcryptjs");
const Individual = require("../models/Individual");
const Organization = require("../models/Organization");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

const changePassword = async (req, res) => {
  const { currentPassword, newPassword} = req.body;
  const userId = req.user.id;

  try {
  const userType = req.originalUrl.includes("organization")
  ? "Organization"
  : "Individual";

    const Model = userType === "Organization" ? Organization : Individual;

    const user = await Model.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password." });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

 await Notification.create({
  userId: userId,
  userType: userType.charAt(0).toUpperCase() + userType.slice(1), 
  title: "Your password has been changed",
  message: `This is to confirm that your password was successfully changed.

If you did not initiate this change, please contact our support team immediately to secure your account.`,
  timestamp: new Date(),
  read: false,
});


    await sendEmail({
      to: user.email,
      subject: "🔒 AerthX Password Change Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <h2 style="color: #2f855a;">Password Changed</h2>
          <p>Hi ${user.fullName || user.orgName},</p>
          <p>This is to confirm that your AerthX account password has been successfully changed.</p>
          <p>If this was not you, please reset your password immediately or contact our support team.</p>
          <br/>
          <p>Stay secure,</p>
          <p><strong>The AerthX Team 🌱</strong></p>
        </div>
      `,
    });

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Password Change Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { changePassword };
