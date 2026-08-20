import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaBookOpen, FaLightbulb, FaUsers, FaShoppingCart, FaChartBar, FaRecycle, FaFileAlt, FaQuestionCircle, FaShieldAlt } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import heroBg from "../assets/new_aerthx.jpeg";

// Online stock images (same green/nature tone as the hero) used across
// blog cards, impact stories and the CTA section.
const IMG_FOREST = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80";
const IMG_SPROUT = "https://images.unsplash.com/photo-1462536943532-57a629f6cc60?auto=format&fit=crop&w=900&q=80";
const IMG_ESG_CHARTS = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80";
const IMG_WATERFALL = "https://images.unsplash.com/photo-1508614999368-9260051292e5?auto=format&fit=crop&w=900&q=80";
const IMG_GREEN_BUILDING = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80";
const IMG_TREE_PLANTING = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80";
const IMG_CTA_FOREST = "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=80";

const BlogPostCard = ({ title, description, link, isLarge = false, bg }) => (
  <div
    className={`relative rounded-2xl overflow-hidden shadow-lg border border-green-900/40 transition-transform duration-300 hover:scale-[1.02] hover:shadow-green-900/40 hover:shadow-2xl ${isLarge ? "md:col-span-1 md:row-span-2" : ""}`}
  >
    <div
      className={`w-full ${isLarge ? "h-56 sm:h-72 md:h-80" : "h-40 sm:h-44"} bg-cover bg-center`}
      style={{
        backgroundImage: `linear-gradient(to top, rgba(4,10,6,0.95), rgba(4,10,6,0.1)), url(${bg})`,
      }}
    ></div>
    <div className={`absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 ${isLarge ? "md:p-8" : ""}`}>
      <h3 className={`font-bold text-white mb-2 ${isLarge ? "text-lg sm:text-xl md:text-2xl" : "text-base sm:text-lg"}`}>
        {title}
      </h3>
      <p className={`text-gray-300 mb-3 ${isLarge ? "text-sm sm:text-base" : "text-xs sm:text-sm"} line-clamp-2`}>
        {description}
      </p>
      <Link
        to={link}
        className="inline-flex items-center gap-1 font-medium text-green-400 hover:text-green-300 text-sm"
      >
        Read More <span aria-hidden="true">→</span>
      </Link>
    </div>
  </div>
);

const ImpactStoryCard = ({ title, description, link, bg }) => (
  <Link
    to={link}
    className="rounded-2xl overflow-hidden shadow-lg border border-green-900/40 transition-all duration-300 hover:shadow-2xl hover:shadow-green-900/40 hover:scale-[1.02] group block bg-[#0b120d]"
  >
    <div
      className="h-40 sm:h-48 w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    ></div>
    <div className="p-5 sm:p-6">
      <h3 className="font-bold text-base sm:text-lg mb-2 text-white">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-400 mb-3">{description}</p>
      <span className="inline-flex items-center gap-1 font-medium text-green-400 group-hover:text-green-300 text-sm">
        Read Story <span aria-hidden="true">→</span>
      </span>
    </div>
  </Link>
);

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border-b border-green-900/40 last:border-none">
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full py-4 sm:py-5 text-left focus:outline-none transition-colors duration-200 hover:bg-green-900/10 px-2 sm:px-3 rounded-lg"
    >
      <span className="text-sm sm:text-base md:text-lg font-medium text-white pr-4">{question}</span>
      <svg
        className={`w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div
      className={`overflow-hidden transition-[max-height] duration-500 ease-in-out px-2 sm:px-3 ${
        isOpen ? "max-h-96 pb-4 sm:pb-5" : "max-h-0"
      }`}
    >
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{answer}</p>
    </div>
  </div>
);

const QuickGuideCard = ({ icon, title, description }) => (
  <div className="rounded-2xl p-5 sm:p-6 md:p-7 bg-[#0b120d] border border-green-900/40 shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-green-900/30 hover:border-green-700/50 group">
    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 text-green-400 transition-transform duration-300 group-hover:scale-110">
      {icon}
    </div>
    <h4 className="font-bold text-lg sm:text-xl mb-2 text-white">{title}</h4>
    <p className="text-xs sm:text-sm text-gray-400">{description}</p>
  </div>
);

const GuideTileLink = ({ to, icon, title, description }) => (
  <Link
    to={to}
    className="group rounded-2xl p-5 sm:p-6 bg-[#0b120d] border border-green-900/40 shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-green-900/30 hover:border-green-700/50 block"
  >
    <div className="text-2xl sm:text-3xl text-green-400 mb-3 transition-colors duration-300 group-hover:text-green-300">
      {icon}
    </div>
    <h3 className="font-semibold text-base sm:text-lg mb-2 text-white">{title}</h3>
    <p className="text-gray-400 text-xs sm:text-sm">{description}</p>
    <div className="w-full h-1 bg-green-900/40 mt-4 rounded-full overflow-hidden">
      <div className="w-0 h-1 bg-green-500 rounded-full transition-[width] duration-500 group-hover:w-full"></div>
    </div>
  </Link>
);

const EducationalTile = ({ to, icon, title, description }) => (
  <Link
    to={to}
    className="bg-[#0b120d] border border-green-900/40 rounded-2xl p-6 sm:p-8 text-center shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-green-900/30 hover:border-green-700/50 block"
  >
    <div className="text-4xl sm:text-5xl mb-4 flex justify-center text-green-400">{icon}</div>
    <h4 className="font-bold text-lg sm:text-2xl text-white mb-2">{title}</h4>
    <p className="text-gray-400 text-sm sm:text-base mb-4">{description}</p>
    <span className="text-green-400 font-medium hover:text-green-300 text-sm sm:text-base">
      Read More →
    </span>
  </Link>
);

const Resource = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/faqs`);

        if (res.data.success) {
          const resourceFaqs = res.data.faqs.filter(
            (faq) => faq.category === "resource"
          );
          setFaqs(resourceFaqs);
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <main className="px-4 sm:px-6 md:px-12 lg:px-16 pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-10 md:pb-14 w-full font-sans bg-[#040a06] text-white">
      {/* HERO */}
      <header className="relative mt-2 sm:mt-4 py-12 sm:py-20 md:py-28 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl animate-fade-in-down">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        <div className="absolute inset-0 border border-green-500/20 rounded-2xl sm:rounded-3xl pointer-events-none"></div>

        <div className="relative text-center text-white space-y-5 sm:space-y-6 z-10 max-w-4xl mx-auto px-2">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-lg font-display">
            Explore <span className="text-green-400">AerthX</span> Resources
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl sm:max-w-3xl mx-auto leading-relaxed text-gray-200">
            Your comprehensive guide to sustainability, carbon offsetting, and ESG reporting, all in one place.
          </p>
          {!user && (
            <Link
              to="/register-choice"
              className="inline-flex items-center gap-2 px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 bg-green-500 text-white text-sm sm:text-base font-semibold rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
            >
              Get Started <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20 md:space-y-24">
        {/* QUICK GUIDES */}
        <section className="animate-fade-in-up mt-16 sm:mt-20 md:mt-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 sm:mb-8 md:mb-10 text-center font-display text-white">
            Quick Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-left">
            <QuickGuideCard
              icon={<FaLeaf />}
              title="Eco Tips"
              description="Practical sustainability actions for individuals and businesses."
            />
            <QuickGuideCard
              icon={<FaBookOpen />}
              title="Guides"
              description="Step-by-step explanations on carbon credit and ESG topics."
            />
            <QuickGuideCard
              icon={<FaLightbulb />}
              title="Insights"
              description="Learn about carbon offsetting trends and best practices."
            />
            <QuickGuideCard
              icon={<FaUsers />}
              title="Community"
              description="Stories of organizations and communities making a difference."
            />
          </div>
        </section>

        {/* LATEST BLOGS */}
        <section className="animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 sm:mb-8 md:mb-10 text-center font-display text-white">
            Latest Blogs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
            <BlogPostCard
              title="Understanding Carbon Credits"
              description="Explore the basics of carbon credits and why they matter for sustainability. Understand how companies and individuals can make a real world impact."
              link="/blogs/carbon-credits"
              isLarge={true}
              bg={IMG_FOREST}
            />
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:gap-8">
              <BlogPostCard
                title="ESG Trends in 2025"
                description="Top predictions and key ESG reporting trends every business should watch."
                link="/blogs/esg-trends"
                bg={IMG_ESG_CHARTS}
              />
              <BlogPostCard
                title="Carbon Offsetting Tips"
                description="Learn simple, actionable steps to reduce your carbon footprint and support a greener planet."
                link="/blogs/offset-tips"
                bg={IMG_SPROUT}
              />
            </div>
          </div>
        </section>

        {/* GUIDES & TUTORIALS */}
        <section className="animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 sm:mb-8 md:mb-10 text-center font-display text-white">
            Guides & Tutorials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <GuideTileLink
              to="/guides/buying-credits"
              icon={<FaShoppingCart />}
              title="Buying Carbon Credits"
              description="Learn how to choose and purchase high-quality carbon credits."
            />
            <GuideTileLink
              to="/guides/dashboard"
              icon={<FaChartBar />}
              title="Using AerthX Dashboard"
              description="Maximize your impact with our powerful analytics and reporting tools."
            />
            <GuideTileLink
              to="/guides/offsetting-strategies"
              icon={<FaRecycle />}
              title="Offsetting Strategies"
              description="Best practices for individuals and organizations to offset effectively."
            />
            <GuideTileLink
              to="/guides/esg-reporting"
              icon={<FaFileAlt />}
              title="ESG Reporting"
              description="Simplify ESG compliance with practical templates and examples."
            />
          </div>
          
        </section>

        {/* LEARN ABOUT CARBON CREDITS */}
        <section className="animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 sm:mb-8 md:mb-10 text-center font-display text-white">
            Learn About Carbon Credits
          </h2>
          <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-10 bg-[#060d08] border border-green-900/40 shadow-lg sm:shadow-xl overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="w-32 h-32 bg-green-700 rounded-full opacity-20 blur-3xl absolute -top-10 -left-10"></div>
              <div className="w-48 h-48 bg-green-800 rounded-full opacity-20 blur-3xl absolute -bottom-20 -right-20"></div>
            </div>
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              <EducationalTile
                to="/educational/what-are-carbon-credits"
                icon={<FaQuestionCircle />}
                title="What Are Carbon Credits?"
                description="A simple guide to understanding carbon credits and their impact."
              />
              <EducationalTile
                to="/educational/why-offset-carbon"
                icon={<FaLeaf />}
                title="Why Offset Carbon?"
                description="Learn why carbon offsetting is critical for sustainability and ESG goals."
              />
              <EducationalTile
                to="/educational/aerthx-benefits"
                icon={<FaShieldAlt />}
                title="How AerthX Helps"
                description="Discover how our platform simplifies carbon action for everyone."
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 sm:mb-8 md:mb-10 text-center font-display text-white">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto bg-[#0b120d] border border-green-900/40 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-3 sm:p-5 md:p-8 divide-y divide-green-900/40">
            {faqs.length ? (
              faqs.map((faq, i) => (
                <FAQItem
                  key={faq._id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-6 text-sm sm:text-base">
                No FAQs available right now. Please check back later.
              </p>
            )}
          </div>
        </section>

        {/* IMPACT STORIES */}
        <section className="animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 sm:mb-8 md:mb-10 text-center font-display text-white">
            Impact Stories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            <ImpactStoryCard
              title="A Startup's Journey"
              description="How a small business used AerthX to offset over 100 tons of CO₂ and boost its brand."
              link="/stories/startup"
              bg={IMG_WATERFALL}
            />
            <ImpactStoryCard
              title="Corporate Sustainability"
              description="Learn how a large enterprise achieved full ESG compliance efficiently with AerthX."
              link="/stories/corporate"
              bg={IMG_GREEN_BUILDING}
            />
            <ImpactStoryCard
              title="Community Initiatives"
              description="Discover how communities are planting trees and generating carbon credits to fund local projects."
              link="/stories/community"
              bg={IMG_TREE_PLANTING}
            />
          </div>
        </section>

        {/* CTA */}
        {!user && (
          <section className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 text-center shadow-xl sm:shadow-2xl animate-fade-in-up overflow-hidden border border-green-700/40">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${IMG_CTA_FOREST})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 to-black/80"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 max-w-5xl mx-auto text-left md:text-left">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                  Ready to Make a <span className="text-green-400">Real Impact</span>?
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl">
                  Join AerthX today and take a significant step towards a more sustainable future for your business and the planet.
                </p>
              </div>
              <Link
                to="/register-choice"
                className="inline-block flex-shrink-0 px-6 sm:px-10 md:px-12 py-3 sm:py-4 text-sm sm:text-base bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
              >
                Create Your Account →
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Resource;