const PricingConfig = require("../models/PricingConfig");

const getPricing = async (req, res) => {
  try {
    const userType = req.query.userType;

    const config = await PricingConfig.findOne({
      configId: "pricing_master",
    });

    if (!config) {
      return res.status(404).json({ message: "Pricing config not found" });
    }

    const plans = Array.from(config.plans.values()).map((plan) => ({
      name: plan.name,

      price:
        userType === "organization"
          ? plan.monthly?.organization
          : plan.monthly?.individual,

      // 🔥 FIXED HERE
      features: Object.values(plan.features || {}).map((f) => {
        if (typeof f === "string") return f;
        if (f.label) return f.label;
        if (f.name) return f.name;
        return "Feature";
      }),

      highlight: plan.highlight,
    }));

    res.json({ plans });
  } catch (error) {
    console.error("🔥 Pricing Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getPricing,
};