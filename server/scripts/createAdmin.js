require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Individual = require("../models/Individual");
const Organization = require("../models/Organization");

(async () => {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error("Usage: node scripts/createAdmin.js <email> <password>");
    process.exit(1);
  }
  if (!process.env.MONGO_URI) { console.error("MONGO_URI is required"); process.exit(1); }
  await mongoose.connect(process.env.MONGO_URI);
  const hashed = await bcrypt.hash(password, 12);
  const existing = (await Individual.findOne({ email })) || (await Organization.findOne({ email }));
  if (existing) {
    existing.password = hashed; existing.role = "admin"; existing.isAdmin = true; await existing.save();
    console.log(`Existing account ${email} promoted to admin.`);
  } else {
    await Individual.create({ fullName: "AerthX Admin", email, password: hashed, country: "India", city: "", state: "", role: "admin", isAdmin: true });
    console.log(`Admin account ${email} created.`);
  }
  await mongoose.disconnect();
})().catch(err => { console.error(err); process.exit(1); });
