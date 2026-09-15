const PricingConfig = require("../models/PricingConfig");
const IndividualPricingConfig = require("../models/IndividualPricingConfig");

const getPricing = async (req, res) => {
  try {
    // Only pricing logic uses lowercase.
    // Existing "Organization" / "Individual" values elsewhere stay unchanged.
    const userType = String(req.user.userType).toLowerCase();

    let config;

    if (userType === "organization") {
      // Organization pricing
      config = await PricingConfig.findOne({
        configId: "pricing_master",
      });
    } else {
      // Individual pricing
      config = await IndividualPricingConfig.findOne({
        configId: "individual_pricing",
      });
    }

    if (!config) {
      return res.status(404).json({
        message: `${userType} pricing config not found`,
      });
    }

    const plans =
      config.plans instanceof Map
        ? Object.fromEntries(config.plans)
        : config.plans || {};

    return res.status(200).json({
      plans,
      featureGroups: config.featureGroups || [],
      userType,
    });
  } catch (error) {
    console.error("🔥 Pricing Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getPricing,
};