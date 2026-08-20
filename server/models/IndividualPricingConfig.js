const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  id: String,
  name: String,
  monthly: mongoose.Schema.Types.Mixed,
  yearly: mongoose.Schema.Types.Mixed,
  highlight: Boolean,
  features: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
}, { _id: false });

const featureSchema = new mongoose.Schema({
  key: String,
  label: String,
}, { _id: false });

const featureGroupSchema = new mongoose.Schema({
  groupTitle: String,
  features: [featureSchema],
}, { _id: false });

const individualPricingSchema = new mongoose.Schema({
  configId: {
    type: String,
    default: "individual_pricing",
    unique: true,
  },

  plans: {
    type: Map,
    of: planSchema,
  },

  featureGroups: [featureGroupSchema],

}, { timestamps: true });

module.exports = mongoose.model("IndividualPricingConfig", individualPricingSchema);