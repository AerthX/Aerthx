import React from "react";
import { motion } from "framer-motion";
import heroBg from "../assets/new_aerthx.jpeg"; // <-- replace with your actual background image
import {
  FaLeaf,
  FaChartBar,
  FaFileAlt,
  FaCertificate,
  FaAward,
  FaDatabase,
  FaCogs,
  FaCheckCircle,
  FaHandshake,
  FaLock,
  FaRegLightbulb,
  FaUsers,
  FaFileDownload,
  FaHeadset,
  FaChartLine,
} from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/* ---------------------------------------------------------------
   Animation variants
---------------------------------------------------------------- */
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

/* ---------------------------------------------------------------
   Small building blocks
---------------------------------------------------------------- */
const GlowingButton = ({ children, className = "", ...props }) => (
  <motion.button
    className={`relative px-7 py-3 rounded-full text-sm sm:text-base font-bold overflow-hidden group bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.45)] ${className}`}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    {...props}
  >
    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <span className="relative z-10 flex items-center justify-center">{children}</span>
  </motion.button>
);

const OutlineButton = ({ children, className = "", ...props }) => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className={`px-7 py-3 rounded-full text-sm sm:text-base font-bold border border-white/30 text-white hover:bg-white/10 transition-colors duration-300 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

/* ---------------------------------------------------------------
   Main component
---------------------------------------------------------------- */
const Services = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const accessToken = localStorage.getItem("accessToken");
  const marketplaceUrl = import.meta.env.VITE_MARKETPLACE_URL || "http://localhost:5174";

  const handleGetStarted = () => {
    if (accessToken || user) {
      const userType = localStorage.getItem("userType") || "";
      const userJson = localStorage.getItem("user") || "";
      const handoff = `${marketplaceUrl}/?accessToken=${encodeURIComponent(accessToken || "")}&userType=${encodeURIComponent(userType)}&user=${encodeURIComponent(userJson)}`;
      window.location.assign(handoff);
      return;
    }
    navigate("/register-choice");
  };

  const scrollToServices = () => {
    document.getElementById("core-services")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePlans = () => navigate("/pricing");
  const coreServices = [
    {
      icon: <FaLeaf />,
      title: "Carbon Credit Marketplace",
      description:
        "Seamlessly purchase verified carbon credits and track your retirement progress in real-time.",
    },
    {
      icon: <FaChartBar />,
      title: "Impact Analytics Dashboard",
      description:
        "Access intuitive dashboards with real-time analytics, transaction history, and progress tracking.",
    },
    {
      icon: <FaCertificate />,
      title: "Carbon Offset Certificates",
      description:
        "Receive branded, verifiable certificates to proudly showcase your organization's climate action.",
    },
    {
      icon: <FaAward />,
      title: "Digital Badges",
      description:
        "Earn and display digital badges that highlight your environmental contributions across platforms.",
    },
  ];

  const advancedFeatures = [
    {
      icon: <FaFileAlt />,
      iconBg: "bg-violet-100 text-violet-600",
      title: "BRSR & SDG Reports",
      description: "Generate reports compliant with the BRSR framework and UN SDGs.",
    },
    {
      icon: <FaFileDownload />,
      iconBg: "bg-orange-100 text-orange-600",
      title: "Downloadable Certificates",
      description:
        "Easily download and share official sustainability certificates in high-resolution formats.",
    },
    {
      icon: <FaHeadset />,
      iconBg: "bg-pink-100 text-pink-600",
      title: "Dedicated Account Support",
      description: "Get personalized guidance from sustainability experts.",
    },
    {
      icon: <FaChartLine />,
      iconBg: "bg-blue-100 text-blue-600",
      title: "Data-Driven Analytics",
      description: "Unlock analytics to identify and reduce emissions across the value chain.",
    },
    {
      icon: <FaCogs />,
      iconBg: "bg-slate-100 text-slate-600",
      title: "Customizable Reporting",
      description: "Tailor reports with flexible data filters and layouts.",
    },
    {
      icon: <FaDatabase />,
      iconBg: "bg-emerald-100 text-emerald-600",
      title: "Exclusive Credits",
      description:
        "Get early, exclusive access to limited-edition carbon credit projects before they're released publicly.",
    },
  ];

  const whyChooseUsPoints = [
    {
      icon: <FaLock />,
      title: "Trusted Transparency",
      description:
        "Every carbon credit on our platform is traceable, verified, and securely recorded for complete trust.",
    },
    {
      icon: <FaRegLightbulb />,
      title: "Expert Guidance",
      description:
        "Work with our sustainability experts to design and implement a climate strategy that delivers real results.",
    },
    {
      icon: <FaHandshake />,
      title: "Global Verified Projects",
      description:
        "Explore a diverse portfolio of internationally certified carbon offset projects you can support with confidence.",
    },
    {
      icon: <FaUsers />,
      title: "Community & Impact",
      description:
        "Be part of a growing community committed to environmental stewardship and meaningful climate action.",
    },
  ];

  return (
    <div className="bg-white text-gray-800 font-sans antialiased">
      {/* ============================== HERO ============================== */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* darken / tint overlay so text stays legible over any photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85" />

        <div className="container mx-auto px-6 md:px-10 relative z-10 text-center flex flex-col items-center pt-10">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empowering Your{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-green-400 text-transparent bg-clip-text">
              Sustainable Future
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            AerthX is the all-in-one platform for transparent carbon offsetting,
            verifiable impact reporting, and building a truly green enterprise.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <GlowingButton type="button" onClick={handleGetStarted}>
              Get Started <FiArrowRight className="ml-2" />
            </GlowingButton>
            <OutlineButton type="button" onClick={scrollToServices}>Learn More</OutlineButton>
          </motion.div>
        </div>
      </section>

      {/* ===================== CORE SERVICES (dark cards) ===================== */}
      <section id="core-services" className="relative bg-[#06120c] py-20 sm:py-28">
        {/* subtle ambient glow */}
        <div className="pointer-events-none absolute -top-32 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-14 leading-tight text-white"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            Simplify Your{" "}
            <span className="text-emerald-400">Sustainability Journey</span>
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {coreServices.map((service, index) => (
              <motion.div
                key={index}
                className="group p-7 rounded-2xl bg-emerald-950/40 border border-emerald-400/20 backdrop-blur-sm flex flex-col items-center text-center hover:border-emerald-400/50 hover:bg-emerald-900/40 transition-all duration-300"
                variants={cardVariants}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400 text-2xl mb-6 group-hover:bg-emerald-400/20 transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-emerald-100/70 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== ADVANCED ANALYTICS ===================== */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={textVariants}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                Unlock Deeper{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 text-transparent bg-clip-text">
                  Insights with Advanced Analytics
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Go beyond basic tracking. Our advanced analytics dashboard
                provides comprehensive data on your carbon footprint, offset
                performance, and alignment with global sustainability goals.
                Make data-driven decisions for a greener future.
              </p>
              <ul className="space-y-4 text-gray-700 text-lg">
                {[
                  "Real-time Impact Visualization",
                  "Customizable Reporting Tools",
                  "Predictive Emission Trends",
                ].map((item) => (
                  <li key={item} className="flex items-center">
                    <FaCheckCircle className="text-emerald-500 mr-3 text-xl shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="relative bg-gradient-to-br from-[#0b0f12] to-black p-6 rounded-3xl shadow-2xl border border-gray-800"
              variants={cardVariants}
            >
              <div className="flex justify-between items-center text-gray-300 mb-5">
                <span className="text-sm font-semibold">AerthX Dashboard</span>
                <div className="flex space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-900 p-4 rounded-xl">
                  <h4 className="text-xs text-gray-400 mb-2">Total CO2 Offset</h4>
                  <p className="text-2xl font-bold text-emerald-400 mb-3">
                    12,450 <span className="text-sm font-normal text-gray-400">tonnes</span>
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>
                <div className="bg-gray-900 p-4 rounded-xl">
                  <h4 className="text-xs text-gray-400 mb-2">Projects Engaged</h4>
                  <p className="text-2xl font-bold text-blue-400 mb-3">
                    18 <span className="text-sm font-normal text-gray-400">active</span>
                  </p>
                  <div className="flex space-x-1 h-8 items-end">
                    {[60, 40, 80, 50, 70, 90, 65].map((h, i) => (
                      <div
                        key={i}
                        className="w-2 bg-blue-500 rounded-sm"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-xl">
                <h4 className="text-xs text-gray-400 mb-3">Emission Trends</h4>
                <svg viewBox="0 0 400 120" className="w-full h-24">
                  <polyline
                    fill="none"
                    stroke="url(#trendGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points="0,100 60,80 110,85 160,55 210,60 260,35 310,40 360,10"
                  />
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===================== ENTERPRISE SOLUTIONS ===================== */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 leading-tight text-gray-900"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            Powering Your{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-transparent bg-clip-text">
              Enterprise Solutions
            </span>
          </motion.h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mx-auto mb-14" />

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <div className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-xl text-xl ${feature.iconBg}`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHY CHOOSE US ===================== */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 leading-tight text-gray-900"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            Why Leading Businesses{" "}
            <span className="text-emerald-600">Choose AerthX</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {whyChooseUsPoints.map((point, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-700 shadow-lg shadow-emerald-500/30 mb-6 text-white text-2xl">
                  {point.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {point.title}
                </h3>
                <div className="w-8 h-0.5 bg-emerald-400 rounded-full mb-3" />
                <p className="text-gray-600 text-sm leading-relaxed max-w-[230px]">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 text-white">
        {/* faint wave pattern */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-20"
          viewBox="0 0 1440 200"
          fill="none"
        >
          <path
            d="M0 100C240 160 480 40 720 80C960 120 1200 180 1440 100V200H0V100Z"
            fill="white"
            fillOpacity="0.15"
          />
        </svg>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            className="w-14 h-14 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-300 text-2xl mx-auto mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FaLeaf />
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            Ready to Accelerate Your Impact?
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg max-w-2xl mx-auto mb-10 text-emerald-100/90"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true }}
          >
            Join the growing number of companies and individuals committed to a
            sustainable future. Let's build a{" "}
            <span className="text-emerald-300 font-semibold">better planet together</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <GlowingButton type="button" onClick={handlePlans} className="px-10 py-4 text-base">
              Explore Our Plans <FiArrowRight className="ml-3" />
            </GlowingButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;