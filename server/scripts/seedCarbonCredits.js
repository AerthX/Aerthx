require("dotenv").config();
const mongoose = require("mongoose");
const CarbonCredit = require("../models/CarbonCredit");

const seedProjects = [
  {
    seedKey: "demo-rajasthan-solar-2024",
    certificateId: "CERT-AERTHX-DEMO-001",
    title: "Rajasthan Solar Energy Initiative",
    name: "Jodhpur Solar Park Carbon Project",
    verifiedBy: "Verra",
    category: "Renewable Energy",
    projectType: "Solar",
    projectDeveloper: "AerthX Renewable Partners",
    methodology: "ACM0002",
    projectDuration: "2024–2034",
    tons: 50000,
    pricePerTon: 850,
    info: "A utility-scale solar project reducing emissions by replacing carbon-intensive electricity generation in Rajasthan.",
    country: "India",
    state: "Rajasthan",
    city: "Jodhpur",
    placeName: "Jodhpur Solar Park",
    vintage: "2024",
    vintageYear: "2024",
    sdgs: ["SDG 7 – Affordable and Clean Energy", "SDG 8 – Decent Work", "SDG 13 – Climate Action"],
    registryLink: "https://registry.verra.org/",
    additionalNotes: "Demo marketplace record for development and UI testing.",
    impactScore: 94,
    impactMetrics: { co2Avoided: 50000, treesPlanted: 125000, communitiesBenefited: 1800, energyGenerated: 92000000 },
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=85",
    backgroundImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1800&q=85"
  },
  {
    seedKey: "demo-gujarat-wind-2024",
    certificateId: "CERT-AERTHX-DEMO-002",
    title: "Gujarat Wind Energy Project",
    name: "Kutch Wind Power Initiative",
    verifiedBy: "Gold Standard",
    category: "Renewable Energy",
    projectType: "Wind",
    projectDeveloper: "AerthX Wind Collective",
    methodology: "ACM0002",
    projectDuration: "2024–2032",
    tons: 35000,
    pricePerTon: 920,
    info: "Wind generation in the Kutch region helping displace fossil-fuel electricity while supporting local employment.",
    country: "India",
    state: "Gujarat",
    city: "Kutch",
    placeName: "Kutch Wind Corridor",
    vintage: "2024",
    vintageYear: "2024",
    sdgs: ["SDG 7 – Affordable and Clean Energy", "SDG 8 – Decent Work", "SDG 13 – Climate Action"],
    registryLink: "https://www.goldstandard.org/",
    additionalNotes: "Demo marketplace record for development and UI testing.",
    impactScore: 91,
    impactMetrics: { co2Avoided: 35000, treesPlanted: 80000, communitiesBenefited: 1100, energyGenerated: 76000000 },
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=85",
    backgroundImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1800&q=85"
  },
  {
    seedKey: "demo-maharashtra-forest-2023",
    certificateId: "CERT-AERTHX-DEMO-003",
    title: "Maharashtra Forest Restoration Program",
    name: "Western Ghats Community Forest Restoration",
    verifiedBy: "Verra",
    category: "Forestry",
    projectType: "Afforestation & Reforestation",
    projectDeveloper: "AerthX Nature Network",
    methodology: "VM0007",
    projectDuration: "2023–2043",
    tons: 18000,
    pricePerTon: 1250,
    info: "Community-led restoration of degraded forest landscapes in the Western Ghats with biodiversity and livelihood co-benefits.",
    country: "India",
    state: "Maharashtra",
    city: "Nashik",
    placeName: "Western Ghats Restoration Zone",
    vintage: "2023",
    vintageYear: "2023",
    sdgs: ["SDG 13 – Climate Action", "SDG 15 – Life on Land", "SDG 1 – No Poverty"],
    registryLink: "https://registry.verra.org/",
    additionalNotes: "Demo marketplace record for development and UI testing.",
    impactScore: 97,
    impactMetrics: { co2Avoided: 18000, treesPlanted: 210000, communitiesBenefited: 2400, energyGenerated: 0 },
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85",
    backgroundImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=85"
  },
  {
    seedKey: "demo-punjab-biogas-2024",
    certificateId: "CERT-AERTHX-DEMO-004",
    title: "Punjab Farm Biogas Program",
    name: "Clean Biogas for Agricultural Communities",
    verifiedBy: "Gold Standard",
    category: "Waste Management",
    projectType: "Biogas",
    projectDeveloper: "AerthX Circular Energy",
    methodology: "AMS-III.D",
    projectDuration: "2024–2031",
    tons: 22000,
    pricePerTon: 700,
    info: "Agricultural waste is converted into useful biogas, reducing methane emissions and improving rural energy access.",
    country: "India",
    state: "Punjab",
    city: "Ludhiana",
    placeName: "Punjab Agricultural Belt",
    vintage: "2024",
    vintageYear: "2024",
    sdgs: ["SDG 7 – Affordable and Clean Energy", "SDG 12 – Responsible Consumption", "SDG 13 – Climate Action"],
    registryLink: "https://www.goldstandard.org/",
    additionalNotes: "Demo marketplace record for development and UI testing.",
    impactScore: 88,
    impactMetrics: { co2Avoided: 22000, treesPlanted: 45000, communitiesBenefited: 3200, energyGenerated: 12000000 },
    image: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1200&q=85",
    backgroundImage: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1800&q=85"
  },
  {
    seedKey: "demo-himachal-hydro-2022",
    certificateId: "CERT-AERTHX-DEMO-005",
    title: "Himachal Small Hydro Project",
    name: "Himalayan Run-of-River Clean Power",
    verifiedBy: "Verra",
    category: "Renewable Energy",
    projectType: "Hydro",
    projectDeveloper: "AerthX Clean Power",
    methodology: "ACM0002",
    projectDuration: "2022–2030",
    tons: 15000,
    pricePerTon: 1100,
    info: "Run-of-river hydropower providing renewable electricity while maintaining a low land footprint.",
    country: "India",
    state: "Himachal Pradesh",
    city: "Kullu",
    placeName: "Himalayan River Basin",
    vintage: "2022",
    vintageYear: "2022",
    sdgs: ["SDG 6 – Clean Water", "SDG 7 – Affordable and Clean Energy", "SDG 13 – Climate Action"],
    registryLink: "https://registry.verra.org/",
    additionalNotes: "Demo marketplace record for development and UI testing.",
    impactScore: 89,
    impactMetrics: { co2Avoided: 15000, treesPlanted: 30000, communitiesBenefited: 900, energyGenerated: 44000000 },
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
    backgroundImage: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=85"
  },
  {
    seedKey: "demo-odisha-mangrove-2023",
    certificateId: "CERT-AERTHX-DEMO-006",
    title: "Odisha Mangrove Restoration",
    name: "Coastal Blue Carbon Restoration Initiative",
    verifiedBy: "Verra",
    category: "Nature Based",
    projectType: "Mangrove Restoration",
    projectDeveloper: "AerthX Blue Carbon Foundation",
    methodology: "VM0033",
    projectDuration: "2023–2043",
    tons: 12000,
    pricePerTon: 1450,
    info: "Restoration of coastal mangrove ecosystems that store carbon while improving resilience for fishing communities.",
    country: "India",
    state: "Odisha",
    city: "Bhubaneswar",
    placeName: "Odisha Coastal Restoration Zone",
    vintage: "2023",
    vintageYear: "2023",
    sdgs: ["SDG 13 – Climate Action", "SDG 14 – Life Below Water", "SDG 15 – Life on Land"],
    registryLink: "https://registry.verra.org/",
    additionalNotes: "Demo marketplace record for development and UI testing.",
    impactScore: 99,
    impactMetrics: { co2Avoided: 12000, treesPlanted: 95000, communitiesBenefited: 1700, energyGenerated: 0 },
    image: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=85",
    backgroundImage: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1800&q=85"
  },
  {
    seedKey: "demo-karnataka-agriculture-2024",
    certificateId: "CERT-AERTHX-DEMO-007",
    title: "Karnataka Regenerative Agriculture",
    name: "Soil Carbon and Sustainable Farming Program",
    verifiedBy: "Gold Standard",
    category: "Agriculture",
    projectType: "Regenerative Agriculture",
    projectDeveloper: "AerthX Sustainable Farms",
    methodology: "Agriculture Soil Carbon",
    projectDuration: "2024–2034",
    tons: 20000,
    pricePerTon: 980,
    info: "Improved soil management practices designed to build soil carbon, reduce inputs, and strengthen farmer resilience.",
    country: "India",
    state: "Karnataka",
    city: "Mysuru",
    placeName: "Mysuru Agricultural Cluster",
    vintage: "2024",
    vintageYear: "2024",
    sdgs: ["SDG 2 – Zero Hunger", "SDG 12 – Responsible Consumption", "SDG 13 – Climate Action"],
    registryLink: "https://www.goldstandard.org/",
    additionalNotes: "Demo marketplace record for development and UI testing.",
    impactScore: 93,
    impactMetrics: { co2Avoided: 20000, treesPlanted: 60000, communitiesBenefited: 2800, energyGenerated: 0 },
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85",
    backgroundImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=85"
  },
  {
    seedKey: "demo-assam-cooking-2024",
    certificateId: "CERT-AERTHX-DEMO-008",
    title: "Assam Clean Cooking Program",
    name: "Efficient Cookstoves for Rural Communities",
    verifiedBy: "Gold Standard",
    category: "Community",
    projectType: "Clean Cooking",
    projectDeveloper: "AerthX Community Energy",
    methodology: "AMS-II.G",
    projectDuration: "2024–2032",
    tons: 40000,
    pricePerTon: 650,
    info: "Efficient cooking technologies that reduce fuel consumption, indoor air pollution, and household emissions.",
    country: "India",
    state: "Assam",
    city: "Guwahati",
    placeName: "Assam Rural Communities",
    vintage: "2024",
    vintageYear: "2024",
    sdgs: ["SDG 3 – Good Health", "SDG 5 – Gender Equality", "SDG 7 – Affordable and Clean Energy"],
    registryLink: "https://www.goldstandard.org/",
    additionalNotes: "Demo marketplace record for development and UI testing.",
    impactScore: 90,
    impactMetrics: { co2Avoided: 40000, treesPlanted: 70000, communitiesBenefited: 8500, energyGenerated: 0 },
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=85",
    backgroundImage: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1800&q=85"
  },
  {
    seedKey: "demo-maharashtra-ev-2024",
    certificateId: "CERT-AERTHX-DEMO-009",
    title: "Maharashtra Electric Mobility Transition",
    name: "Clean Urban Mobility Carbon Reduction Program",
    verifiedBy: "Verra",
    category: "Transport",
    projectType: "Electric Mobility",
    projectDeveloper: "AerthX Mobility Labs",
    methodology: "Transport Emissions Reduction",
    projectDuration: "2024–2034",
    tons: 28000,
    pricePerTon: 1050,
    info: "Accelerating electric mobility adoption in urban fleets and reducing transport-related greenhouse gas emissions.",
    country: "India",
    state: "Maharashtra",
    city: "Pune",
    placeName: "Pune Urban Mobility Network",
    vintage: "2024",
    vintageYear: "2024",
    sdgs: ["SDG 9 – Industry and Infrastructure", "SDG 11 – Sustainable Cities", "SDG 13 – Climate Action"],
    registryLink: "https://registry.verra.org/",
    additionalNotes: "Demo marketplace record for development and UI testing.",
    impactScore: 87,
    impactMetrics: { co2Avoided: 28000, treesPlanted: 42000, communitiesBenefited: 4200, energyGenerated: 0 },
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85",
    backgroundImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=85"
  },
  {
    seedKey: "demo-delhi-waste-2024",
    certificateId: "CERT-AERTHX-DEMO-010",
    title: "Delhi Waste-to-Resource Program",
    name: "Municipal Organic Waste Diversion Initiative",
    verifiedBy: "Verra",
    category: "Waste Management",
    projectType: "Organic Waste Diversion",
    projectDeveloper: "AerthX Circular Cities",
    methodology: "ACM0022",
    projectDuration: "2024–2030",
    tons: 30000,
    pricePerTon: 780,
    info: "Diverting organic municipal waste from uncontrolled disposal and improving methane capture and resource recovery.",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    placeName: "Delhi Circular Waste Network",
    vintage: "2024",
    vintageYear: "2024",
    sdgs: ["SDG 11 – Sustainable Cities", "SDG 12 – Responsible Consumption", "SDG 13 – Climate Action"],
    registryLink: "https://registry.verra.org/",
    additionalNotes: "Demo marketplace record for development and UI testing.",
    impactScore: 86,
    impactMetrics: { co2Avoided: 30000, treesPlanted: 35000, communitiesBenefited: 5200, energyGenerated: 8500000 },
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=85",
    backgroundImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1800&q=85"
  }
];

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured. Add it to server/.env before seeding.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for carbon-credit seed.");

  const reset = process.argv.includes("--reset");
  if (reset) {
    const deleted = await CarbonCredit.deleteMany({ seedKey: { $regex: /^demo-/ } });
    console.log(`Removed ${deleted.deletedCount} existing demo carbon-credit records.`);
  }

  let created = 0;
  let updated = 0;

  for (const project of seedProjects) {
    const payload = {
      ...project,
      retired: false,
      retirementStatus: "pending",
      retirementDate: null,
      isActive: true,
      isArchived: false,
      remainingTons: project.tons
    };

    const result = await CarbonCredit.updateOne(
      { seedKey: project.seedKey },
      { $set: payload, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );

    if (result.upsertedCount) created += 1;
    else if (result.modifiedCount) updated += 1;
  }

  console.log(`Seed complete: ${created} created, ${updated} updated.`);
  console.log(`Demo records available: ${seedProjects.length}`);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error("Carbon-credit seed failed:", error.message);
  try { await mongoose.disconnect(); } catch (_) {}
  process.exit(1);
});
