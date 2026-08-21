const express = require('express');
const router = express.Router();
const CarbonCredit = require('../models/CarbonCredit');
const multer = require('multer');
const path = require('path');
const Individual = require('../models/Individual');
const Organization = require('../models/Organization');
const authMiddleware = require('../middleware/auth');

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

const upload = multer({ storage: multer.memoryStorage() });
const { uploadToImageKit } = require("../utils/imagekit");

router.post('/', authMiddleware, requireAdmin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 }
]), async (req, res) => {
  try {
 const data = req.body;

let imagePath = "";

if (req.files?.image?.[0]) {
  const result = await uploadToImageKit(
    req.files.image[0].buffer,
    `credit_${Date.now()}`,
    "/carbonCredits"
  );

  imagePath = result.url;
}

let backgroundImagePath = "";

if (req.files?.backgroundImage?.[0]) {
  const result = await uploadToImageKit(
    req.files.backgroundImage[0].buffer,
    `credit_bg_${Date.now()}`,
    "/carbonCredits"
  );

  backgroundImagePath = result.url;
}

let certificateId;
let exists = true;

while (exists) {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);

  certificateId = `CERT-AERTHX-${year}-${random}`;

  const existing = await CarbonCredit.findOne({ certificateId });
  if (!existing) exists = false;
}

    const credit = new CarbonCredit({
      title: data.title || '',
      name: data.name || '',
      verifiedBy: data.verifiedBy || '',
      category: data.category || '',
      projectType: data.projectType || '',
      projectDeveloper: data.projectDeveloper || '',
      methodology: data.methodology || '',
      projectDuration: data.projectDuration || '',
      tons: parseFloat(data.tons) || 0,
      pricePerTon: parseFloat(data.pricePerTon) || 0,
      totalPrice: (parseFloat(data.pricePerTon) || 0) * (parseFloat(data.tons) || 0),
      info: data.info || '',
      country: data.country || '',
      state: data.state || '',
      city: data.city || '',
      placeName: data.placeName || '',
      vintage: data.vintage || '',
      vintageYear: data.vintageYear || '',
      retired: data.retired === 'true' || data.retired === true,
      sdgs: typeof data.sdgs === 'string' ? data.sdgs.split(',').map(s => s.trim()) : [],
      registryLink: data.registryLink || '',
      additionalNotes: data.additionalNotes || '',
      image: imagePath,
      backgroundImage: backgroundImagePath,
      isActive: true,
      isArchived: false,
  certificateId: certificateId,
registrySerialNumbers: data.registrySerialNumbers || "Pending",
retirementStatus: data.retirementStatus || "pending",
retirementDate: data.retirementDate || null,
      remainingTons: parseFloat(data.tons) || 0,
      impactScore: parseFloat(data.impactScore) || 0,
      impactMetrics: {
        co2Avoided: parseFloat(data['impactMetrics[co2Avoided]']) || 0,
        treesPlanted: parseFloat(data['impactMetrics[treesPlanted]']) || 0,
        communitiesBenefited: parseFloat(data['impactMetrics[communitiesBenefited]']) || 0,
        energyGenerated: parseFloat(data['impactMetrics[energyGenerated]']) || 0,
      }
    });

    await credit.save();
    res.status(201).json({ message: 'Carbon Credit Created', data: credit });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status } = req.query; 
    let query = { retired: { $ne: true } };

    if (status === "active") query.isActive = true;
    else if (status === "inactive") query.isActive = false;

    const credits = await CarbonCredit.find(query).sort({ createdAt: -1 });
    res.status(200).json(credits);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch credits', error: err.message });
  }
});

router.get('/active', async (req, res) => {
  try {
    const credits = await CarbonCredit.find({
      retired: { $ne: true },
      isActive: true,
      isArchived: false,
      remainingTons: { $gt: 0 }
    }).sort({ impactScore: -1, createdAt: -1 });

    res.status(200).json(credits);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch active credits', error: err.message });
  }
});

router.get('/total-tons', async (req, res) => {
  try {
    const result = await CarbonCredit.aggregate([
      {
        $match: {
          retired: { $ne: true },
          isActive: true,
          isArchived: false
        }
      },
      {
        $group: {
          _id: null,
          remainingTons: {
            $sum: { $ifNull: ["$remainingTons", "$tons"] }
          }
        }
      }
    ]);

    const remainingTons = result[0]?.remainingTons || 0;
    res.json({ remainingTons });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch remaining tons", error: err.message });
  }
});

// Public single-project endpoint. Keep this before admin mutation routes so the
// Marketplace can fetch one project without downloading the full catalog.
router.get('/:id', async (req, res) => {
  try {
    if (!require('mongoose').isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project id' });
    }

    const credit = await CarbonCredit.findOne({
      _id: req.params.id,
      retired: { $ne: true },
      isActive: true,
      isArchived: false
    });

    if (!credit) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(credit);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch project', error: err.message });
  }
});

router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    await CarbonCredit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
});

router.put('/:id', authMiddleware, requireAdmin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = req.body;


// 🔥 KEEP EXISTING CERTIFICATE ID
const existingCredit = await CarbonCredit.findById(req.params.id);
if (!existingCredit) {
  return res.status(404).json({ message: "Credit not found" });
}

let imagePath = existingCredit.image;

if (req.files?.image?.[0]?.buffer) {
  try {
    const result = await uploadToImageKit(
      req.files.image[0].buffer,
      `credit_${Date.now()}`,
      "/carbonCredits"
    );

    imagePath = result.url;
  } catch (err) {
    console.error("Image upload failed:", err.message);
  }
}

let backgroundImagePath = existingCredit.backgroundImage;

if (req.files?.backgroundImage?.[0]?.buffer) {
  try {
    const result = await uploadToImageKit(
      req.files.backgroundImage[0].buffer,
      `credit_bg_${Date.now()}`,
      "/carbonCredits"
    );

    backgroundImagePath = result.url;
  } catch (err) {
    console.error("Background upload failed:", err.message);
  }
}
let certificateId = existingCredit?.certificateId;

// 🔥 IF MISSING (rare case) → generate
if (!certificateId) {
  let exists = true;

  while (exists) {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);

    certificateId = `CERT-AERTHX-${year}-${random}`;

    const found = await CarbonCredit.findOne({ certificateId });
    if (!found) exists = false;
  }
}

    const updateData = {
      title: data.title || '',
      name: data.name || '',
      verifiedBy: data.verifiedBy || '',
      category: data.category || '',
      projectType: data.projectType || '',
      projectDeveloper: data.projectDeveloper || '',
      methodology: data.methodology || '',
      projectDuration: data.projectDuration || '',
      tons: parseFloat(data.tons) || 0,
      pricePerTon: parseFloat(data.pricePerTon) || 0,
      totalPrice: (parseFloat(data.pricePerTon) || 0) * (parseFloat(data.tons) || 0),
      info: data.info || '',
      country: data.country || '',
      state: data.state || '',
      city: data.city || '',
      placeName: data.placeName || '',
      vintage: data.vintage || '',
      vintageYear: data.vintageYear || '',
      retired: data.retired === 'true' || data.retired === true,
      sdgs: typeof data.sdgs === 'string' ? data.sdgs.split(',').map(s => s.trim()) : [],
      registryLink: data.registryLink || '',
      additionalNotes: data.additionalNotes || '',
      image: imagePath,
      backgroundImage: backgroundImagePath,
      isActive: true,
      isArchived: false,
      certificateId: certificateId,
registrySerialNumbers: data.registrySerialNumbers || "Pending",
retirementStatus: data.retirementStatus || "pending",
retirementDate: data.retirementDate || null,
      impactScore: parseFloat(data.impactScore) || 0,
      impactMetrics: {
        co2Avoided: parseFloat(data['impactMetrics[co2Avoided]']) || 0,
        treesPlanted: parseFloat(data['impactMetrics[treesPlanted]']) || 0,
        communitiesBenefited: parseFloat(data['impactMetrics[communitiesBenefited]']) || 0,
        energyGenerated: parseFloat(data['impactMetrics[energyGenerated]']) || 0,
      }
    };

    if (data.tons) {
      updateData.remainingTons = parseFloat(data.tons);
    }

    const updatedCredit = await CarbonCredit.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ message: "Carbon Credit Updated", data: updatedCredit });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

router.get('/certificate/:id', async (req, res) => {
  try {
    const credit = await CarbonCredit.findOne({
      certificateId: req.params.id
    });

    if (!credit) {
      return res.status(404).json({
        success: false,
        message: "Invalid Certificate"
      });
    }

    res.status(200).json({
      success: true,
      certificateId: credit.certificateId,
      projectName: credit.name,
      tons: credit.tons,
      registrySerialNumbers: credit.registrySerialNumbers,
      retirementStatus: credit.retirementStatus,
      retirementDate: credit.retirementDate
    });

  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
});

module.exports = router;
