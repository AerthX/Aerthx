const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
    key: { type: String, required: true },
    label: { type: String, required: true },
}, { _id: false });

const featureGroupSchema = new mongoose.Schema({
    groupTitle: { type: String, required: true },
    features: [featureSchema],
}, { _id: false });

const planFeaturesSchema = new mongoose.Schema({}, { strict: false, _id: false });

const planSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    monthly: { type: mongoose.Schema.Types.Mixed, required: true },
    yearly: { type: mongoose.Schema.Types.Mixed, required: true },
    highlight: { type: Boolean, default: false },
    features: planFeaturesSchema,
}, { _id: false });

const PricingConfigSchema = new mongoose.Schema({
    configId: { type: String, default: 'pricing_master', unique: true, required: true },
    plans: {
        type: Map,
        of: planSchema,
        required: true
    },
    featureGroups: {
        type: [featureGroupSchema],
        required: false,
        default: []
    },
}, { timestamps: true });

const PricingConfig = mongoose.model('PricingConfig', PricingConfigSchema);

module.exports = PricingConfig;