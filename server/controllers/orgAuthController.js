const Organization = require("../models/Organization");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const Notification = require("../models/Notification");

const registerOrganization = async (req, res) => {
  try {
    const {
      orgName,
      orgType,
      industry,
      phone,
      country,
      state,
      city,
      fullName,
      email,
      password,
      termsAgreed,
    } = req.body;

    if (
      !orgName || !orgType || !industry  || !phone ||
      !country || !state || !city || !fullName || !email ||
      !password 
    ) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    if (!termsAgreed) {
      return res.status(400).json({ message: "You must agree to the terms." });
    }

const emailCheck = await validateEmail(email);
if (
  !emailCheck ||
  !emailCheck.is_valid_format?.value ||
  !emailCheck.is_mx_found?.value ||
  !emailCheck.is_smtp_valid?.value ||
  emailCheck.is_disposable_email?.value
) {
  return res.status(400).json({ message: "Invalid or disposable email address." });
}



    const existingOrg = await Organization.findOne({ email });
    if (existingOrg) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newOrg = new Organization({
      orgName,
      orgType,
      industry,
      phone,
      country,
      state,
      city,
      fullName,
      email,
      password: hashedPassword,
      termsAgreed,
    });

await newOrg.save();

await sendEmail({
  to: email,
  subject: "Welcome to AerthX 🌍",
  text: `Hello ${fullName}, welcome to AerthX! Your registration is successful.`,
  html: `<h2>Welcome to AerthX, ${fullName}!</h2>
         <p>Your account has been successfully created.</p>
         <p>Thank you for joining our mission toward a greener future. 🌿</p>`,
});

await Notification.create({
  userId: newOrg._id,
  userType: "Organization",
  title: "🏢 Welcome to AerthX!",
  message: "Your organization account has been successfully created. You’re now ready to start tracking, managing, and offsetting your carbon footprint with AerthX.",
  category: "Account",
  priority: "Info",
  read: false,
  timestamp: new Date(),
});


const token = jwt.sign(
  { id: newOrg._id, email: newOrg.email, userType: "Organization", role: "organization" },
  process.env.JWT_SECRET,
  { expiresIn: "14d" }
);


    res.status(201).json({
      message: "Organization registered successfully.", 
      org: {
        id: newOrg._id,
        orgName: newOrg.orgName,
        email: newOrg.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { registerOrganization };
