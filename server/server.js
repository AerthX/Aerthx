require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const profileRoutes = require("./routes/profileRoutes");

const authRoutes = require("./routes/authRoutes");
const orgRoutes = require("./routes/orgRoutes");
const individualRoutes = require("./routes/individualRoutes");
const individualProfileRoutes = require("./routes/individualProfileRoutes");
const individualPricingRoutes = require("./routes/individualPricingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const carbonCreditRoutes = require('./routes/carbonCredits');
const adminRoutes = require('./routes/adminRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes'); 
const bugRoutes = require("./routes/bugRoutes.js");
const contactRoutes = require("./routes/contactRoutes");
const faqRoutes = require("./routes/faqRoutes");
const pricingRoutes = require("./routes/pricingRoutes");

const path = require('path');
const app = express();
const allowedOrigins = [
  process.env.VITE_MAIN_URL,
 process.env.VITE_MARKETPLACE_URL,
  process.env.VITE_ADMIN_URL,
  "https://www.aerthx.in"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
 
  next();
});

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use("/api/organization", orgRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/individual", individualRoutes);
app.use("/api/individual", individualProfileRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", bugRoutes);
app.use("/api/user/notifications", notificationRoutes);
app.use("/api/faqs", faqRoutes);
app.use('/api/carbon-credits', carbonCreditRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/admin/pricing/individual", individualPricingRoutes);
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;  
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
