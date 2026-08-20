import React, { useState } from 'react';
import axios from 'axios';

const AdminAddCarbonCredit = () => {
  const [formData, setFormData] = useState({
    title: '', name: '', verifiedBy: '', category: '', projectType: '',
    projectDeveloper: '', methodology: '', projectDuration: '',
    tons: '', pricePerTon: '', info: '', country: '', state: '',
    city: '', placeName: '', vintage: '', vintageYear: '',
    retired: false, sdgs: '', registryLink: '', additionalNotes: '', imageUrl: '', registrySerialNumbers: '',
    impactScore: '', // new
    impactMetrics: { co2Avoided: '', treesPlanted: '', communitiesBenefited: '', energyGenerated: '' } // new
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
const [bgPreview, setBgPreview] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value
      }
    }));
  };

  const handleFileChange = (e) => {
  const selected = e.target.files[0];
  setFile(selected);

  if (selected) {
    setPreview(URL.createObjectURL(selected));
  }
};
 const handleBackgroundFileChange = (e) => {
  const selected = e.target.files[0];
  setBackgroundFile(selected);

  if (selected) {
    setBgPreview(URL.createObjectURL(selected));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (let key in formData) {
      if (key === 'impactMetrics') {
        for (let metric in formData.impactMetrics) {
          data.append(`impactMetrics[${metric}]`, formData.impactMetrics[metric]);
        }
      } else {
        data.append(key, formData[key]);
      }
    }

    if (file) data.append('image', file);
    if (backgroundFile) data.append('backgroundImage', backgroundFile);

    try {
      const API = import.meta.env.VITE_API_URL;
      await axios.post(`${API}/carbon-credits`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('✅ Carbon Credit added!');
      setFormData({
        title: '', name: '', verifiedBy: '', category: '', projectType: '',
        projectDeveloper: '', methodology: '', projectDuration: '',
        tons: '', pricePerTon: '', info: '', country: '', state: '',
        city: '', placeName: '', vintage: '', vintageYear: '',
        retired: false, sdgs: '', registryLink: '', additionalNotes: '', imageUrl: '',
        impactScore: '',
        impactMetrics: { co2Avoided: '', treesPlanted: '', communitiesBenefited: '', energyGenerated: '' }
      });
      setFile(null);
      setBackgroundFile(null);
    } catch (err) {
      alert('❌ Failed to add credit');
      console.error(err);
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
        value={formData[name]}
        onChange={handleChange}
        className={inputClass}
      />
    </div>
  );

  const renderNestedInput = (parent, name, label, placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={formData[parent][name]}
        onChange={(e) => handleNestedChange(e, parent)}
        className={inputClass}
      />
    </div>
  );

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        ➕ Add New Carbon Credit Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* Project Info */}
        <div className="border border-gray-300 rounded-xl p-6 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📋 Project Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('title', 'Project Title')}
            {renderInput('name', 'Carbon Credit Name')}
            {renderInput('verifiedBy', 'Verified By')}
            {renderInput('category', 'Category')}
            {renderInput('projectType', 'Project Type')}
            {renderInput('projectDeveloper', 'Project Developer')}
            {renderInput('methodology', 'Methodology')}
            {renderInput('projectDuration', 'Project Duration')}
            {renderInput('tons', 'Total Tons')}
            {renderInput('pricePerTon', 'Price Per Ton (RS)', 'e.g. 1250')}
            {renderInput('impactScore', 'Impact Score', 'e.g. 85')} {/* New */}
          </div>
        </div>

        {/* Location */}
        <div className="border border-gray-300 rounded-xl p-6 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📍 Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('country', 'Country')}
            {renderInput('state', 'State')}
            {renderInput('city', 'City')}
            {renderInput('placeName', 'Place Name')}
          </div>
        </div>

        {/* Vintage & Registry */}
        <div className="border border-gray-300 rounded-xl p-6 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">🕰️ Vintage & Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('vintage', 'Vintage')}
            {renderInput('vintageYear', 'Vintage Year')}
            {renderInput('registryLink', 'Registry Link')}
            {renderInput('registrySerialNumbers', 'Registry Serial Numbers', 'VCS-XXXX-XXXX')}
          </div>
        </div>

        {/* Details & Status */}
        <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 space-y-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">📄 Details & Status</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
            <textarea
              name="info"
              value={formData.info}
              onChange={handleChange}
              rows={4}
              placeholder="Enter summary of the project’s impact, method, etc."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🎯 Sustainable Development Goals (comma-separated)</label>
            <input
              type="text"
              name="sdgs"
              value={formData.sdgs}
              onChange={handleChange}
              placeholder="e.g. Climate Action, Life on Land"
              className={inputClass}
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="retired"
              checked={formData.retired}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="retired" className="text-sm text-gray-700">
              Mark this credit as <strong>Retired</strong>
            </label>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 space-y-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">🌍 Impact Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderNestedInput('impactMetrics', 'co2Avoided', 'CO₂ Avoided (Tons)')}
            {renderNestedInput('impactMetrics', 'treesPlanted', 'Trees Planted')}
            {renderNestedInput('impactMetrics', 'communitiesBenefited', 'Communities Benefited')}
            {renderNestedInput('impactMetrics', 'energyGenerated', 'Energy Generated (kWh)')}
          </div>
        </div>

        {/* Media & Notes */}
        <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 space-y-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">🖼️ Media & Notes</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📝 Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={2}
              placeholder="Optional notes for internal use"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📁 Upload Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
          </div>

          {renderInput('imageUrl', '🌐 Image URL (optional)', 'https://example.com/project.jpg')}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🌄 Upload Background Image</label>
            <input
              type="file"
              onChange={handleBackgroundFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-green-600 text-white w-full sm:w-auto px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            🚀 Submit Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddCarbonCredit;
