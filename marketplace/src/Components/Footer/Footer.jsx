const Footer = () => {
  return (
    <footer className="bg-[#0B1120] text-white px-6 py-10 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex-1 min-w-[250px]">
          <h2 className="text-green-500 text-2xl font-bold mb-2">AerthX</h2>
          <p className="text-gray-300 mb-4">
            Your trusted partner in carbon offset, ESG reporting, and sustainable innovation.
          </p>
          <div className="text-sm space-y-1">
            <p className="flex items-center gap-2">
              <span>📧</span> aerthx01@gmail.com
            </p>
            <p className="flex items-center gap-2">
              <span>📞</span> +91-98765-XXXX
            </p>
          </div>
          <div className="flex gap-4 mt-4 text-xl text-gray-400">
            <a href="#"><i className="fab fa-linkedin hover:text-white" /></a>
            <a href="#"><i className="fab fa-instagram hover:text-white" /></a>
            <a href="#"><i className="fab fa-facebook hover:text-white" /></a>
            <a href="#"><i className="fab fa-twitter hover:text-white" /></a>
          </div>
        </div>

        <div className="flex-1 min-w-[250px]">
          <h3 className="text-white text-lg font-semibold mb-3">Services</h3>
          <ul className="text-gray-300 space-y-2 text-sm">
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

        <div className="flex-1 min-w-[250px]">
          <h3 className="text-white text-lg font-semibold mb-3">Stay Updated</h3>
          <p className="text-gray-300 text-sm mb-4">
          Receive expert analysis and the latest trends in the carbon market directly via email.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="e.g., name@example.com"
              className="px-4 py-2 text-white rounded-md w-full sm:w-auto sm:flex-1"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <hr className="my-8 border-gray-700" />
      <p className="text-center text-sm text-gray-400">
        © 2025 AerthX. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
