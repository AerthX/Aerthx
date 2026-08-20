import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

const MarketplacePage = () => {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highestPricedProject, setHighestPricedProject] = useState(null);
  const [dailySuggestions, setDailySuggestions] = useState([]);
  const [lowestPricedProjects, setLowestPricedProjects] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [creditsByType, setCreditsByType] = useState({});
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;



  const isUserLoggedIn = () => {
    return !!localStorage.getItem("accessToken");
  };

  const handleButtonClick = (projectId) => {
    if (isUserLoggedIn()) {
      navigate(`/project/${projectId}`);
    } else {
      setShowAuthModal(true);
    }
  };


useEffect(() => {
  const fetchData = async () => {
    try {
   const res = await axios.get(`${API}/carbon-credits/active`);
const projectsFromAPI = res.data;
setAllProjects(projectsFromAPI); // store all projects


const groupedByCategory = allProjects.reduce((acc, project) => {
  if (!project.category) return acc;
  
  if (!acc[project.category]) {
    acc[project.category] = { totalTons: 0, projectCount: 0 };
  }

  acc[project.category].totalTons += project.remainingTons || project.tons || 0;
  acc[project.category].projectCount += 1;

  return acc;
}, {});


setCreditsByType(groupedByCategory);

      const filtered = projectsFromAPI
  .filter((p) => String(p.vintage).trim() === "2024")
  .sort((a, b) => b.vintage - a.vintage);

setProjects(filtered);


      const mostExpensive = allProjects.length
        ? allProjects.reduce(
            (max, curr) =>
              curr.pricePerTon > (max?.pricePerTon || 0) ? curr : max,
            null
          )
        : null;
      setHighestPricedProject(mostExpensive);

      const sortedByPrice = [...allProjects]
        .filter((p) => p.pricePerTon)
        .sort((a, b) => a.pricePerTon - b.pricePerTon);
      setLowestPricedProjects(sortedByPrice.slice(0, 4));

      let daily = localStorage.getItem("dailySuggestions");
      let lastUpdated = localStorage.getItem("dailySuggestionsUpdated");

      if (
        daily &&
        lastUpdated &&
        new Date().getTime() - parseInt(lastUpdated) <
          24 * 60 * 60 * 1000
      ) {
        setDailySuggestions(JSON.parse(daily));
      } else {
        const shuffled = [...allProjects].sort(() => Math.random() - 0.5);
        const newSuggestions = shuffled.slice(0, 4);
        setDailySuggestions(newSuggestions);
        localStorage.setItem("dailySuggestions", JSON.stringify(newSuggestions));
        localStorage.setItem("dailySuggestionsUpdated", new Date().getTime());
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  fetchData();
}, [API]);

const impactfulProjects = [...allProjects]
  .filter(p => p.impactScore) 
  .sort((a, b) => b.impactScore - a.impactScore)
  .slice(0, 4);


  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  if (!projects.length) return null;

  const current = projects[currentIndex];

  return (
    <div className="w-full">
      <div className="relative w-full h-[650px] sm:h-[700px] lg:h-[850px] overflow-hidden shadow-lg">
        <img
         src={`${import.meta.env.VITE_FILE_URL}${current.backgroundImage || current.image}`}
          alt={current.title}
          className="w-full h-full object-cover absolute inset-0"
        />

        <div className="absolute inset-0 bg-black/50 z-0" />

        <div className="absolute top-1/2 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-6 md:px-10 transform -translate-y-1/2">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/20 hover:bg-white/40 hover:scale-125 transition-all duration-300"
          >
            <ArrowLeft className="text-white w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/20 hover:bg-white/40 hover:scale-125 transition-all duration-300"
          >
            <ArrowRight className="text-white w-6 h-6" />
          </button>
        </div>

        <div className="absolute bottom-4 sm:bottom-8 md:bottom-10 left-4 sm:left-8 md:left-20 z-20 text-white w-[90%] sm:w-auto max-w-md sm:max-w-lg">
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 shadow-md backdrop-blur-sm bg-black/20">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 leading-tight text-white drop-shadow">
              {current.title}
            </h2>

            <p className="text-sm sm:text-base line-clamp-3 mb-3 text-gray-100 leading-relaxed drop-shadow">
              {current.info}
            </p>

            <div className="text-sm sm:text-base font-medium space-y-1 mb-4">
              <p className="text-green-300">
                💰 ${current.pricePerTon?.toFixed(2)} / Ton
              </p>
              <p className="text-gray-200">📅 Vintage: {current.vintage}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
           <button
  onClick={() => {
    if (isUserLoggedIn()) {
      navigate("/marketplace");
    } else {
      setShowAuthModal(true);
    }
  }}
  className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-full text-sm font-semibold shadow transition"
>
  Explore More
</button>

              <button
                onClick={() => handleButtonClick(current._id)}
                className="bg-white hover:bg-gray-100 text-green-700 py-2 px-5 rounded-full text-sm font-semibold shadow transition"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {highestPricedProject && (
        <div className="mt-10 sm:mt-12 w-full bg-green-50 rounded-2xl shadow-lg flex flex-col lg:flex-row overflow-hidden px-4 sm:px-6 md:px-12 py-5 sm:py-6">
          <div className="sm:w-1/2 p-3">
            <img
           src={`${import.meta.env.VITE_FILE_URL}${
                highestPricedProject.backgroundImage ||
                highestPricedProject.image
              }`}
              alt={highestPricedProject.title}
             className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-xl shadow"
            />
          </div>

          <div className="lg:w-1/2 p-4 sm:p-6 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-widest text-green-600 font-semibold mb-3">
              🔥 Premium Carbon Credit Project
            </span>

            <h2 className="text-3xl font-extrabold text-green-800 mb-3 leading-tight">
              {highestPricedProject.title}
            </h2>

            <p className="text-base text-gray-700 mb-4 leading-relaxed tracking-wide">
              {highestPricedProject.info?.slice(0, 160)}...
            </p>

            <p className="text-lg font-medium text-green-700 mb-6">
              💰 Price per Metric Ton:{" "}
              <span className="font-bold">
                ${highestPricedProject.pricePerTon?.toFixed(2)}
              </span>
            </p>

            <button
              onClick={() => handleButtonClick(highestPricedProject._id)}
              className="inline-block bg-green-600 hover:bg-green-700 hover:scale-105 transform transition-transform duration-300 text-white py-2 px-6 rounded-full text-sm font-semibold shadow-md w-44 text-center"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {dailySuggestions.length > 0 && (
        <div className="mt-12 sm:mt-16 px-4 sm:px-6 md:px-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">
            🌱 Our Suggestions Today
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {dailySuggestions.map((project) => (
              <div
                key={project._id}
                className="rounded-xl shadow-lg overflow-hidden relative group h-64 sm:h-72 cursor-pointer"
                onClick={() => handleButtonClick(project._id)}
              >
                <img
                  src={`${import.meta.env.VITE_FILE_URL}${
                    project.backgroundImage || project.image
                  }`}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />
                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <h3 className="text-lg font-semibold truncate">
                    {project.title}
                  </h3>
                  <p className="text-green-300 mt-1 font-medium">
                    💰 ${project.pricePerTon?.toFixed(2)} / Ton
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 sm:mt-20 mx-3 sm:mx-6 md:mx-10 bg-green-50 rounded-2xl shadow-2xl p-5 sm:p-8 md:p-12 text-center transform transition-transform duration-500 hover:scale-[1.01] relative overflow-hidden">
        <div className="absolute inset-0 border-4 border-green-200 rounded-3xl animate-pulse" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-green-800 mb-6 tracking-tight drop-shadow-md">
            Benefits of Buying Carbon Credits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 md:divide-x md:divide-green-300">
            <div className="flex flex-col items-center">
              <div className="text-4xl text-green-600 mb-3">🌱</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reduce Emissions</h3>
              <p className="text-sm text-gray-600 px-4">
                Purchasing carbon credits directly funds projects that reduce greenhouse gases and combat climate change.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl text-green-600 mb-3">⚡️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Support Clean Energy</h3>
              <p className="text-sm text-gray-600 px-4">
                Your investment enables the growth of renewable energy sources and other sustainable technologies.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl text-green-600 mb-3">🤝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Empower Communities</h3>
              <p className="text-sm text-gray-600 px-4">
                Funds are used to support local communities through economic development and environmental education.
              </p>
            </div>
          </div>
        </div>
      </div>

    {impactfulProjects.length > 0 && (
  <div className="mt-16 px-6 sm:px-12">
    <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">
      🌍 Most Impactful Projects
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {impactfulProjects.map((project) => (
        <div
          key={project._id}
          className="rounded-xl shadow-lg overflow-hidden group relative h-72 cursor-pointer"
          onClick={() => handleButtonClick(project._id)}
        >
          <img
            src={`${import.meta.env.VITE_FILE_URL}${project.backgroundImage || project.image}`}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition" />
          <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h3 className="text-lg font-semibold truncate">{project.title}</h3>
            <p className="text-green-300 font-medium">
              🌱 Impact Score: {project.impactScore || "N/A"}
            </p>
            <div className="flex flex-wrap mt-2 gap-2 text-xs">
              {project.sdgs?.slice(0, 3).map((sdg, idx) => (
                <span key={idx} className="bg-green-700/80 px-2 py-1 rounded-full">
                  {sdg.goal || sdg}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{Object.keys(creditsByType).length > 0 && (
  <div className="mt-16 px-6 sm:px-12">
    <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">
      🌐 Carbon Credits by Category
    </h2>
    <p className="text-gray-600 mb-8 max-w-2xl">
      Categories group different project types together. Each category represents a major way to fight climate change.
    </p>
<div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100">
  {Object.entries(creditsByType).map(([category, data]) => (
    <div
      key={category}
      onClick={() => navigate(`/marketplace?filter=${category}`)}
      className="min-w-[220px] sm:min-w-[240px] bg-green-50 rounded-2xl shadow-lg p-5 sm:p-6 flex flex-col items-center text-center hover:scale-105 hover:bg-green-100 transition-all duration-300 cursor-pointer"
    >
      <div className="text-4xl mb-3">🌱</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{category}</h3>
      <p className="text-green-700 font-bold text-xl mb-1">
        {data.totalTons.toLocaleString()} Tons
      </p>
      <p className="text-sm text-gray-600 mb-2">
        {data.projectCount} projects
      </p>
      <p className="text-sm text-gray-600">
        Carbon credits available in this category
      </p>
    </div>
  ))}
</div>
  
  </div>
)}



      <div className="mt-16 px-6 sm:px-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">
          📊 Global Impact So Far
        </h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="bg-green-50 p-4 sm:p-6 rounded-2xl shadow-md">
            <p className="text-3xl font-bold text-green-700">
              {projects.reduce((sum, p) => sum + (p.impactMetrics?.co2Avoided || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Tons CO₂ Avoided</p>
          </div>
          <div className="bg-green-50 p-4 sm:p-6 rounded-2xl shadow-md">
            <p className="text-3xl font-bold text-green-700">
              {projects.reduce((sum, p) => sum + (p.impactMetrics?.treesPlanted || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Trees Planted</p>
          </div>
          <div className="bg-green-50 p-4 sm:p-6 rounded-2xl shadow-md">
            <p className="text-3xl font-bold text-green-700">
              {projects.reduce((sum, p) => sum + (p.impactMetrics?.communitiesBenefited || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Communities Benefited</p>
          </div>
          <div className="bg-green-50 p-4 sm:p-6 rounded-2xl shadow-md">
            <p className="text-3xl font-bold text-green-700">
              {projects.reduce((sum, p) => sum + (p.impactMetrics?.energyGenerated || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">kWh Energy Generated</p>
          </div>
        </div>
      </div>

      {lowestPricedProjects.length > 0 && (
        <div className="mt-16 px-6 sm:px-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">
            💸 Most Affordable Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lowestPricedProjects.map((project) => (
              <div
                key={project._id}
                className="rounded-xl shadow-md hover:shadow-xl overflow-hidden relative group h-64 sm:h-72 cursor-pointer"
                onClick={() => handleButtonClick(project._id)}
              >
                <img
                  src={`${import.meta.env.VITE_FILE_URL}${
                    project.backgroundImage || project.image
                  }`}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />
                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <h3 className="text-lg font-semibold truncate">{project.title}</h3>
                  <p className="text-green-300 mt-1 font-medium">
                    💰 ${project.pricePerTon?.toFixed(2)} / Ton
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 sm:mt-24 mx-3 sm:mx-6 md:mx-8 bg-gradient-to-r from-green-500 to-green-700 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 text-center shadow-2xl rounded-3xl transform md:-rotate-1">
        <div className="transform rotate-1">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg leading-tight">
            Join the Movement for a Greener Planet 🌍
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto opacity-90 drop-shadow-md">
            Every carbon credit you purchase empowers sustainable initiatives and creates a lasting, positive global impact.
          </p>
          <button
            onClick={() => {
              if (isUserLoggedIn()) {
                navigate("/marketplace");
              } else {
                setShowAuthModal(true);
              }
            }}
            className="inline-block bg-white text-green-700 hover:bg-gray-100 py-4 px-12 rounded-full font-bold text-lg shadow-xl transform transition-transform duration-300 hover:scale-105"
          >
            Explore Projects Now
          </button>
        </div>
      </div>

      {showAuthModal && (
       <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 max-w-sm w-full relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Action Required
              </h3>
              <p className="text-sm text-gray-600">
                Please log in or register to view project details.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                to="/signin"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold text-center transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-full font-semibold text-center transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;