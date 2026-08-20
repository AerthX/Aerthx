const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const OtpToken = require("../models/OtpToken");
const Individual = require("../models/Individual");
const Organization = require("../models/Organization");
const Notification = require("../models/Notification");
const RefreshToken = require("../models/RefreshToken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

const loginOrganization = async (req, res) => {
  try {
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    const org = await Organization.findOne({ email });
    if (!org) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, org.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }


const accessToken = generateAccessToken({
  _id: org._id,
  email: org.email,
  role: "organization",
  userType: "Organization",
});

const refreshToken = generateRefreshToken({
  _id: org._id,
});

await RefreshToken.create({
  userId: org._id,
  token: refreshToken,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});

res.status(200).json({
  message: "Login successful",
  accessToken,
  refreshToken,
  org: {
    id: org._id,
    orgName: org.orgName,
    email: org.email,
    role: "organization",
    avatarUrl: org.avatarUrl,
  },
});
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user =
      (await Individual.findOne({ email })) ||
      (await Organization.findOne({ email }));

    if (!user) return res.status(404).json({ error: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpToken.deleteMany({ email });
    await OtpToken.create({ email, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

   await sendEmail({
  to: email,
  subject: "OTP for Password Reset",
  html: `<p>Your AerthX OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
});

    res.status(200).json({ message: "OTP sent successfully" });
  }catch (err) {
  console.error("OTP ERROR FULL:", err); // 🔥 this is key
  res.status(500).json({ error: "Failed to send OTP" });
}
};

const resetPassword = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    const otpDoc = await OtpToken.findOne({ email });

    const expired = !otpDoc || (otpDoc.expiresAt && otpDoc.expiresAt < new Date()) || (!otpDoc.expiresAt && otpDoc.createdAt && Date.now() - new Date(otpDoc.createdAt).getTime() > 5 * 60 * 1000);
    if (expired || otpDoc.otp !== otp) return res.status(400).json({ error: "OTP expired or invalid" });

    const hashed = await bcrypt.hash(password, 10);

    const userModel = await Individual.findOne({ email }) ? Individual : Organization;
    const user = await userModel.findOneAndUpdate(
      { email },
      { password: hashed },
      { new: true }
    );

    await OtpToken.deleteMany({ email });

    await sendEmail({
      to: email,
      subject: "Your AerthX Password Was Changed",
      html: `<h2>Password Changed</h2>
             <p>Hi ${user.fullName || "User"},</p>
             <p>Your AerthX account password has been successfully updated.</p>
             <p>If this wasn't you, please contact our support immediately.</p>`,
    });

   await Notification.create({
  userId: user._id,
  userType: userModel === Individual ? "Individual" : "Organization",
  title: "Password Changed",
  message: `Hello ${user.fullName},

Your password for the AerthX account was successfully changed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.

For your security, we're sending you this notification. If you did not make this change, please take the following steps immediately:

1. Log in to your account and change your password again.
2. Contact our support team to report this activity.

We recommend using a strong, unique password for your account.

Thank you,
The AerthX Team`
});


    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Password reset error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

const refreshTokenHandler = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    );

    const tokenDoc = await require("../models/RefreshToken").findOne({
      token: refreshToken,
    });

    if (!tokenDoc) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // get user (important)
    let user =
      (await Individual.findById(decoded.id)) ||
      (await Organization.findById(decoded.id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role || (user.orgName ? "organization" : "individual"),
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

const logoutHandler = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token required" });
  }

  try {
    await require("../models/RefreshToken").deleteOne({
      token: refreshToken,
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = {
  loginOrganization,
  sendOtp,
  resetPassword,
    refreshTokenHandler,
      logoutHandler,
};
