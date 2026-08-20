import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AdminUpdateCarbonCredit = ({ id, goBack }) => {
  const [formData, setFormData] = useState({
    title: '', name: '', verifiedBy: '', category: '', projectType: '',
    projectDeveloper: '', methodology: '', projectDuration: '',
    tons: '', pricePerTon: '', info: '', country: '', state: '',
    city: '', placeName: '', vintage: '', vintageYear: '',
    retired: false, sdgs: '', registryLink: '', additionalNotes: '', imageUrl: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
const [bgPreview, setBgPreview] = useState(null);
const [backgroundFile, setBackgroundFile] = useState(null);


  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const res = await axios.get(`${API}/carbon-credits`);
        const credit = res.data.find(c => c._id === id);
        if (credit) {
          setFormData({
            ...credit,
            sdgs: Array.isArray(credit.sdgs) ? credit.sdgs.join(', ') : credit.sdgs,
          });
        }
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    fetchCredit();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

 const handleFileChange = (e) => {
  const selected = e.target.files[0];
  setFile(selected);

  if (selected) {
    setPreview(URL.createObjectURL(selected));
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();

  Object.keys(formData).forEach((key) => {
    let value = formData[key];

    if (value === undefined || value === null) return;

    // 🔥 FIX NUMBERS
    if (["tons", "pricePerTon"].includes(key)) {
      value = Number(value);
    }

    // 🔥 FIX ARRAY (SDGS)
    if (key === "sdgs") {
      value = value.split(",").map((s) => s.trim());
    }

    data.append(key, value);
  });

  if (file) data.append("image", file);
  if (backgroundFile) data.append("backgroundImage", backgroundFile);

  try {
    await axios.put(`${API}/carbon-credits/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("✅ Updated successfully");
    goBack();
  } catch (err) {
    console.error("UPDATE ERROR:", err.response?.data || err.message);
    alert("❌ Update failed");
  }
};

  const inputClass = "w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500";

  const renderInput = (name, label, placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
       value={formData[name] || ""}
        onChange={handleChange}
        className={inputClass}
      />
    </div>
  );

  return (
     <div className="p-3 sm:p-6 md:p-10 max-w-5xl mx-auto bg-white rounded-2xl shadow-md">
    {goBack && (
      <button
        onClick={goBack}
        className="mb-6 inline-flex items-center text-xs sm:text-sm text-green-600 hover:underline"
      >
        ← Back to Manage Credits
      </button>
    )}
    <h2 className="text-base sm:text-lg md:text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
      ✏️ Update Carbon Credit
    </h2>

      <form onSubmit={handleSubmit} className="space-y-10">

        <div className="border border-gray-300 rounded-xl p-4 sm:p-6 bg-gray-50">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-4">📋 Project Information</h3>
          <div className="grid grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderInput('title', 'Project Title')}
            {renderInput('name', 'Carbon Credit Name')}
            {renderInput('verifiedBy', 'Verified By')}
            {renderInput('category', 'Category')}
            {renderInput('projectType', 'Project Type')}
            {renderInput('projectDeveloper', 'Project Developer')}
            {renderInput('methodology', 'Methodology')}
            {renderInput('projectDuration', 'Project Duration')}
            {renderInput('tons', 'Total Tons')}
            {renderInput('pricePerTon', 'Price Per Ton (RS)')}
          </div>
        </div>

        <div className="border border-gray-300 rounded-xl p-6 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📍 Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('country', 'Country')}
            {renderInput('state', 'State')}
            {renderInput('city', 'City')}
            {renderInput('placeName', 'Place Name')}
          </div>
        </div>

        <div className="border border-gray-300 rounded-xl p-6 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">🕰️ Vintage & Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('vintage', 'Vintage')}
            {renderInput('vintageYear', 'Vintage Year')}
            {renderInput('registryLink', 'Registry Link')}
          </div>
        </div>

        <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 space-y-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">📄 Details & Status</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
            <textarea
              name="info"
              value={formData.info || ""}
              onChange={handleChange}
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🎯 SDGs (comma-separated)</label>
            <input
              type="text"
              name="sdgs"
              value={formData.sdgs}
              onChange={handleChange}
              placeholder="Climate Action, Life Below Water"
              className={inputClass}
            />
          </div>

          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <input
              type="checkbox"
              name="retired"
              checked={!!formData.retired}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 border-gray-300 rounded"
            />
            <label htmlFor="retired" className="text-sm text-gray-700">
              Mark as <strong>Retired</strong>
            </label>
          </div>
        </div>

        <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 space-y-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">🖼️ Media & Notes</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📝 Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={2}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📁 Upload New Image (optional)</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-xs sm:text-sm text-gray-500 file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
          </div>

          {renderInput('imageUrl', '🌐 Image URL (optional)', 'https://example.com/project.jpg')}

          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">🌄 Upload Background Image (optional)</label>
  <input
    type="file"
    onChange={(e) => setBackgroundFile(e.target.files[0])}
    className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
  />
</div>

        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            💾 Update Credit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateCarbonCredit;

