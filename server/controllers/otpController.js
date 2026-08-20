const RegisterOtp = require("../models/RegisterOtp");
const Individual = require("../models/Individual");
const Organization = require("../models/Organization");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const Notification = require("../models/Notification"); 


exports.sendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const existingIndividual = await Individual.findOne({ email });
    const existingOrganization = await Organization.findOne({ email });
    if (existingIndividual || existingOrganization) {
      return res.status(400).json({ message: "Email is already registered. Please sign in." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
    await RegisterOtp.deleteMany({ email });
    await RegisterOtp.create({
      email,
      otp,
      createdAt: new Date(),
      expiresAt: expiresAt,
    });

await sendEmail({
  to: email,
  subject: "Your OTP for AerthX Registration",
  text: `Hello,

Thank you for registering with AerthX!

To complete your registration, please use the following One-Time Password (OTP):

Your OTP: ${otp}

This OTP is valid for 5 minutes. Please do not share this code with anyone.

If you did not request this code, you can safely ignore this email.

Best regards,
The AerthX Team`,
  html: `
    <div style="font-family: Arial, sans-serif; padding: 0; margin: 0; background-color: #f9f9f9;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width: 100%;">
        <tr>
          <td align="center" style="padding: 0;">
            <div style="max-width: 600px; margin: 0 auto;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width: 100%; background-color: #ffffff; table-layout: fixed;">
                
                <tr>
                  <td style="background-color: #0d9488; padding: 30px; text-align: center;">
                    <img src="${process.env.BASE_URL}/assets/aerthxLogo.png" alt="AerthX Logo" style="width: 80px; height: auto; display: block; margin: 0 auto;">
                    <h1 style="color: #ffffff; margin: 15px 0 0; font-size: 28px; font-weight: bold;">AerthX Registration OTP</h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 30px; color: #333;">
                    <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
                    <p style="font-size: 16px; line-height: 1.6;">
                      Thank you for registering with <strong>AerthX</strong>.
                      To complete your registration, please use the following verification code:
                    </p>
                    <div style="text-align: center; margin: 25px 0;">
                      <span style="display: inline-block; padding: 14px 30px; font-size: 32px; font-weight: bold; color: #ffffff; background-color: #004d40; border-radius: 8px; user-select: all; -webkit-text-size-adjust: none; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        ${otp}
                      </span>
                    </div>
                    <p style="font-size: 16px; line-height: 1.6;">
                      This OTP is valid for <strong>5 minutes</strong>. For your security, please do not share this code with anyone.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6;">
                      If you did not request this email, please ignore it. Your account remains secure.
                    </p>
                    <br>
                    <p style="font-size: 16px; line-height: 1.6;">Best regards,</p>
                    <p style="font-size: 16px; font-weight: bold; color: #004d40;">The AerthX Team</p>
                  </td>
                </tr>
                
                <tr>
                  <td style="background-color: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #555;">
                    &copy; ${new Date().getFullYear()} AerthX. All rights reserved.
                  </td>
                </tr>

              </table>
              </div>
          </td>
        </tr>
      </table>
    </div>
  `,
});

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("OTP Send Error:", error);
    res.status(500).json({ message: "Failed to send OTP." });
  }
};

exports.verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp, form, userType } = req.body;

    if (!email || !otp || !form || !userType) {
      return res.status(400).json({ message: "All required fields (email, OTP, form data, user type) must be provided." });
    }

    const otpDoc = await RegisterOtp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ message: "No OTP found for this email. Please request a new one." });
    }

    if (new Date() > otpDoc.expiresAt) {
      await RegisterOtp.deleteOne({ _id: otpDoc._id }); 
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (otpDoc.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    await RegisterOtp.deleteOne({ _id: otpDoc._id });

    const existingIndividual = await Individual.findOne({ email });
    const existingOrganization = await Organization.findOne({ email });
    if (existingIndividual || existingOrganization) {
      return res.status(400).json({ message: "This email is already registered. Please sign in." });
    }

    const hashedPassword = await bcrypt.hash(form.password, 10);
    let newUser;
    let registeredUserType;

    if (userType.toLowerCase() === "organization") {
      newUser = await Organization.create({
        ...form,
        password: hashedPassword,
      });
      registeredUserType = "Organization";
    } else if (userType.toLowerCase() === "individual") {
      newUser = await Individual.create({
        ...form,
        password: hashedPassword,
      });
      registeredUserType = "Individual";
    } else {
      return res.status(400).json({ message: "Invalid user type provided for registration." });
    }

await sendEmail({
  to: newUser.email,
  subject: "Welcome to AerthX – Your Carbon Credit Journey Begins 🌱",
  text: `Hello ${newUser.fullName || newUser.orgName},

Welcome to the AerthX family!

We are thrilled to have you join our mission to fight climate change through certified carbon credits. Your successful registration marks a significant step towards a sustainable future.

We look forward to partnering with you on this journey. Please log in to your account to explore our available projects and start offsetting your carbon footprint.

Best regards,
The AerthX Team`,

  html: `
  <div style="margin:0; padding:0; background-color:#f0fdf4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    
    <!-- Header image -->
    <img src="${process.env.BASE_URL}/assets/RegisterImage.jpg" alt="Welcome to AerthX" 
         style="width:100%; height:auto; display:block; border:none; margin:0; padding:0;">
    
    <!-- Logo & Title -->
    <div style="text-align:center; padding:30px 20px; background-color:#0d9488;">
    <img src="${process.env.BASE_URL}/assets/aerthxLogo.png" 
     alt="AerthX Logo" 
     style="width:90px; height:auto; display:block; margin:0 auto;">

      <h1 style="color:#ffffff; font-size:28px; font-weight:600; margin:15px 0 0;">Welcome to AerthX</h1>
    </div>

    <!-- Body -->

    <div style="padding:30px 20px; max-width:600px; margin:auto; background-color:#ffffff;">
      <h2 style="color:#0d9488; font-size:22px; margin-bottom:20px; font-weight:500;">Hello, ${newUser.fullName || newUser.orgName}</h2>
      <p style="font-size:16px; line-height:1.6; color:#4b5563; margin-bottom:15px;">
        Thank you for registering with <strong>AerthX</strong>. We’re thrilled to have you as part of our mission to create a sustainable future through high-quality, certified carbon credits.
      </p>
      <p style="font-size:16px; line-height:1.6; color:#4b5563; margin-bottom:20px;">
        Your account has been successfully created. We invite you to log in and explore our diverse portfolio of carbon offset projects where you can make a tangible impact.
      </p>
<p>
    We are thrilled to have you join our mission to fight climate change through certified carbon credits.
    Your successful registration marks a significant step towards a sustainable future.
  </p>
  <p>
    We look forward to partnering with you on this journey. Please log in to your account to explore our available projects
    and start offsetting your carbon footprint.
  </p>
  <p>Best regards,<br>The AerthX Team</p>
     <!-- Call to Action -->
       <div style="text-align:center; margin:30px 0;">
        <a href="https://your-backend.com/login" 
          style="display:inline-block; padding:12px 25px; font-size:16px; font-weight:bold; color:#ffffff; background-color:#0d9488; text-decoration:none; border-radius:50px;">
           Explore Our Projects
        </a>
       </div>

      <p style="font-size:16px; line-height:1.6; color:#4b5563; text-align:center;">
        Together, we can build a greener planet for generations to come.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center; padding:20px; font-size:12px; color:#9ca3af;">
      <p>&copy; ${new Date().getFullYear()} AerthX. All rights reserved.</p>
    </div>

  </div>
  `
});


  await Notification.create({
  userId: newUser._id,
  userType: registeredUserType,
  title: `🎉 Welcome to AerthX, ${newUser.name || "there"}!`,
  message: `Your ${registeredUserType.toLowerCase()} account has been successfully created. You’re now ready to explore, track, and make an impact with AerthX.`,
  category: "Account",
  priority: "Info",
  read: false,
  timestamp: new Date(),
});

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, userType: registeredUserType },
      process.env.JWT_SECRET,
      { expiresIn: "14d" }
    );

    res.status(201).json({ 
      message: "Registration complete. Welcome to AerthX!",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName || newUser.orgName, 
        userType: registeredUserType
      },
    });

  } catch (error) {
    console.error("Verify OTP & Registration Error:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: `Validation Error: ${error.message}` });
    }
    res.status(500).json({ message: "Registration failed. Server error." });
  }
};