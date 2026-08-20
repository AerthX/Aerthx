import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/new_aerthx.jpeg';
import { getActiveCarbonCredits } from '../services/carbonCreditService';
import { getMediaUrl } from '../utils/media';

const PRICE_RANGES = {
  low: { label: 'Under ₹800', test: (value) => value < 800 },
  mid: { label: '₹800 – ₹1,100', test: (value) => value >= 800 && value <= 1100 },
  high: { label: 'Above ₹1,100', test: (value) => value > 1100 },
};

const MarketPlace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedVintage, setSelectedVintage] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getActiveCarbonCredits();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching active carbon-credit projects:', err);
      setError('We could not load the Marketplace projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const categories = useMemo(
    () => [...new Set(projects.map((project) => project.category).filter(Boolean))].sort(),
    [projects]
  );

  const places = useMemo(
    () => [...new Set(projects.map((project) => project.country).filter(Boolean))].sort(),
    [projects]
  );

  const vintages = useMemo(
    () => [...new Set(projects.map((project) => String(project.vintage)).filter(Boolean))].sort().reverse(),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch = !query || [
        project.title,
        project.name,
        project.category,
        project.projectType,
        project.country,
        project.state,
        project.city,
      ].some((value) => String(value || '').toLowerCase().includes(query));

      const matchesCategory = !selectedCategory || project.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesPlace = !selectedPlace || project.country?.toLowerCase() === selectedPlace.toLowerCase();
      const matchesVintage = !selectedVintage || String(project.vintage) === selectedVintage;
      const matchesPrice = !priceRange || PRICE_RANGES[priceRange]?.test(Number(project.pricePerTon) || 0);

      return matchesSearch && matchesCategory && matchesPlace && matchesVintage && matchesPrice;
    });
  }, [projects, searchTerm, selectedCategory, selectedPlace, selectedVintage, priceRange]);

  const formatRupees = (amount) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

  return (
    <div className="min-h-screen bg-[#06120c] text-white px-3 sm:px-4 pb-12">
      <section
        className="relative -mx-3 sm:-mx-4 mb-8 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#06120c]/85 via-[#06120c]/80 to-[#06120c]" />
        <div className="relative mx-auto w-full max-w-7xl px-3 sm:px-6 py-16 sm:py-20 md:py-24 text-center">
        <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-950/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Verified • Transparent • Impactful
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight font-['Plus_Jakarta_Sans']">
           <span className="bg-linear-to-r from-[#1A5C38] to-[#2E8B57] bg-clip-text text-transparent">
             AerthX
        </span>{" "}
        <span className="text-white">Marketplace</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-emerald-50/80 px-2">
            Support trusted carbon offset projects through a transparent marketplace built for meaningful climate action.
          </p>
    </div>
      </section>

      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4 justify-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search projects..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full lg:w-2/3 px-4 sm:px-5 py-2.5 sm:py-3 bg-white/95 text-gray-900 rounded-2xl sm:rounded-full text-sm shadow-md sm:shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <button
            type="button"
            onClick={() => setFilterOpen((open) => !open)}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-sm rounded-2xl sm:rounded-full font-medium hover:bg-emerald-500/25 transition"
          >
            {filterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {filterOpen && (
          <div className="bg-white/95 rounded-2xl shadow-xl px-4 sm:px-6 py-4 sm:py-5 mb-6 sm:mb-8 text-gray-900 border border-emerald-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="w-full bg-gray-100 px-4 py-2.5 rounded-xl sm:rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">All Categories</option>
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Country</label>
                <select value={selectedPlace} onChange={(event) => setSelectedPlace(event.target.value)} className="w-full bg-gray-100 px-4 py-2.5 rounded-xl sm:rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">All Countries</option>
                  {places.map((place) => <option key={place} value={place}>{place}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Vintage</label>
                <select value={selectedVintage} onChange={(event) => setSelectedVintage(event.target.value)} className="w-full bg-gray-100 px-4 py-2.5 rounded-xl sm:rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Any Year</option>
                  {vintages.map((vintage) => <option key={vintage} value={vintage}>{vintage}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Price Range</label>
                <select value={priceRange} onChange={(event) => setPriceRange(event.target.value)} className="w-full bg-gray-100 px-4 py-2.5 rounded-xl sm:rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">All Prices</option>
                  {Object.entries(PRICE_RANGES).map(([key, range]) => <option key={key} value={key}>{range.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {(searchTerm || selectedCategory || selectedPlace || selectedVintage || priceRange) && (
          <div className="text-xs sm:text-sm text-emerald-100/80 mb-4 leading-relaxed">
            Showing {filteredProjects.length} of {projects.length} available projects
            {searchTerm && <span className="mx-1">| Search: {searchTerm}</span>}
            {selectedCategory && <span className="mx-1">| Category: {selectedCategory}</span>}
            {selectedPlace && <span className="mx-1">| Country: {selectedPlace}</span>}
            {selectedVintage && <span className="mx-1">| Vintage: {selectedVintage}</span>}
            {priceRange && <span className="mx-1">| Price: {PRICE_RANGES[priceRange]?.label}</span>}
          </div>
        )}

        {loading ? (
          <div className="text-center text-emerald-100/70 py-12">Loading projects from the AerthX database...</div>
        ) : error ? (
          <div className="max-w-xl mx-auto text-center rounded-2xl border border-red-400/20 bg-red-950/30 px-6 py-8 text-red-100">
            <p>{error}</p>
            <button type="button" onClick={fetchProjects} className="mt-4 rounded-full bg-emerald-500 px-5 py-2 font-semibold text-white hover:bg-emerald-400 transition">
              Try Again
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center text-emerald-100/60 text-sm mt-10">No active projects match your filters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredProjects.map((project) => (
              <Link
                to={`/project/${project._id}`}
                key={project._id}
                className="bg-white w-full max-w-[340px] sm:max-w-full mx-auto rounded-2xl overflow-hidden shadow-xl border border-emerald-100/70 hover:shadow-emerald-500/20 hover:shadow-2xl hover:border-emerald-400 hover:-translate-y-1 transition-all duration-300 ease-in-out block"
              >
                <img
                  src={getMediaUrl(project.image, heroBg)}
                  alt={project.title}
                  className="w-full h-44 sm:h-40 md:h-44 object-cover"
                  loading="lazy"
                />
                <div className="p-4 sm:p-5 flex flex-col justify-between h-full">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-green-700">{formatRupees(project.pricePerTon)} / ton</h3>
                    <h4 className="text-sm sm:text-base font-bold text-gray-800 line-clamp-2 mt-1 leading-snug">{project.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-3 leading-relaxed">{project.info}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.country && <span className="bg-gray-100 px-3 py-1 text-xs rounded-full text-gray-700 border">{project.country}</span>}
                    {project.category && <span className="bg-gray-100 px-3 py-1 text-xs rounded-full text-blue-700 border border-blue-200">🌿 {project.category}</span>}
                    {project.vintage && <span className="bg-gray-100 px-3 py-1 text-xs rounded-full text-gray-700 border">{project.vintage}</span>}
                    {project.remainingTons != null && <span className="bg-emerald-50 px-3 py-1 text-xs rounded-full text-emerald-700 border border-emerald-200">{Number(project.remainingTons).toLocaleString('en-IN')} tons left</span>}
                    {project.sdgs?.length > 0 && <span className="bg-green-50 px-3 py-1 text-xs rounded-full text-green-700 border border-green-200">🌍 {project.sdgs.length} SDGs</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPlace;
