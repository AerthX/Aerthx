import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/contact/send-message`,
        formData
      );

      if (res.data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" }); 
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center overflow-hidden">
      
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>
      <div className="absolute top-20 -right-40 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10 sm:mb-16 relative z-10 px-2"
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Let’s <span className="text-green-600">Connect</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
          Whether you’re curious about <span className="font-semibold text-green-700">carbon credits</span>, 
          need guidance on <span className="font-semibold text-green-700">sustainability</span>, or 
          want to explore <span className="font-semibold text-green-700">partnerships</span> — 
          we’re here to help you every step of the way.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 md:gap-12 w-full max-w-6xl relative z-10">
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-5 sm:p-8 md:p-10 border border-green-100 flex flex-col justify-between hover:shadow-green-100/50 transition"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-6 sm:mb-8">
            Contact Information
          </h2>
          <div className="space-y-4 sm:space-y-6 text-gray-700 text-sm sm:text-base md:text-lg">
            <div className="flex items-center space-x-4 group">
              <FaPhoneAlt className="text-green-600 text-xl group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-green-700 transition">+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-4 group">
              <FaEnvelope className="text-green-600 text-xl group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-green-700 transition">support@aerthx.com</span>
            </div>
            <div className="flex items-center space-x-4 group">
              <FaMapMarkerAlt className="text-green-600 text-xl group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-green-700 transition">Mumbai, India</span>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl shadow-lg border border-gray-100">
            <iframe
              title="AerthX Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609855763!2d72.74110165159873!3d19.08219783935359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63b0f9b6e6f%3A0x8c4a51e2a7754010!2sMumbai!5e0!3m2!1sen!2sin!4v1676000000000!5m2!1sen!2sin"
             className="w-full h-40 sm:h-48 md:h-56 border-0"
              loading="lazy"
            ></iframe>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-5 sm:p-8 md:p-10 border border-green-100"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-6 sm:mb-8">
            Send us a Message
          </h2>
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full mt-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl shadow-sm focus:ring-2 focus:ring-green-600 focus:outline-none transition hover:border-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full mt-2 px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-600 focus:outline-none transition hover:border-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Message</label>
              <textarea
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
                className="w-full mt-2 px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-600 focus:outline-none transition hover:border-green-400"
              ></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={status === "loading"}
             className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-xl shadow-lg hover:shadow-green-300 transition duration-300 ease-in-out"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </motion.button>

            {status === "success" && (
              <p className="text-green-600 font-semibold mt-2">✅ Message sent successfully!</p>
            )}
            {status === "error" && (
              <p className="text-red-600 font-semibold mt-2">❌ Failed to send message. Try again later.</p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
