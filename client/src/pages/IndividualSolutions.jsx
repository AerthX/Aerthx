import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const FeatureSection = ({ children, ...props }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeUpVariant}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const mainFeatures = [
  {
    id: 1,
    title: "Offset Your Emissions in Minutes",
    bullets: [
      { icon: "⚡", text: "Flight, energy, and lifestyle calculators for precise offsetting." },
      { icon: "💳", text: "Flexible options: pay-per-use or subscribe monthly." },
      { icon: "✅", text: "Invest in trusted, project-backed, third-party verified credits." },
    ],
    imageText: "Calculator & Offset",
    imageClass: "bg-gradient-to-tr from-green-300 to-teal-500",
  },
  {
    id: 2,
    title: "Track Your Progress",
    bullets: [
      { icon: "🗓️", text: "Receive monthly personalized footprint reports." },
      { icon: "💡", text: "Engage in eco-challenges and get practical eco-tips." },
      { icon: "🚶‍♀️", text: "Monitor and adjust your lifestyle habits to reduce emissions." },
    ],
    imageText: "Dashboard & Tracker",
    imageClass: "bg-gradient-to-tr from-blue-300 to-indigo-500",
  },
  {
    id: 3,
    title: "Show the World You Care",
    bullets: [
      { icon: "🏅", text: "Earn unique Offset Certificate NFTs as proof of your impact." },
      { icon: "🌐", text: "Create public profiles to showcase your climate actions." },
      { icon: "🏆", text: "Join our community: Leaderboard functionality coming soon!" },
    ],
    imageText: "Certificates & Social",
    imageClass: "bg-gradient-to-tr from-yellow-300 to-orange-500",
  },
];

const personalTools = [
  { title: "Monthly Footprint Report", desc: "Receive a detailed and structured analysis of your carbon emissions each month, including actionable insights and trends to guide your sustainability journey." },
  { title: "Personalized Eco Recommendations", desc: "Access expert guidance tailored to your lifestyle and local environment to minimize your carbon impact effectively." },
  { title: "Offset Certificate NFTs", desc: "Obtain verifiable, blockchain-backed digital certificates that provide proof of your offset contributions, suitable for professional sharing." },
  { title: "Advanced Reporting & Dashboards", desc: "Utilize intuitive dashboards and reports to monitor your progress, understand your impact, and make data-driven decisions for continuous improvement." },
  { title: "Impact Notifications", desc: "Stay informed with timely alerts about your carbon offset activities, project updates, and changes in carbon credit status." },
  { title: "Quarterly ESG & Sustainability Reports", desc: "Gain access to standardized Environmental, Social, and Governance reports that summarize your contributions, supporting personal or professional disclosure requirements." },
  { title: "Digital Recognition", desc: "Showcase your commitment to sustainability through secure digital badges, aligning your personal efforts with recognized environmental standards." },
  { title: "SDG Alignment Reports", desc: "Demonstrate how your carbon offset activities contribute toward the United Nations Sustainable Development Goals (SDGs) for broader social and environmental accountability." },
  { title: "Research Credit Access", desc: "Participate in specialized research projects by gaining access to limited-run, high-impact carbon credits curated for scientific and corporate sustainability efforts." },
  { title: "Downloadable Certificates", desc: "Quickly and easily download official proof of your offset achievements for personal records or professional reporting purposes." },
];

const IndividualSolutions = () => {
  const navigate = useNavigate();

  const handlePlansClick = () => {
    navigate("/individual-pricing"); 
  };

  return (
    <div className="w-full text-gray-800 bg-gray-50 overflow-hidden">
      <div className="relative px-4 sm:px-6 md:px-16 pt-20 sm:pt-28 md:pt-40 pb-16 sm:pb-24 md:pb-32 overflow-hidden bg-gradient-to-br from-green-500 via-teal-600 to-blue-500 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto text-center space-y-12 text-white"
        >
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-extrabold tracking-tight leading-snug drop-shadow-lg">
            For Individuals: Own Your Climate Action
          </h1>
          <p className="mt-10 sm:mt-16 w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-5 text-sm sm:text-lg md:text-xl bg-white text-green-700 font-bold rounded-full shadow-2xl hover:bg-gray-100 transition-all duration-300">
            Take responsibility for your personal carbon footprint with easy, affordable, and shareable tools that turn commitment into measurable impact.
          </p>
        {localStorage.getItem("userType") === "individual" && (
  <motion.button
    onClick={handlePlansClick}
    whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)" }}
    whileTap={{ scale: 0.95 }}
    className="mt-16 px-14 py-6 bg-white text-green-700 text-xl font-bold rounded-full shadow-2xl hover:bg-gray-100 transition-all duration-300"
  >
    View Individual Plans
  </motion.button>
)}

        </motion.div>
      </div>

      <div className="px-4 sm:px-6 md:px-16 py-12 sm:py-20 md:py-32 max-w-7xl mx-auto">
        <FeatureSection className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-24 items-center mb-16 sm:mb-24 md:mb-64">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-96 rounded-4xl shadow-3xl overflow-hidden order-last lg:order-first"
          >
            <div className={`w-full h-full flex flex-col items-center justify-center p-8 ${mainFeatures[0].imageClass}`}>
              <span className="text-6xl mb-4">✈️🌳</span>
              <p className="text-white text-4xl font-bold text-center">{mainFeatures[0].imageText}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-bold text-green-900">{mainFeatures[0].title}</h2>
            <p className="text-gray-700 text-xl leading-relaxed">Take responsibility for your travel, energy, and consumption with our seamless offset system.</p>
            <ul className="list-none space-y-4 mt-8">
              {mainFeatures[0].bullets.map((item, index) => (
                <li key={index} className="flex items-start space-x-3 text-gray-700 font-medium text-lg">
                  <span className="text-green-500 text-2xl">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </FeatureSection>

        <FeatureSection className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-64">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 order-last lg:order-first"
          >
            <h2 className="text-5xl font-bold text-green-900">{mainFeatures[1].title}</h2>
            <p className="text-gray-700 text-xl leading-relaxed">Turn abstract data into actionable steps with personalized reports and gamified challenges.</p>
            <ul className="list-none space-y-4 mt-8">
              {mainFeatures[1].bullets.map((item, index) => (
                <li key={index} className="flex items-start space-x-3 text-gray-700 font-medium text-lg">
                  <span className="text-blue-500 text-2xl">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-green-900"
          >
            <div className={`w-full h-full flex flex-col items-center justify-center p-8 ${mainFeatures[1].imageClass}`}>
              <span className="text-6xl mb-4">📊📉</span>
              <p className="text-white text-4xl font-bold text-center">{mainFeatures[1].imageText}</p>
            </div>
          </motion.div>
        </FeatureSection>
      </div>

      <div className="bg-gray-900 py-12 sm:py-20 md:py-40 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <FeatureSection className="text-center mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-6xl font-bold leading-tight">
              All the Tools You Need for Comprehensive Carbon Management
            </h2>
            <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-xl text-gray-300 max-w-4xl mx-auto">
              Access a complete suite of professional features designed to help individuals accurately measure, offset, and report their carbon footprint with precision and transparency.
            </p>
          </FeatureSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {personalTools.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={cardVariant}
                whileInView="visible"
                initial="hidden"
                transition={{ duration: 0.6, delay: 0.1 * (idx % 3), ease: "easeOut" }} 
                whileHover={{ y: -8, boxShadow: "0 20px 30px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -3px rgba(0, 0, 0, 0.1)" }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-gray-800 rounded-4xl p-10 shadow-lg transition-all duration-300 transform hover:bg-gray-700/80 border border-gray-700"
              >
                <h3 className="text-2xl font-bold text-green-400">{feature.title}</h3>
                <p className="mt-4 text-gray-400 text-base leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-16 py-32 max-w-7xl mx-auto">
        <FeatureSection className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-96 rounded-4xl shadow-3xl overflow-hidden order-last lg:order-first"
          >
            <div className={`w-full h-full flex flex-col items-center justify-center p-8 ${mainFeatures[2].imageClass}`}>
              <span className="text-6xl mb-4">🏆🏅</span>
              <p className="text-white text-4xl font-bold text-center">{mainFeatures[2].imageText}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-bold text-green-900">{mainFeatures[2].title}</h2>
            <p className="text-gray-700 text-sm sm:text-base md:text-xl leading-relaxed"        >Turn your commitment into recognition with verifiable certificates and a strong public presence.</p>
            <ul className="list-none space-y-4 mt-8">
              {mainFeatures[2].bullets.map((item, index) => (
                <li key={index} className="flex items-start space-x-3 text-gray-700 font-medium text-sm sm:text-base md:text-lg">
                  <span className="text-teal-500 text-2xl">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </FeatureSection>
      </div>

      <FeatureSection className="py-12 sm:py-20 md:py-40 max-w-5xl mx-auto text-center px-4 sm:px-6 space-y-6 sm:space-y-10 md:space-y-12 bg-gradient-to-t from-white to-green-50">
        <h3 className="text-2xl sm:text-3xl md:text-6xl font-bold leading-tight text-green-900">
          Start Offsetting Today
        </h3>
        <p className="text-sm sm:text-base md:text-xl text-gray-700 max-w-3xl mx-auto">
          Choose a plan that fits your lifestyle and join the global movement of individuals driving real climate action.
        </p>
       {localStorage.getItem("userType") === "individual" && (
  <motion.button
    onClick={handlePlansClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
   className="mt-10 sm:mt-16 w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-5 text-sm sm:text-lg md:text-2xl bg-green-600 text-white font-bold rounded-full shadow-2xl hover:bg-green-700 transition-colors"
  >
    View Individual Plans 🌍
  </motion.button>
)}

      </FeatureSection>
    </div>
  );
};

export default IndividualSolutions;