const IndividualPricingConfig = require("../models/IndividualPricingConfig");


// ===================== GET =====================
const getIndividualPricing = async (req, res) => {
  try {
    let config = await IndividualPricingConfig.findOne({
      configId: "individual_pricing",
    });

    if (!config) {
      config = await IndividualPricingConfig.create({
        plans: {
          plan_1: {
            id: "plan_1",
            name: "Basic",
            monthly: 0,
            yearly: 0,
            highlight: false,
            features: {},
          },
          plan_2: {
            id: "plan_2",
            name: "Pro",
            monthly: 0,
            yearly: 0,
            highlight: true,
            features: {},
          },
          plan_3: {
            id: "plan_3",
            name: "Custom",
            monthly: "Custom",
            yearly: "Custom",
            highlight: false,
            features: {},
          },
        },
        featureGroups: [],
      });
    }

    res.status(200).json({
         message: "Updated successfully",
    plans: Object.fromEntries(config.plans),
      featureGroups: config.featureGroups,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


// ===================== UPDATE =====================
const updateIndividualPricing = async (req, res) => {
  try {
    let { plans, featureGroups } = req.body;
    // 🔥 NORMALIZE DATA BEFORE SAVE
Object.keys(plans).forEach(planId => {
  const plan = plans[planId];

  // Fix prices
  if (plan.monthly !== "Custom") {
    plan.monthly = Number(plan.monthly);
  }

  if (plan.yearly !== "Custom") {
    plan.yearly = Number(plan.yearly);
  }

  // Fix features
  const features = plan.features || {};

  Object.keys(features).forEach(key => {
    let val = features[key];

    // convert string → boolean
    if (val === "true") val = true;
    else if (val === "false") val = false;

    // 🔥 force boolean
    if (typeof val !== "boolean") {
      val = false;
    }

    features[key] = val;
  });

  plan.features = features;
});

    const updated = await IndividualPricingConfig.findOneAndUpdate(
      { configId: "individual_pricing" },
      { plans, featureGroups },
      { new: true, upsert: true }
    );

   res.status(200).json({
  message: "Updated successfully",
  plans: Object.fromEntries(updated.plans),
  featureGroups: updated.featureGroups,
});
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};



// ===================== DELETE =====================
// Option 1: FULL RESET
const deleteIndividualPricing = async (req, res) => {
  try {
    await IndividualPricingConfig.findOneAndDelete({
      configId: "individual_pricing",
    });

    res.status(200).json({
      message: "Pricing config deleted",
    });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};



// ===================== RESET TO DEFAULT =====================
const resetIndividualPricing = async (req, res) => {
  try {
    const defaultData = {
      plans: {
        plan_1: {
          id: "plan_1",
          name: "Basic",
          monthly: 0,
          yearly: 0,
          highlight: false,
          features: {},
        },
        plan_2: {
          id: "plan_2",
          name: "Pro",
          monthly: 0,
          yearly: 0,
          highlight: true,
          features: {},
        },
        plan_3: {
          id: "plan_3",
          name: "Custom",
          monthly: "Custom",
          yearly: "Custom",
          highlight: false,
          features: {},
        },
      },
      featureGroups: [],
    };

    const updated = await IndividualPricingConfig.findOneAndUpdate(
      { configId: "individual_pricing" },
      defaultData,
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Reset successful",
      plans: updated.plans,
      featureGroups: updated.featureGroups,
    });

  } catch (error) {
    res.status(500).json({ message: "Reset failed" });
  }
};



module.exports = {
  getIndividualPricing,
  updateIndividualPricing,
  deleteIndividualPricing,
  resetIndividualPricing,
};