const mongoose = require('mongoose');

const CarbonCreditSchema = new mongoose.Schema({
  seedKey: { type: String, unique: true, sparse: true, index: true },
  image: { type: String },
  backgroundImage: { type: String },
  title: { type: String, required: true },
  name: { type: String, required: true },
  verifiedBy: { type: String },
  category: { type: String },
  projectType: { type: String },
  projectDeveloper: { type: String },
  methodology: { type: String },
  projectDuration: { type: String },
  tons: { type: Number },
  pricePerTon: { type: Number },
  totalPrice: { type: Number },
  info: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  placeName: { type: String },
  vintage: { type: String },
  vintageYear: { type: String },
  retired: { type: Boolean, default: false },
  sdgs: { type: [String] },
  registryLink: { type: String },
  additionalNotes: { type: String },
   impactScore: { type: Number, default: 0 }, 
  impactMetrics: { 
    co2Avoided: { type: Number, default: 0 },
    treesPlanted: { type: Number, default: 0 },
    communitiesBenefited: { type: Number, default: 0 },
    energyGenerated: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  remainingTons: { type: Number, default: function() { return this.tons || 0; } },
  certificateId: { type: String, unique: true },
verificationUrl: { type: String },
registrySerialNumbers: { type: String }, // from Verra
retirementStatus: { 
  type: String, 
  enum: ["pending", "retired"], 
  default: "pending" 
},
retirementDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CarbonCredit', CarbonCreditSchema);
