import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MarketplaceHero = () => {
  const [projects, setProjects] = useState([]);
  const [recommended, setRecommended] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API}/carbon-credits/active`);
        const data = res.data || [];

        setProjects(data);

        // ✅ Daily recommendation
        if (data.length > 0) {
          const seed = new Date().toDateString();
          const index =
            Math.abs(
              seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
            ) % data.length;

          setRecommended(data[index]);
        }
      } catch (err) {
        console.error("Error fetching MarketplaceHero:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [API]);

  // ✅ LIMIT TO 6 PROJECTS (you can change to 7)
  const limitedProjects = projects.slice(0, 6);

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-800">
          🌱 Carbon Credit MarketplaceHero
        </h1>
        <p className="text-gray-500 mt-1">
          Invest in verified projects and offset your carbon footprint
        </p>
      </div>

      {/* ⭐ Recommended */}
      {recommended && (
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">
            ⭐ Today’s Recommendation
          </h2>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <img
              src={recommended.image || "/placeholder.jpg"}
              alt=""
              className="w-full md:w-48 h-32 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h3 className="text-lg font-bold">
                {recommended.title}
              </h3>

              <p className="text-sm opacity-90 mt-1">
                {recommended.country} • {recommended.projectType}
              </p>

              <p className="mt-2 font-semibold">
                ₹{recommended.pricePerTon} / ton
              </p>

              <button className="mt-3 px-5 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MarketplaceHero Grid */}
      {loading ? (
        <p className="text-gray-500">Loading projects...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {limitedProjects.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <img
             src={
  p.image
    ? getMediaUrl(p.image)
    : "/placeholder.jpg"
}
                alt=""
                className="h-40 w-full object-cover"
              />

              {/* Content */}
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {p.title}
                </h2>

                <p className="text-xs text-gray-500">
                  {p.country} • {p.projectType}
                </p>

                {/* Metrics */}
                <div className="text-sm text-gray-600">
                  🌿 {p.remainingTons} tons available
                </div>

                <div className="text-sm font-medium text-green-700">
                  ₹{p.pricePerTon} / ton
                </div>

                {/* Impact */}
                <div className="text-xs text-gray-500">
                  Impact Score: {p.impactScore}
                </div>

                {/* Button */}
                <button className="w-full mt-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Buy Credits
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="text-center">
       <button
  onClick={() => navigate("/MarketplaceHero")}
  className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
>
  Explore Full MarketplaceHero →
</button>
      </div>
    </div>
  );
};

export default MarketplaceHero;