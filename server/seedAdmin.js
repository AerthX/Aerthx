require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Organization = require("./models/Organization");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/aerthx";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function createOrUpdateAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    const existingAdmin = await Organization.findOne({ email: ADMIN_EMAIL });

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();

    } else {
      const admin = new Organization({
        orgName: "AerthX Admin",
        orgType: "Admin",
        industry: "Environment",
        website: "https://aerthx.com",
        phone: "9876543210",
        country: "India",
        state: "Maharashtra",
        city: "Mumbai",
        fullName: "Hardik Patil",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        designation: "Founder",
        termsAgreed: true,
        role: "admin",
      });

      await admin.save();

    }


    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
}

createOrUpdateAdmin();
