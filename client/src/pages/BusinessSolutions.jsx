import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const BusinessSolutions = () => {
  const userType = useSelector((state) => state.auth.userType);
  const navigate = useNavigate();

  const handlePricingClick = () => {
    navigate("/pricing");
  };

  const features = [
    {
      id: 1,
      title: "Annual Sustainability Certificate",
      desc: "Receive a globally recognized, verified annual sustainability certificate to showcase your commitment to environmental stewardship. Our transparent process provides a powerful marketing asset, enhancing your brand's reputation with customers, investors, and partners.",
      imageClass: "bg-gradient-to-tr from-green-300 to-green-500",
      imageText: "Certificate Display",
    },
    {
      id: 2,
      title: "Comprehensive ESG & CSR Reporting",
      desc: "Our platform automates detailed ESG and CSR reports using data from your carbon dashboard. This saves time, reduces errors, and helps you present a compelling sustainability story to all stakeholders.",
      imageClass: "bg-gradient-to-tr from-gray-300 to-gray-500",
      imageText: "Report Generation",
    },
    {
      id: 3,
      title: "Advanced Carbon Management Dashboard",
      desc: "Go beyond simple tracking with our intelligent dashboard. Monitor your carbon footprint in real-time and simulate reduction strategies with advanced analytics. It serves as your central hub for all sustainability data.",
      imageClass: "bg-gradient-to-tr from-blue-300 to-blue-500",
      imageText: "Dashboard View",
    },
  ];

  const subFeatures = [
    {
      title: "BRSR & SDG Reports",
      desc: "Generate reports that are compliant with the Business Responsibility and Sustainability Report (BRSR) framework and the UN Sustainable Development Goals (SDGs).",
    },
    {
      title: "Downloadable Certificates",
      desc: "Easily download and share your official, verifiable sustainability certificates in high-resolution formats.",
    },
    {
      title: "Dedicated Account Support",
      desc: "Get personalized guidance from our team of sustainability experts to help you maximize your platform usage.",
    },
    {
      title: "Data-Driven Analytics",
      desc: "Unlock powerful analytics to identify and reduce emissions across your entire value chain.",
    },
    {
      title: "Customizable Reporting",
      desc: "Tailor your reports to meet the specific needs of your business and stakeholders, with flexible data filters and layouts.",
    },
  ];

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

  return (
    <div className="w-full text-gray-800 bg-gray-50 overflow-hidden">
      <div className="relative px-4 sm:px-6 md:px-16 pt-40 pb-32 overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-500 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto text-center space-y-12 text-white"
        >
          <h1 className="text-2xl sm:text-3xl md:text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-snug drop-shadow-lg">
            Empower Your Business to Lead a Sustainable Future
          </h1>
          <p className="mt-8 text-sm sm:text-base md:text-xl max-w-4xl mx-auto leading-relaxed drop-shadow-md">
            Our powerful platform is more than just a tool; it's your partner in achieving environmental and social goals. From seamless compliance to transparent reporting, we help you showcase your leadership to the world.
          </p>
          {userType && userType.toLowerCase() === "organization" && (
            <motion.button
              onClick={handlePricingClick}
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="mt-16 px-14 py-6 bg-white text-green-700 text-sm sm:text-base md:text-xl font-bold rounded-full shadow-2xl hover:bg-gray-100 transition-all duration-300"
            >
              Explore Business Plans
            </motion.button>
          )}
        </motion.div>
      </div>

      <div className="px-4 sm:px-6 md:px-16 py-14 sm:py-20 md:py-32 max-w-7xl mx-auto">
        <FeatureSection className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-24 items-center mb-64">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-60 sm:h-72 md:h-96 rounded-4xl shadow-3xl overflow-hidden order-last lg:order-first"
          >
            <div className={`w-full h-full flex items-center justify-center p-8 ${features[0].imageClass}`}>
              <p className="text-white text-4xl font-bold text-center">{features[0].imageText}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-green-900">{features[0].title}</h2>
            <p className="text-gray-700 text-sm sm:text-base md:text-xl leading-relaxed">{features[0].desc}</p>
          </motion.div>
        </FeatureSection>

        <FeatureSection className="text-center mb-64">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-green-900 mb-12">{features[1].title}</h2>
          <p className="text-gray-700 text-sm sm:text-base md:text-xl max-w-4xl mx-auto mb-20 leading-relaxed">{features[1].desc}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div
              variants={cardVariant}
              whileInView="visible"
              initial="hidden"
              whileHover={{ y: -12, boxShadow: "0 20px 30px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -3px rgba(0, 0, 0, 0.05)" }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white rounded-4xl p-12 shadow-lg transition-all duration-300"
            >
              <h4 className="text-3xl font-bold text-green-800 mb-6">Automated Reporting</h4>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg">Our system automatically generates comprehensive reports, saving you manual work and ensuring accuracy and compliance.</p>
            </motion.div>
            <motion.div
              variants={cardVariant}
              whileInView="visible"
              initial="hidden"
              whileHover={{ y: -12, boxShadow: "0 20px 30px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -3px rgba(0, 0, 0, 0.05)" }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white rounded-4xl p-12 shadow-lg transition-all duration-300"
            >
              <h4 className="text-3xl font-bold text-green-800 mb-6">Compliance Focused</h4>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg">Ensure your reports meet the latest regulatory requirements and are ready for audits and disclosures, built on global frameworks.</p>
            </motion.div>
          </div>
        </FeatureSection>

        <FeatureSection className="bg-white rounded-5xl shadow-3xl p-16 lg:p-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-green-900">{features[2].title}</h2>
              <p className="text-gray-700 text-sm sm:text-base md:text-xl leading-relaxed">{features[2].desc}</p>
              <ul className="list-disc list-inside space-y-4 mt-8 text-gray-700 font-medium text-lg">
                <li>Real-time emissions tracking</li>
                <li>Customizable data visualizations and dashboards</li>
                <li>Actionable insights for effective reduction strategies</li>
                <li>Seamless integration with other business tools</li>
              </ul>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              className="h-96 w-full rounded-3xl overflow-hidden"
            >
              <div className={`w-full h-full flex items-center justify-center p-8 ${features[2].imageClass}`}>
                <p className="text-white text-3xl font-bold text-center">{features[2].imageText}</p>
              </div>
            </motion.div>
          </div>
        </FeatureSection>
      </div>

      <div className="bg-gray-900 py-40 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <FeatureSection className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold leading-tight">
              A Complete Suite of Tools
            </h2>
            <p className="mt-8 text-sm sm:text-base md:text-xl text-gray-300 max-w-3xl mx-auto">
              We provide everything you need to manage your sustainability journey from start to finish, with a dedicated team of experts ready to support you.
            </p>
          </FeatureSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 md:gap-16">
            {subFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={cardVariant}
                whileInView="visible"
                initial="hidden"
                whileHover={{ y: -12, boxShadow: "0 20px 30px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -3px rgba(0, 0, 0, 0.1)" }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-gray-800 rounded-4xl p-5 sm:p-8 md:p-12 shadow-lg transition-all duration-300 transform hover:-translate-y-3"
              >
                <h3 className="text-3xl font-bold text-white">{feature.title}</h3>
                <p className="mt-6 text-gray-400 text-sm sm:text-base md:text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <FeatureSection className="py-16 sm:py-24 md:py-40 max-w-5xl mx-auto text-center px-6 space-y-12">
        <h3 className="text-2xl sm:text-3xl md:text-5xl md:text-6xl font-bold leading-tight text-green-900">
          Ready to Lead in Sustainability?
        </h3>
        <p className="text-sm sm:text-base md:text-xl text-gray-700 max-w-3xl mx-auto">
          Join the leading businesses that are building a sustainable future. Discover a plan that fits your organization and start making a real impact today.
        </p>
        {userType && userType.toLowerCase() === "organization" && (
          <motion.button
            onClick={handlePricingClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-16 px-16 py-7 bg-green-600 text-white text-2xl font-bold rounded-full shadow-2xl hover:bg-green-700 transition-colors"
          >
            Explore Business Plans
          </motion.button>
        )}
      </FeatureSection>
    </div>
  );
};

export default BusinessSolutions;