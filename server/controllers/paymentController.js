const razorpay = require("../utils/razorpay");
const crypto = require("crypto"); 
const Subscription = require("../models/Subscription");
const Individual = require("../models/Individual");
const Organization = require("../models/Organization");
const CarbonPurchase = require("../models/CarbonPurchase");
const sendEmail = require("../utils/sendEmail");
const generateCertificate = require("../utils/generateCertificate");
const PricingConfig = require("../models/PricingConfig");
const IndividualPricingConfig = require("../models/IndividualPricingConfig");
const CarbonCredit = require("../models/CarbonCredit");

const PAYMENT_FEES = {
  card: { platform: 0.05, gateway: 0.02, fixed: 25 },
  upi: { platform: 0.03, gateway: 0.01, fixed: 20 },
  netbanking: { platform: 0.02, gateway: 0.005, fixed: 10 },
  paypal: { platform: 0.04, gateway: 0.03, fixed: 30 },
};

const calculateBreakdown = (subtotal, paymentMethod) => {
  const fee = PAYMENT_FEES[paymentMethod] || PAYMENT_FEES.card;
  const platformFee = subtotal * fee.platform;
  const gatewayFee = subtotal * fee.gateway + fee.fixed;
  const gst = (subtotal + platformFee + gatewayFee) * 0.18;
  return { platformFee, gatewayFee, gst, total: subtotal + platformFee + gatewayFee + gst };
};

const calculateTotal = (subtotal, paymentMethod) => calculateBreakdown(subtotal, paymentMethod).total;

const getPlanSubtotal = async ({ userType, planName, duration }) => {
  if (!planName || !["monthly", "yearly"].includes(duration)) return null;

  let config;
  if (userType === "Individual") {
    config = await IndividualPricingConfig.findOne({ configId: "individual_pricing" });
  } else {
    config = await PricingConfig.findOne({ configId: "pricing_master" });
  }
  if (!config?.plans) return null;

  const plans = config.plans instanceof Map ? Array.from(config.plans.values()) : Object.values(config.plans);
  const plan = plans.find((item) => item.name === planName || item.id === planName);
  if (!plan) return null;

  const value = plan[duration];
  if (typeof value === "number") return value;
  if (value && typeof value === "object") {
    const key = userType === "Organization" ? "organization" : "individual";
    const numeric = Number(value[key]);
    return Number.isFinite(numeric) ? numeric : null;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

exports.createOrder = async (req, res) => {
  try {
    const { amount, type, projectId, tons, plan, duration, paymentMethod } = req.body;
    const requestedAmount = Number(amount);

    if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
      return res.status(400).json({ message: "A valid amount is required" });
    }
    if (!PAYMENT_FEES[paymentMethod]) {
      return res.status(400).json({ message: "Unsupported payment method" });
    }

    let minimumAmount = 0;

    if (type === "carbon_credit") {
      const project = await CarbonCredit.findById(projectId);
      const quantity = Number(tons);
      if (!project || !Number.isFinite(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Valid project and quantity are required" });
      }
      const available = Number(project.remainingTons ?? project.tons ?? 0);
      if (available < quantity) return res.status(400).json({ message: "Not enough carbon credits available" });
      minimumAmount = calculateTotal(Number(project.pricePerTon) * quantity, paymentMethod);
    } else if (type === "subscription") {
      const subtotal = await getPlanSubtotal({ userType: req.user.userType, planName: plan, duration });
      if (subtotal === null || subtotal <= 0) {
        return res.status(400).json({ message: "Invalid subscription plan or pricing" });
      }
      minimumAmount = calculateTotal(subtotal, paymentMethod);
    } else {
      return res.status(400).json({ message: "Invalid payment type" });
    }

    // The browser may display a higher amount because of optional UI add-ons,
    // but it must never be able to create an order below the server price.
    if (requestedAmount + 0.01 < minimumAmount) {
      return res.status(400).json({ message: "Payment amount is below the current server price" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(requestedAmount * 100),
      currency: "INR",
      receipt: `receipt_${req.user.id}_${Date.now()}`.slice(0, 40),
      notes: { userId: String(req.user.id), type: String(type) },
    });

    res.json(order);
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      duration,
      paymentMethod,
    } = req.body;


    // 🔐 STEP 1: VERIFY SIGNATURE (DO NOT MOVE)
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const verifiedOrder = await razorpay.orders.fetch(razorpay_order_id);
    if (!verifiedOrder || Number(verifiedOrder.amount) <= 0) {
      return res.status(400).json({ success: false, message: "Invalid Razorpay order" });
    }

    
    const {
  type,
  projectId,
  tons
} = req.body;

if (!req.body.type) {
  return res.status(400).json({
    success: false,
    message: "Payment type is required",
  });
}

if (!PAYMENT_FEES[paymentMethod]) {
  return res.status(400).json({ success: false, message: "Unsupported payment method" });
}

const paymentType = req.body.type;
if (paymentType === "carbon_credit") {
  const projectForAmount = await require("../models/CarbonCredit").findById(projectId);
  const quantityForAmount = Number(tons);
  if (!projectForAmount || !Number.isFinite(quantityForAmount) || quantityForAmount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid project or quantity" });
  }
  const expected = calculateTotal(Number(projectForAmount.pricePerTon) * quantityForAmount, paymentMethod);
  if (Number(verifiedOrder.amount) + 1 < Math.round(expected * 100)) {
    return res.status(400).json({ success: false, message: "Paid amount does not match the server price" });
  }
} else if (paymentType === "subscription") {
  const subscriptionSubtotal = await getPlanSubtotal({ userType: req.user.userType, planName: plan, duration });
  if (subscriptionSubtotal === null || subscriptionSubtotal <= 0) {
    return res.status(400).json({ success: false, message: "Invalid subscription pricing" });
  }
  const expected = calculateTotal(subscriptionSubtotal, paymentMethod);
  if (Number(verifiedOrder.amount) + 1 < Math.round(expected * 100)) {
    return res.status(400).json({ success: false, message: "Paid amount does not match the server price" });
  }
} else {
  return res.status(400).json({ success: false, message: "Invalid payment type" });
}

    const userId = req.user.id;
    const userType = req.user.userType.toLowerCase();
    const individual = req.user.userType === "Individual" ? await Individual.findById(userId) : null;
    const organization = req.user.userType === "Organization" ? await Organization.findById(userId) : null;
    const userData = individual || organization;

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingCarbonPayment = await CarbonPurchase.findOne({ razorpay_payment_id, status: "completed" });
    const existingSubscription = await Subscription.findOne({ razorpay_payment_id, status: "active" });
    if (existingCarbonPayment || existingSubscription) {
      return res.status(200).json({ success: true, message: "Payment already processed" });
    }

// ================= CARBON CREDIT FLOW =================
if (type === "carbon_credit") {
  const CarbonPurchase = require("../models/CarbonPurchase");
  const CarbonProject = require("../models/CarbonCredit"); 

  const project = await CarbonProject.findById(projectId);

    if (!projectId || !tons) {
  return res.status(400).json({
    success: false,
    message: "ProjectId and tons required",
  });
}

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "ProjectId is required",
    });
  }

  if (!tons || tons <= 0) {
  return res.status(400).json({
    success: false,
    message: "Invalid tons value",
  });
}

  const availableTons = Number(project.remainingTons ?? project.tons ?? 0);
  if (availableTons < tons) {
    return res.status(400).json({
      success: false,
      message: "Not enough carbon credits available",
    });
  }



  const pricePerTon = project.pricePerTon;
  const subtotal = pricePerTon * tons;

  const breakdown = calculateBreakdown(subtotal, paymentMethod);
  const platformFee = breakdown.platformFee;
  const gatewayFee = breakdown.gatewayFee;
  const gst = breakdown.gst;
  const totalAmountPaid = Number(verifiedOrder.amount) / 100;

const certificateId = `CERT-AERTHX-${Date.now()}`;

const certificateUrl = await generateCertificate({
  certificateId,
  userName: userData?.fullName || userData?.orgName || userData?.name,
  projectName: project.title,
  tons,
});

  await CarbonPurchase.create({


    userId,
    userType,
    userName: userData?.fullName || userData?.orgName || userData?.name,
    userEmail: userData?.email,

    projectId,
    projectName: project.title,

    tonsBought: tons,
    pricePerTon,

    subtotal,
    platformFee,
    gatewayFee,
    gst,
    totalAmountPaid,

    paymentMethod,
    razorpay_payment_id,
    razorpay_order_id,
    status: "completed",
certificateId,
certificateUrl,
issuedAt: new Date(),
    
  });

const certificateLink = certificateUrl;

try {
 await sendEmail({
  to: userData?.email,
  subject: "🌱 Your Carbon Offset Certificate | AerthX",
  html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 20px;">
    
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      
      <h2 style="color: #1b5e20; text-align: center;">
        Carbon Offset Confirmation 🌱
      </h2>

      <p style="font-size: 15px; color: #333;">
        Dear <strong>${userData?.name || userData?.orgName}</strong>,
      </p>

      <p style="font-size: 14px; color: #555;">
        Your carbon credit purchase has been successfully completed. Thank you for contributing towards a more sustainable future.
      </p>

      <hr style="margin: 20px 0;" />

      <h3 style="color: #2e7d32;">Transaction Details</h3>

      <table style="width: 100%; font-size: 14px; color: #444;">
        <tr>
          <td><strong>Project</strong></td>
          <td>${project.title || project.name}</td>
        </tr>
        <tr>
          <td><strong>Carbon Offset</strong></td>
          <td>${tons} Tonnes CO₂</td>
        </tr>
        <tr>
          <td><strong>Total Paid</strong></td>
          <td>₹${totalAmountPaid}</td>
        </tr>
      </table>

      <hr style="margin: 20px 0;" />

      <h3 style="color: #2e7d32;">📄 Your Certificate</h3>

      <p style="font-size: 14px; color: #555;">
        Your carbon offset certificate has been issued and is available for verification and download.
      </p>

      <div style="text-align: center; margin: 20px 0;">
        <a href="${certificateLink}" 
           style="background-color: #2e7d32; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
           View Certificate
        </a>
      </div>

      <p style="font-size: 14px; color: #555;">
        You can also access and download your certificate anytime from your AerthX dashboard.
      </p>

      <hr style="margin: 25px 0;" />

      <p style="font-size: 14px; color: #777; text-align: center;">
        Thank you for supporting climate action 🌍 <br/>
        <strong>AerthX Team</strong>
      </p>

    </div>

  </div>
  `,
}); 
} catch (err) {
  console.log("Email failed but payment success:", err.message);
}

  const updated = await CarbonProject.findOneAndUpdate(
  {
    _id: projectId,
    remainingTons: { $gte: tons },
  },
  {
    $inc: { remainingTons: -tons },
  },
  { new: true }
);

if (!updated) {
  return res.status(400).json({
    success: false,
    message: "Stock changed, try again",
  });
}

  return res.json({
    success: true,
    message: "Carbon credits purchased successfully",
  });
}

    // ✅ STEP 2: VALIDATIONS
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "paymentMethod is required",
      });
    }


    // 🔒 STEP 3: CHECK EXISTING ACTIVE SUBSCRIPTION
    const existing = await Subscription.findOne({
      userId,
      endDate: { $gt: new Date() },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already has an active subscription",
      });
    }

    // 📅 STEP 4: DATE CALCULATION
  // 📅 STEP 4: DATE CALCULATION

if (!["monthly", "yearly"].includes(duration)) {
  return res.status(400).json({
    success: false,
    message: "Invalid duration",
  });
}

const startDate = new Date();
const endDate = new Date(startDate); // important: clone, not new Date()

if (duration === "monthly") {
  endDate.setMonth(endDate.getMonth() + 1);
} else if (duration === "yearly") {
  endDate.setFullYear(endDate.getFullYear() + 1);
}

    // 🧠 STEP 5: NORMALIZE DATA
    const normalizedUserType = userType.toLowerCase();

    // 💾 STEP 6: SAVE TO DATABASE
    await Subscription.create({
      userId,
      userType: normalizedUserType,
      plan,
      duration,
      paymentMethod,
      razorpay_payment_id,
      razorpay_order_id,
      startDate,
      endDate,
      status: "active",
    });

await sendEmail({
  to: userData?.email,
  subject: "🚀 Subscription Activated - AerthX",
  html: `
    <h2>Subscription Activated 🎉</h2>
    <p>Hi ${userData?.name || userData?.orgName},</p>

    <p>Your subscription has been successfully activated.</p>

    <ul>
      <li><strong>Plan:</strong> ${plan}</li>
      <li><strong>Duration:</strong> ${duration}</li>
      <li><strong>Status:</strong> Active</li>
    </ul>

    <p>You're now part of AerthX's sustainability ecosystem.</p>

    <br/>
    <p>— Team AerthX 🌍</p>
  `,
});

    // ✅ RESPONSE
    res.json({
      success: true,
      message: "Payment verified & subscription activated",
    });

  } catch (error) {
  console.error("🔥 VERIFY ERROR FULL:", error);

  res.status(500).json({
    success: false,
    message: error.message, // 🔥 THIS IS IMPORTANT
  });
}
};

exports.getMySubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    if (String(userId) !== String(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only access your own subscription" });
    }

    const subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      return res.json({
        status: "none",
        plan: null,
      });
    }

    const isActive = subscription.endDate > new Date();

    res.json({
      status: isActive ? "active" : "expired",
      plan: subscription.plan,
      endDate: subscription.endDate,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching subscription",
    });
  }
};

exports.getMyCertificates = async (req, res) => {
  try {
    const { userId } = req.params;
    if (String(userId) !== String(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only access your own certificates" });
    }

    const certificates = await CarbonPurchase.find({
      userId,
      status: "completed",
    }).sort({ createdAt: -1 });

    res.json(certificates);
  }catch (error) {
  console.error("FULL ERROR:", error);

  res.status(500).json({
    message: error.message,
  });
}
};