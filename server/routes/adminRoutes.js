const express = require('express');
const router = express.Router();
const Individual = require('../models/Individual');
const Organization = require('../models/Organization');
const BugReport = require('../models/BugReport');
const sendEmail = require("../utils/sendEmail");
const CarbonCredit = require("../models/CarbonCredit");
const Notification = require("../models/Notification");
const FAQ = require("../models/FAQ");
const PricingConfig = require('../models/PricingConfig');
const Subscription = require("../models/Subscription");
const CarbonPurchase = require("../models/CarbonPurchase");
const authMiddleware = require("../middleware/auth");




const isAdmin = async (req, res, next) => {
  try {
    const user = req.user; 

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error in admin check" });
  }
};

router.use(authMiddleware, isAdmin);

router.get("/admins", async (req, res) => {
  try {
    const individuals = await Individual.find({ isAdmin: true }).select("_id fullName");
    const organizations = await Organization.find({ isAdmin: true }).select("_id orgName");

    const admins = [
      ...individuals.map(i => ({ id: i._id, name: i.fullName, type: "Individual" })),
      ...organizations.map(o => ({ id: o._id, name: o.orgName, type: "Organization" })),
    ];

    res.status(200).json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch admins", error: err.message });
  }
});

router.get('/individuals', async (req, res) => {
  try {
    const individuals = await Individual.find();
    res.status(200).json(individuals);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch individuals', error: err.message });
  }
});

router.delete('/individuals/:id', async (req, res) => {
  try {
    const deleted = await Individual.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Individual not found' });
    res.status(200).json({ message: 'Individual deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete individual', error: err.message });
  }
});

router.get('/organizations', async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.status(200).json(organizations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch organizations', error: err.message });
  }
});

router.delete('/organizations/:id', async (req, res) => {
  try {
    const deleted = await Organization.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Organization not found' });
    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete organization', error: err.message });
  }
});

router.get('/users-reports', async (req, res) => {
  try {
    const individuals = await Individual.find();
    const organizations = await Organization.find();

    const allUsers = [...individuals, ...organizations];

    const usersWithReports = await Promise.all(
      allUsers.map(async (user) => {
        const reportsCount = await BugReport.countDocuments({ userId: user._id });
        const newReports = await BugReport.countDocuments({ userId: user._id, seen: false });

        return {
          id: user._id,
          name: user.fullName || user.orgName,
          reportsCount,
          newReports,
        };
      })
    );

    res.status(200).json(usersWithReports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user reports', error: err.message });
  }
});

router.get('/user-reports/:userId', async (req, res) => {
  try {
    const reports = await BugReport.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user reports', error: err.message });
  }
});



router.post("/send-email/:userId", async (req, res) => {
  try {
    const { subject, problem, message } = req.body;

    const user =
      (await Individual.findById(req.params.userId)) ||
      (await Organization.findById(req.params.userId));

    if (!user || !user.email) {
      return res.status(404).json({ message: "User not found or has no email" });
    }

const emailBody = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; background-color: #ffffff; width: 100%;">
    
    <!-- Header -->
    <div style="background: linear-gradient(90deg, #2e7d32, #66bb6a); padding: 20px; text-align: center; color: white;">
      <img src="https://i.ibb.co/0XxJX5Y/aerthx-logo.png" alt="AerthX Logo" style="height: 50px; margin-bottom: 10px;" />
      <h2 style="margin: 0; font-size: 22px;">AerthX Support Team</h2>
    </div>

    <!-- Body -->
    <div style="padding: 25px;">
      <h3 style="color: #2e7d32; margin-top: 0;">Hello,</h3>
      
      <p>We have received your report and here are the details:</p>
      
      <p><strong style="color:#2e7d32;">Problem Reported:</strong> ${problem || "N/A"}</p>
      
      <p><strong style="color:#4caf50;">Our Response:</strong> ${message}</p>

      <p>If you have further questions, feel free to reply to this email.</p>

      <p style="margin-top: 25px;">Best regards,<br/><strong>The AerthX Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
      © ${new Date().getFullYear()} AerthX. All rights reserved.<br/>
      <a href="https://aerthx.com" style="color: #2e7d32; text-decoration: none;">Visit our website</a>
    </div>

  </div>
`;



    await sendEmail({
      from: `"AerthX Admin" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: subject || "Regarding Your Report - AerthX",
      text: `Problem Reported:\n${problem || "N/A"}\n\nOur Response:\n${message}`,
      html: emailBody,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Failed to send email", error: err.message });
  }
});




router.delete("/delete-report/:reportId", async (req, res) => {
  try {
    const deleted = await BugReport.findByIdAndDelete(req.params.reportId);
    if (!deleted) return res.status(404).json({ message: "Report not found" });
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete report", error: err.message });
  }
});

router.post("/send-notification/:userId", async (req, res) => {
  try {
    const { title, description, userType } = req.body;

    let user;
    if (userType === "Individual") {
      user = await Individual.findById(req.params.userId);
    } else if (userType === "Organization") {
      user = await Organization.findById(req.params.userId);
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const newNotification = new Notification({
      userId: user._id,
      userType,
      title,
      message: description,
      timestamp: new Date(),
    });

    await newNotification.save();
    res.status(200).json({ message: "Notification sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send notification", error: err.message });
  }
});


router.put('/update-report-seen/:reportId', async (req, res) => {
  try {
    const report = await BugReport.findByIdAndUpdate(
      req.params.reportId,
      { seen: true },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.status(200).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update report seen status', error: err.message });
  }
});

router.put('/update-report-priority/:reportId', async (req, res) => {
  try {
    const { priority } = req.body;
    if (!["low", "medium", "high", null].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value" });
    }

    const report = await BugReport.findByIdAndUpdate(
      req.params.reportId,
      { priority },
      { new: true }
    );

    if (!report) return res.status(404).json({ message: "Report not found" });
    res.status(200).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update report priority", error: err.message });
  }
});

router.put('/assign-report/:reportId', async (req, res) => {
  try {
    const { adminId } = req.body;
    const report = await BugReport.findByIdAndUpdate(
      req.params.reportId,
      { assignedAdminId: adminId },
      { new: true }
    ).populate("assignedAdminId", "name");

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.status(200).json({
      ...report.toObject(),
      assignedAdminName: report.assignedAdminId ? report.assignedAdminId.name : "Unassigned"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to assign report", error: err.message });
  }
});

router.put("/toggle-star/:reportId", async (req, res) => {
  try {
    const report = await BugReport.findById(req.params.reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.star = !report.star;
    await report.save();

    res.status(200).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to toggle star", error: err.message });
  }
});


router.post("/send-general-email/:userId", async (req, res) => {
  try {
    const { subject, message } = req.body;

    const user =
      (await Individual.findById(req.params.userId)) ||
      (await Organization.findById(req.params.userId));

    if (!user || !user.email) {
      return res.status(404).json({ message: "User not found or has no email" });
    }

   const emailBody = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333;">
    
    <!-- Outer Container -->
    <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">

      <!-- Header -->
      <div style="background: linear-gradient(90deg, #1b5e20, #43a047); padding: 30px; text-align: center; color: white;">
        <img src="https://i.ibb.co/0XxJX5Y/aerthx-logo.png" alt="AerthX Logo" style="height: 60px; margin-bottom: 12px;" />
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">AerthX Communication</h1>
      </div>

      <!-- Body -->
      <div style="padding: 35px;">
        <h2 style="color: #1b5e20; margin-top: 0; font-size: 20px;">Hello ${user.fullName || user.orgName},</h2>
        
        <p style="font-size: 15px; line-height: 1.8; margin: 15px 0; color: #444;">
          ${message}
        </p>

        <p style="margin-top: 30px; font-size: 15px; color: #444;">
          Warm regards,<br/>
          <strong>The AerthX Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 13px; color: #777;">
        <p style="margin: 5px 0;">© ${new Date().getFullYear()} AerthX. All rights reserved.</p>
        <p style="margin: 5px 0;">
          <a href="https://aerthx.com" style="color: #1b5e20; text-decoration: none; font-weight: 500;">Visit our website</a>
        </p>
      </div>

    </div>
  </div>
`;

    await sendEmail({
      from: `"AerthX Admin" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: subject || "Message from AerthX Admin",
      html: emailBody,
    });

    res.status(200).json({ message: "General email sent successfully" });
  } catch (err) {
    console.error("Error sending general email:", err);
    res.status(500).json({ message: "Failed to send general email", error: err.message });
  }
});


router.get("/faqs/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const faqs = await FAQ.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(faqs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch FAQs", error: err.message });
  }
});

router.post("/faqs", async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    if (!["resource", "support"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const newFAQ = new FAQ({ question, answer, category });
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (err) {
    res.status(500).json({ message: "Failed to add FAQ", error: err.message });
  }
});
router.post("/faqs/seed", async (req, res) => {
  try {
    await FAQ.deleteMany({ category: "resource" });

    await FAQ.insertMany([
      {
        question: "What is EU CBAM and why does it matter for Indian exporters?",
        answer:
          "The Carbon Border Adjustment Mechanism (CBAM) is a European Union regulation requiring importers to report and eventually pay for the carbon emissions embedded in products. AerthX helps businesses calculate emissions, prepare compliance-ready reports, and stay export-ready.",
        category: "resource",
      },
      {
        question: "What is a carbon credit?",
        answer:
          "A carbon credit represents one metric tonne of CO₂ reduced or removed from the atmosphere through certified climate projects. Businesses purchase carbon credits to offset unavoidable emissions and support sustainability initiatives.",
        category: "resource",
      },
      {
        question: "How does AerthX help my business?",
        answer:
          "AerthX helps businesses calculate their carbon footprint, purchase verified carbon credits, generate compliance reports, and monitor sustainability progress through one platform.",
        category: "resource",
      },
      {
        question: "How do I know the carbon credits are genuine?",
        answer:
          "Every carbon credit on AerthX comes from internationally recognized registries such as Verra or Gold Standard. Each credit has a unique serial number that can be independently verified.",
        category: "resource",
      },
      {
        question: "How much does it cost to offset my carbon footprint?",
        answer:
          "The cost depends on your industry, emissions, and current carbon credit prices. AerthX provides a free calculator to estimate your emissions and the approximate cost of offsetting them.",
        category: "resource",
      },
      {
        question: "Will I receive a Carbon Offset Certificate?",
        answer:
          "Yes. After your credits are retired, AerthX generates a Carbon Offset Certificate containing project details, retirement information, and verification records for ESG reporting and compliance.",
        category: "resource",
      },
      {
        question: "Is AerthX available now?",
        answer:
          "AerthX is currently onboarding early users through a limited-access program. Join our waitlist for priority access and early product updates.",
        category: "resource",
      },
    ]);

    res.json({
      success: true,
      message: "AerthX FAQs inserted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.delete("/faqs/:id", async (req, res) => {
  try {
    const deleted = await FAQ.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "FAQ not found" });
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete FAQ", error: err.message });
  }
});


router.put("/faqs/:id", async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    if (!["resource", "support"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      req.params.id,
      { question, answer, category },
      { new: true }
    );

    if (!updatedFAQ) return res.status(404).json({ message: "FAQ not found" });

    res.status(200).json(updatedFAQ);
  } catch (err) {
    res.status(500).json({ message: "Failed to update FAQ", error: err.message });
  }
});

router.put("/toggle-active/:creditId", async (req, res) => {
  try {
    const { isActive } = req.body;
    const credit = await CarbonCredit.findByIdAndUpdate(
      req.params.creditId,
      { isActive },
      { new: true }
    );
    if (!credit) return res.status(404).json({ message: "Credit not found" });
    res.status(200).json(credit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to toggle active status", error: err.message });
  }
});

router.put('/archive/:creditId', async (req, res) => {
    try {
        const credit = await CarbonCredit.findByIdAndUpdate(
            req.params.creditId,
            { isArchived: true, isActive: false }, 
            { new: true }
        );
        if (!credit) return res.status(404).json({ message: "Credit not found" });
        res.status(200).json(credit);
    } catch (err) {
        console.error("Failed to archive credit:", err);
        res.status(500).json({ message: "Failed to archive credit", error: err.message });
    }
});

router.put('/unarchive/:creditId', async (req, res) => {
  try {
    const credit = await CarbonCredit.findByIdAndUpdate(
      req.params.creditId,
      { isArchived: false, isActive: true }, 
      { new: true }
    );

    if (!credit) return res.status(404).json({ message: "Credit not found" });

    res.status(200).json(credit);
  } catch (err) {
    console.error("Failed to unarchive credit:", err);
    res.status(500).json({ message: "Failed to unarchive credit", error: err.message });
  }
});

router.get("/pricing", async (req, res) => {
  try {
    const config = await PricingConfig.findOne({ configId: 'pricing_master' });
    if (!config) return res.status(404).json({ message: "No pricing configuration found" });
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pricing configuration", error: err.message });
  }
});


router.post("/pricing", async (req, res) => {
  try {
    const { plans, featureGroups } = req.body;

    if (!plans || Object.keys(plans).length === 0) {
      return res.status(400).json({ message: "Plans data is required" });
    }

    const updatedConfig = await PricingConfig.findOneAndUpdate(
      { configId: 'pricing_master' },
      { plans, featureGroups },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Pricing configuration saved successfully", data: updatedConfig });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save pricing configuration", error: err.message });
  }
});

router.get("/subscriptions", async (req, res) => {
  try {
    const subs = await Subscription.find().sort({ createdAt: -1 });

    const result = await Promise.all(
      subs.map(async (sub) => {
        let user =
          sub.userType === "individual"
            ? await Individual.findById(sub.userId)
            : await Organization.findById(sub.userId);

        return {
          id: sub._id,
          name: user?.fullName || user?.orgName || "Unknown",
          email: user?.email || "N/A",
          plan: sub.plan,
          duration: sub.duration,
          status: sub.status,
          endDate: sub.endDate,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
});

router.put("/subscription/suspend/:id", async (req, res) => {
  try {
    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: "suspended" },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to suspend subscription" });
  }
});

router.put("/subscription/resume/:id", async (req, res) => {
  try {
    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to resume subscription" });
  }
});

router.get("/top-purchasers", async (req, res) => {
  try {
    const purchases = await CarbonPurchase.aggregate([
      { $match: { status: "completed" } },

      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$totalAmountPaid" },
          totalTons: { $sum: "$tonsBought" },
          purchases: { $sum: 1 },
          userType: { $first: "$userType" },
        },
      },

      { $sort: { totalSpent: -1 } },
    ]);

    const result = await Promise.all(
      purchases.map(async (p, index) => {
        let user =
          p.userType === "individual"
            ? await Individual.findById(p._id)
            : await Organization.findById(p._id);

        return {
          rank: index + 1,
          userId: p._id,
          name: user?.fullName || user?.orgName || "Unknown",
          email: user?.email || "N/A",
          totalSpent: p.totalSpent,
          totalTons: p.totalTons,
          purchases: p.purchases,
          userType: p.userType,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch purchasers" });
  }
});

router.get("/user-purchases/:userId", async (req, res) => {
  try {
    const data = await CarbonPurchase.find({
      userId: req.params.userId,
      status: "completed",
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
});

router.put("/suspend-user/:userId", async (req, res) => {
  try {
    let user =
      (await Individual.findById(req.params.userId)) ||
      (await Organization.findById(req.params.userId));

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isSuspended = true;
    await user.save();

    res.json({ message: "User suspended" });
  } catch (err) {
    res.status(500).json({ message: "Failed to suspend user" });
  }
});

router.put("/toggle-user-status/:userId", async (req, res) => {
  try {
    let user =
      (await Individual.findById(req.params.userId)) ||
      (await Organization.findById(req.params.userId));

    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔥 TOGGLE
    user.isSuspended = !user.isSuspended;

    await user.save();

    res.json({
      message: user.isSuspended ? "User suspended" : "User activated",
      isSuspended: user.isSuspended,
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to update user status" });
  }
});

router.get("/analytics", async (req, res) => {
  try {
    const purchases = await CarbonPurchase.find({ status: "completed" });
    const subscriptions = await Subscription.find();

    const groupByMonth = (items, type) => {
      const map = {};

      items.forEach((item) => {
        const date = new Date(item.createdAt || item.startDate);
        const key = date.toLocaleString("default", { month: "short" });

        if (!map[key]) {
          map[key] = {
            date: key,
             rawDate: date, 
            revenue: 0,
            count: 0,
            tons: 0,
          };
        }

        if (type === "purchase") {
          map[key].revenue += item.totalAmountPaid || 0;
          map[key].tons += item.tonsBought || 0;
          map[key].count += 1;
        }

        if (type === "subscription") {
          map[key].revenue += 500; // 🔥 replace with real plan price later
          map[key].count += 1;
        }
      });

      return Object.values(map);
    };

    res.json({
      carbon: groupByMonth(purchases, "purchase"),
      subscriptions: groupByMonth(subscriptions, "subscription"),
    });

  } catch (err) {
    res.status(500).json({ message: "Analytics error" });
  }
});

router.get("/overview", async (req, res) => {
  try {
    // ✅ COUNT USERS (both collections)
    const individualUsers = await Individual.countDocuments();
    const organizationUsers = await Organization.countDocuments();
    const users = individualUsers + organizationUsers;

    // ✅ PURCHASE DATA
    const purchases = await CarbonPurchase.find({ status: "completed" });

    // ✅ SUBSCRIPTIONS
    const subscriptions = await Subscription.find();

    // ✅ SUSPENDED USERS
    const suspendedIndividuals = await Individual.countDocuments({ isSuspended: true });
    const suspendedOrganizations = await Organization.countDocuments({ isSuspended: true });
    const suspendedUsers = suspendedIndividuals + suspendedOrganizations;

    // 🔥 CALCULATIONS
    let totalRevenue = 0;
    let totalTons = 0;
    let totalCredits = 0;

    purchases.forEach(p => {
      totalRevenue += p.totalAmountPaid || 0;
      totalTons += p.tonsBought || 0;
      totalCredits += p.tonsBought || 0;
    });

    res.json({
      users,
      revenue: totalRevenue,
      tons: totalTons,
      subs: subscriptions.length,
      suspended: suspendedUsers,
      transactions: purchases.length,
      credits: totalCredits
    });

  } catch (err) {
    console.error("🔥 OVERVIEW ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

