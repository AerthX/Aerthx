import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [showSolutions, setShowSolutions] = useState(false);

  return (
    <footer className="bg-[#0B1120] text-white px-4 sm:px-6 py-8 sm:py-10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <h2 className="text-green-500 text-2xl sm:text-3xl font-bold mb-4">AerthX</h2>
          <p className="text-gray-400 text-xs sm:text-smtext-sm leading-relaxed mb-6">
            Your trusted partner in carbon offset, ESG reporting, and sustainable innovation.
          </p>
          <div className="text-xs sm:text-sm text-gray-400 space-y-1">
            <p className="flex items-center gap-2">📧 aerthx01@gmail.com</p>
            <p className="flex items-center gap-2">📞 +91-98765-XXXX</p>
          </div>
          <div className="flex gap-4 mt-4 text-lg sm:text-xl text-gray-500">
            <a href="#"><i className="fab fa-linkedin hover:text-white transition" /></a>
            <a href="https://www.instagram.com/_aerthx_?igsh=MWRpMGdiYzFtMGQ3bw=="><i className="fab fa-instagram hover:text-white transition" /></a>
            <a href="#"><i className="fab fa-facebook hover:text-white transition" /></a>
            <a href="#"><i className="fab fa-twitter hover:text-white transition" /></a>
          </div>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Navigate</h3>
          <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/MarketplaceHero" className="hover:text-white transition">MarketplaceHero</Link></li>
            <li>
              <button
                onClick={() => setShowSolutions(!showSolutions)}
                className="flex items-center justify-between w-full hover:text-white transition"
              >
                <span>Solutions</span>
                <span>{showSolutions ? "▲" : "▼"}</span>
              </button>
              {showSolutions && (
                <ul className="pl-4 mt-2 space-y-2 text-xs sm:text-sm">
                  <li><Link to="/solutions/business" className="hover:text-white transition">Businesses</Link></li>
                  <li><Link to="/solutions/individuals" className="hover:text-white transition">Individuals</Link></li>
                  {/* <li><Link to="/solutions/api" className="hover:text-white transition">API & Integration</Link></li> */}
                </ul>
              )}
            </li>
            <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
            <li><Link to="/resources" className="hover:text-white transition">Resources</Link></li>
            <li><a href={import.meta.env.VITE_ADMIN_URL || "http://localhost:5176"} className="hover:text-white transition">Admin Portal</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
            <li>Carbon Footprint & Analysis</li>
            <li>Carbon Credit Project Development</li>
            <li>Mitigation and Reduction</li>
            <li>Life-Cycle Assessment</li>
            <li>ESG Reporting</li>
            <li>Carbon Trading</li>
            <li>Net Zero Strategy</li>
            <li>Membership Packages</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Stay Updated</h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            Receive expert analysis and the latest trends in the carbon market via email.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 w-full py-2 text-xs sm:text-sm sm:text-base">
            <input
              type="email"
              placeholder="e.g., name@example.com"
              className="pl-3 pr-3 bg-[#1E293B] text-white rounded-md w-full sm:w-auto px-4 py-2 text-xs sm:text-sm sm:text-base"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded-md"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <hr className="my-6 sm:my-10 border-gray-700" />

      <p className="text-center text-xs sm:text-sm text-gray-500">
        © 2025 Aerthx. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
