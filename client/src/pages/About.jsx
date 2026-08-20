import React from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer/Footer";

const founders = [
  {
    name: "Founder 1",
   role: "Founder & Sustainability Expert",
    bio: "Oversees project verification, environmental impact, and carbon standards.",
    image: "/path/to/founder1.jpg",
  },
  {
    name: "Founder 2",
    role: "Co-Founder & Data Analyst",
    bio: "Responsible for carbon credit analysis, pricing models, and reporting.",
    image: "/path/to/founder2.jpg",
  },
  {
    name: "Founder 3",
    role: "Co-Founder & Product Designer",
    bio: "Designs the platform interface, ensures accessibility and responsiveness.",
    image: "/path/to/founder3.jpg",
  },
  {
    name: "Founder 4",
     role: "Co-Founder & Full-Stack Developer",
       bio: "Leads product strategy, user experience, and technical infrastructure.",
    image: "/path/to/founder4.jpg",
  },
  {
    name: "Founder 5",
    role: "Co-Founder & Marketing Lead",
    bio: "Leads awareness campaigns, brand strategy, and partnership growth.",
    image: "/path/to/founder5.jpg",
  },
  {
    name: "Founder 6",
    role: "Co-Founder & Operations Head",
    bio: "Handles internal operations, platform development, and execution strategy.",
    image: "/path/to/Founder6.jpg",
  },
];

const values = [
  { title: "Transparency", desc: "Clear, traceable information for every credit and project." },
  { title: "Impact", desc: "We focus on real, measurable climate improvements." },
  { title: "Accessibility", desc: "Climate action made simple, intuitive, and available for all." },
  { title: "Trust", desc: "We align with global standards like Verra & Gold Standard." },
  { title: "Innovation", desc: "We simplify carbon contribution for the digital world." },
  { title: "Collaboration", desc: "Together, we create larger, lasting impact." },
];

const About = () => {
  return (
    <div className="bg-[#fefefe] text-[#1a1a1a] font-['Inter','Segoe_UI','Helvetica','Arial','sans-serif']">

      <section className="bg-gradient-to-tr from-green-200 via-white to-green-100 py-12 sm:py-16 md:py-20 px-4 sm:px-6 text-center">
        <h1 className="text-2xl sm:text-3xltext-3xl sm:text-4xl md:text-5xl font-extrabold text-green-900 mb-4 tracking-tight">
          About AerthX
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-gray-700">
          Driving environmental impact with trusted, easy-to-use climate tools for everyone.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            To make verified climate action accessible and impactful — helping individuals
            and organizations reduce their carbon footprint with confidence and clarity.
          </p>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-4">Our Vision</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            A sustainable future where environmental responsibility is embedded in everyday life and every business decision.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-r from-emerald-100 to-lime-100 py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-900 mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="rounded-xl bg-[#f8fafc] p-6 shadow-md hover:shadow-xl transition"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-green-800 mb-2">{value.title}</h3>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#f0fdf4] via-green-100 to-[#f0fdf4] py-14 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-900 mb-12">Meet Our Founders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {founders.map((founder, idx) => (
              <motion.div
                key={idx}
                className="rounded-2xl bg-white p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full mx-auto mb-4 shadow"
                />
                <h3 className="text-lg sm:text-xl font-semibold text-emerald-800">{founder.name}</h3>
                <p className="text-sm text-gray-600 font-medium mb-2">{founder.role}</p>
                <p className="text-sm text-gray-800">{founder.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-green-700 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
    <p className="text-sm sm:text-base md:text-lg mb-8">
      Whether you're an individual, business, or organization — AerthX makes climate action simple, credible, and impactful.
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
     <a
  href={import.meta.env.VITE_CLIENT_URL}
  className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base rounded-lg bg-white text-green-700 font-semibold shadow hover:bg-gray-100 transition"
>
  Explore Projects
</a>

      
    </div>
  </div>
</section>
<Footer/>

    </div>
  );
};

export default About;
