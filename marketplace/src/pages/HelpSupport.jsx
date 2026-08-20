import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaDiscord,
  FaBug,
  FaInfoCircle,
  FaQuestion,
  FaHeadset,
  FaArrowRight,
  FaCreditCard,
  FaCogs,
  FaUserCircle,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaLock,
  FaRegLightbulb,
  FaCloud,
  FaUserCog,
  FaRobot 
} from "react-icons/fa";
import axios from "axios";

const SectionHeading = ({ icon, title, subtitle }) => (
  <div className="text-center mb-6 sm:mb-10 px-2">
    {icon && <div className="flex justify-center mb-2 sm:mb-3 text-3xl sm:text-4xl md:text-5xl text-indigo-600">{icon}</div>}
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800">{title}</h2>
    <p className="text-gray-500 mt-2 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

const AccordionItem = ({ faq, index, openIndex, setOpenIndex }) => {
  const isOpen = openIndex === index;
  return (
    <div className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="font-semibold text-gray-800 text-lg">{faq.question}</span>
        <span className="text-indigo-600 text-2xl transform transition-transform duration-300">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="p-5 text-gray-600 bg-gray-50 border-t border-gray-200 text-base leading-relaxed animate-fade-in-down">
          {faq.answer}
        </div>
      )}
    </div>
  );
};


const HelpSupport = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/faqs`);
        if (res.data.success) {
          const supportFaqs = res.data.faqs.filter((f) => f.category === "support");
          setFaqs(supportFaqs);
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-indigo-700 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 text-center animate-fade-in-up">
        <h1 className="mt-4 text-sm sm:text-base md:text-xl opacity-80 max-w-3xl mx-auto px-2">How Can We Help?</h1>
        <p className="mt-4 text-xl opacity-80 max-w-3xl mx-auto">
          Find answers, get started, or connect with our support team.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
          <Link
            to="/docs/getting-started"
            className="px-6 py-3 bg-white text-indigo-700 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 transition-colors duration-300 transform hover:-translate-y-1"
          >
            Get Started
          </Link>
          <a
            href="#contact-us"
            className="px-6 py-3 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-indigo-700 transition-colors duration-300 transform hover:-translate-y-1"
          >
            Contact Us
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16">
        <div className="bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400 p-3 sm:p-5 mb-10 sm:mb-16 rounded-xl shadow-md flex items-start sm:items-center gap-3 sm:gap-4 text-sm sm:text-base">
          <FaInfoCircle className="text-yellow-500 text-2xl" />
          <p className="font-medium">
            **Service Notice:** Some users may experience slower processing during high traffic.
            We're working to resolve this.
          </p>
        </div>

        <section className="mb-20">
          <SectionHeading
            title="Popular Topics"
            subtitle="Explore our knowledge base by category to find the right information."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: <FaUserCircle />, title: "Getting Started", desc: "Setting up your account and getting familiar with the platform.", href: "/docs/getting-started" },
              { icon: <FaCreditCard />, title: "Billing & Payments", desc: "Questions about subscriptions, invoices, and payment methods.", href: "/docs/billing" },
              { icon: <FaCogs />, title: "Technical Issues", desc: "Troubleshooting common problems and reporting bugs.", href: "#" },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl text-indigo-600">{item.icon}</div>
                  <FaArrowRight className="text-gray-400 text-xl group-hover:text-indigo-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Quickly find answers to the most common questions from our users."
            icon={<FaQuestion />}
          />
          <div className="space-y-6">
            {faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <AccordionItem
                  key={faq._id}
                  index={index}
                  faq={faq}
                  openIndex={openIndex}
                  setOpenIndex={setOpenIndex}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center">No FAQs available. Check back soon!</p>
            )}
          </div>
        </section>

        <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Common Problems</h2>
            <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
                Can't find what you're looking for? These solutions might help.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <a
                    href="/account-settings"
                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group text-center"
                >
                    <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <FaUserCog className="text-indigo-600 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Manage My Account</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Update your profile, change your password, or export your data.
                    </p>
                    <div className="text-indigo-600 font-semibold flex items-center justify-center">
                        Go to Settings <FaArrowRight className="ml-2 text-sm" />
                    </div>
                </a>
                
                <a
                    href="mailto:feature-request@aerthx.com"
                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group text-center"
                >
                    <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <FaRegLightbulb className="text-green-600 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Suggest a Feature</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Have an idea for how we can improve? We'd love to hear it.
                    </p>
                    <div className="text-green-600 font-semibold flex items-center justify-center">
                        Submit an Idea <FaArrowRight className="ml-2 text-sm" />
                    </div>
                </a>

                <a
                    href="/system-status"
                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group text-center"
                >
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <FaCloud className="text-gray-600 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Check System Status</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        See real-time information on our service and server performance.
                    </p>
                    <div className="text-gray-600 font-semibold flex items-center justify-center">
                        View Status Page <FaArrowRight className="ml-2 text-sm" />
                    </div>
                </a>
            </div>
        </section>

        <section id="contact-us" className="mb-20">
          <SectionHeading
            title="Need to Contact Our Team?"
            subtitle="Choose the best way to get in touch with us for your specific issue."
            icon={<FaHeadset />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="md:col-span-2 lg:col-span-2 p-8 bg-white border border-gray-100 rounded-3xl shadow-xl">
                <h3 className="text-3xl font-bold text-gray-800 mb-8">Direct Support</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Link
                        to="/report-bug"
                        className="flex flex-col items-center justify-center p-6 bg-red-50 border-2 border-red-200 rounded-2xl
                                   shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1
                                   group relative overflow-hidden text-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <FaBug className="text-red-600 text-5xl mb-4 group-hover:scale-110 transition-transform relative z-10" />
                        <p className="text-xl font-bold text-red-800 mb-1 relative z-10">Report a Bug</p>
                        <p className="text-sm text-red-600 relative z-10">Found an issue? Help us fix it fast.</p>
                        <FaArrowRight className="absolute bottom-4 right-4 text-red-400 group-hover:text-red-600 transition-colors group-hover:translate-x-1 duration-300 text-xl" />
                    </Link>
                    <a
                        href="mailto:support@aerthx.com"
                        className="flex flex-col items-center justify-center p-6 bg-indigo-50 border-2 border-indigo-200 rounded-2xl
                                   shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1
                                   group relative overflow-hidden text-center"
                    >
                         <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <FaEnvelope className="text-indigo-600 text-5xl mb-4 group-hover:scale-110 transition-transform relative z-10" />
                        <p className="text-xl font-bold text-indigo-800 mb-1 relative z-10">Email Support</p>
                        <p className="text-sm text-indigo-600 relative z-10">For detailed inquiries and help.</p>
                        <FaArrowRight className="absolute bottom-4 right-4 text-indigo-400 group-hover:text-indigo-600 transition-colors group-hover:translate-x-1 duration-300 text-xl" />
                    </a>
                </div>
            </div>
            
            <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-xl">
                <h3 className="text-3xl font-bold text-gray-800 mb-8">Social & Community</h3>
                <div className="space-y-4">
                    {[
                        { icon: <FaDiscord />, title: "Join Our Discord", desc: "Connect with our community.", href: "https://discord.gg/aerthx", color: "text-indigo-600" },
                        { icon: <FaTwitter />, title: "Follow Us on X", desc: "Get real-time updates.", href: "https://x.com/aerthx", color: "text-gray-800" },
                        { icon: <FaInstagram />, title: "Follow Us on Instagram", desc: "See our latest content.", href: "https://instagram.com/aerthx", color: "text-pink-600" },
                        { icon: <FaLinkedin />, title: "Connect on LinkedIn", desc: "Find career opportunities.", href: "https://linkedin.com/company/aerthx", color: "text-blue-600" },
                    ].map((item, idx) => (
                        <a
                            key={idx}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors group"
                        >
                            <div className={`text-2xl mr-4 ${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div>
                            <div>
                                <p className="font-semibold text-gray-800">{item.title}</p>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
          </div>
        </section>

      </main>

      <Link
        to="/ai-chat"
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-xl
                   hover:bg-indigo-700 transition-all duration-300 transform hover:scale-110
                   flex items-center justify-center z-50 animate-bounce-slow"
        aria-label="Chat with AI Assistant"
      >
        <FaRobot className="text-3xl" />
      </Link>

      <footer className="bg-gray-800 text-center text-gray-400 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-white transition">Refund Policy</Link>
            <Link to="#" className="hover:text-white transition">System Status</Link>
          </div>
          <div className="mt-8 text-xs text-gray-600">
            <p>© {new Date().getFullYear()} AerthX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpSupport;