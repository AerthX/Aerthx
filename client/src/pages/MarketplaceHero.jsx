import React from "react";
import { motion } from "framer-motion";
import {
  FaLeaf,
  FaChartLine,
  FaLock,
  FaRocket,
  FaGlobe,
  FaCheckCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import heroBg from "../assets/new_aerthx.jpeg";
import goldstandard from "../assets/gold-standard.png";
import verra from "../assets/Verra-Logo.png";

const features = [
  {
    icon: <FaLeaf />,
    title: "Verified Projects",
    text: "Access 100% certified carbon credits from trusted registries like Verra, Gold Standard, and Climate Action Reserve.",
  },
  {
    icon: <FaChartLine />,
    title: "Live Market Analytics",
    text: "Gain real-time insights with live carbon prices, transaction volumes, and project ratings to make informed decisions.",
  },
  {
    icon: <FaGlobe />,
    title: "Global Coverage",
    text: "Support impactful climate projects worldwide, from reforestation to renewable energy initiatives.",
  },
  {
    icon: <FaRocket />,
    title: "Instant Offsetting",
    text: "Buy credits quickly and receive official certificates instantly with a smooth, hassle-free process.",
  },
  {
    icon: <FaLock />,
    title: "Secure Payments",
    text: "All transactions are protected by top-tier payment gateways and advanced encryption for complete security.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Impact Transparency",
    text: "Track and verify your carbon offset contributions, seeing the real-world impact down to the last ton.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const MarketplaceHero = () => {
  const accessToken = localStorage.getItem("accessToken");
  const userType = localStorage.getItem("userType");
  const marketplaceUrl = import.meta.env.VITE_MARKETPLACE_URL || "http://localhost:5174";

  const marketplaceLink = accessToken
    ? `${marketplaceUrl}/?accessToken=${encodeURIComponent(accessToken)}&userType=${encodeURIComponent(userType || "")}&user=${encodeURIComponent(localStorage.getItem("user") || "")}`
    : marketplaceUrl;

  return (
    <section className="font-sans text-white overflow-x-hidden bg-black">
      {/* HERO */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 bg-black overflow-hidden">
        <img
          src={heroBg}
          alt="Marketplace Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl text-center flex flex-col items-center justify-center px-2"
        >
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-green-400 border border-green-500/40 bg-green-500/10 rounded-full px-4 py-1.5 mb-6">
            <FaLeaf className="text-green-400" />
            Powering Smarter Climate Action
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 sm:mb-6 text-white leading-tight tracking-tight">
            The Carbon Credit Marketplace{" "}
            <span className="block md:inline">
              for a{" "}
              <span className="text-green-400 drop-shadow">
                Sustainable Future
              </span>
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed mb-8 sm:mb-10 max-w-2xl px-2">
            AerthX connects you to certified carbon credit projects worldwide.
            Take meaningful climate action with transparency, trust, and ease.
          </p>

          <motion.a
            href={marketplaceLink}
                        className="group relative inline-flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm sm:text-lg py-3.5 sm:py-4 px-8 sm:px-14 rounded-full shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all duration-300 will-change-transform w-full sm:w-auto"
            whileHover={{ scale: 1.03 }}
          >
            <span>Explore Marketplace</span>
            <FaExternalLinkAlt className="text-sm" />
          </motion.a>
        </motion.div>
      </div>

      {/* FEATURES */}
      <div className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-black relative">
        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="relative bg-gradient-to-b from-green-950/40 to-black rounded-2xl p-6 sm:p-8 border border-green-900/50 hover:border-green-500/50 transition-all duration-300 will-change-transform"
            >
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500/10 text-green-400 text-2xl sm:text-3xl mb-5 sm:mb-6 border border-green-500/20">
                {item.icon}
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 text-white">
                {item.title}
              </h3>
              <div className="w-10 h-0.5 bg-green-500 mb-3 sm:mb-4"></div>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* PARTNERS + CTA */}
      <div className="py-14 sm:py-20 bg-black px-4 sm:px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="border border-green-900/50 rounded-2xl bg-green-950/10 py-8 sm:py-10 px-4 sm:px-8 text-center mb-14 sm:mb-20"
          >
            <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest font-semibold mb-6 sm:mb-8">
              Our Trusted Climate Partners & Registries
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={verra}
                alt="Verra"
                className="h-9 sm:h-12 md:h-14 opacity-90 transition duration-300 will-change-transform"
              />
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={goldstandard}
                alt="Gold Standard"
                className="h-9 sm:h-12 md:h-14 opacity-90 transition duration-300 will-change-transform"
              />
            </div>
          </motion.div>

          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 sm:mb-6"
            >
              Ready to Make a{" "}
              <span className="text-green-400">Real Impact?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto px-2"
            >
              Start offsetting your carbon footprint today with verified
              projects and transparent tracking.
            </motion.p>
            <motion.a
              href={marketplaceLink}
                            className="relative inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white text-sm sm:text-lg font-semibold py-3.5 sm:py-4 px-8 sm:px-12 rounded-full shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <span>Visit Marketplace</span>
              <FaExternalLinkAlt className="text-sm" />
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceHero;