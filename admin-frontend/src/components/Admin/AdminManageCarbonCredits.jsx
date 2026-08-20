import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEllipsisV, FaGlobe, FaTag, FaMoneyBillWave, FaFilter } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MdArchive, MdCheckCircle, MdCancel, MdDelete, MdEdit, MdUnarchive, MdAddCircle, MdClose } from "react-icons/md";

const API = import.meta.env.VITE_API_URL;

const AdminManageCarbonCredits = ({ onEdit = () => {}, onAdd = () => {} }) => {
  const [credits, setCredits] = useState([]);
  const [filteredCredits, setFilteredCredits] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [filters, setFilters] = useState({
    project: "",
    country: "",
    price: "",
    type: "",
    status: "",
  });
  const [showArchived, setShowArchived] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [projectTypes, setProjectTypes] = useState([]);
  const [openBulkMenu, setOpenBulkMenu] = useState(false);
  const [selectedCredits, setSelectedCredits] = useState([]);
  const [isBulkSelectMode, setIsBulkSelectMode] = useState(false);

  useEffect(() => {
    fetchCredits();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [credits, filters, showArchived]);

  const fetchCredits = async () => {
  try {
    const res = await axios.get(`${API}/carbon-credits`);
    const sorted = res.data.sort(
      (a, b) => (b.pricePerTon || 0) - (a.pricePerTon || 0)
    );
    setCredits(sorted);

    const types = [
      ...new Set(
        sorted
          .map((c) => c.projectType?.trim().toLowerCase())
          .filter((t) => t && t.length > 0)
      ),
    ];
    setProjectTypes(types);
  } catch (err) {
    console.error("Failed to fetch carbon credits", err);
  }
};

  const applyFilters = () => {
    let tempCredits = [...credits];

    if (filters.status === "archived") {
      tempCredits = tempCredits.filter((credit) => credit.isArchived);
    } else if (filters.status === "active") {
      tempCredits = tempCredits.filter(
        (credit) => credit.isActive && !credit.isArchived
      );
    } else if (filters.status === "inactive") {
      tempCredits = tempCredits.filter(
        (credit) => !credit.isActive && !credit.isArchived
      );
    } else {
      tempCredits = tempCredits.filter((credit) =>
        showArchived ? credit.isArchived : !credit.isArchived
      );
    }

    if (filters.project) {
      tempCredits = tempCredits.filter((credit) =>
        credit.name.toLowerCase().includes(filters.project.toLowerCase())
      );
    }
    if (filters.country) {
      tempCredits = tempCredits.filter((credit) =>
        credit.country.toLowerCase().includes(filters.country.toLowerCase())
      );
    }
    if (filters.price) {
      tempCredits = tempCredits.filter(
        (credit) => credit.pricePerTon <= parseFloat(filters.price)
      );
    }
    if (filters.type) {
      tempCredits = tempCredits.filter((credit) =>
        credit.projectType.toLowerCase().includes(filters.type.toLowerCase())
      );
    }

    setFilteredCredits(tempCredits);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this credit?")) return;
    try {
      await axios.delete(`${API}/carbon-credits/${id}`);
      fetchCredits();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleUpdate = (credit) => {
    if (typeof onEdit === "function") onEdit(credit._id);
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await axios.put(`${API}/admin/toggle-active/${id}`, {
        isActive: !currentStatus,
      });
      fetchCredits();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Are you sure you want to archive this credit?"))
      return;
    try {
      await axios.put(`${API}/admin/archive/${id}`);
      fetchCredits();
    } catch (err) {
      console.error("Failed to archive credit", err);
    }
  };

  const handleUnarchive = async (id) => {
    if (!window.confirm("Are you sure you want to unarchive this credit?"))
      return;
    try {
      await axios.put(`${API}/admin/unarchive/${id}`);
      fetchCredits();
    } catch (err) {
      console.error("Failed to unarchive credit", err);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Title",
      "Name",
      "Price/Ton",
      "Tons",
      "Remaining Tons",
      "Country",
      "Vintage Year",
      "Project Type",
      "Project Developer",
      "Verified By",
      "Retired",
      "Registry Link",
      "Additional Notes",
      "Active",
      "Certificate ID",
"Registry Serial",
"Retirement Status",
    ];
    const rows = filteredCredits.map((credit) => [
      credit.title,
      credit.name,
      credit.pricePerTon,
      credit.tons,
      credit.remainingTons,
      credit.country,
      credit.vintageYear,
      credit.projectType,
      credit.projectDeveloper,
      credit.verifiedBy,
      credit.retired ? "Yes" : "No",
      credit.registryLink,
      credit.additionalNotes,
      credit.isActive ? "Yes" : "No",
      credit.certificateId,
credit.registrySerialNumbers,
credit.retirementStatus,
    ]);

    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "carbon_credits.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Carbon Credit List", 14, 20);

    if (filteredCredits.length === 0) {
      doc.text("No data to export.", 14, 30);
      doc.save("carbon_credits.pdf");
      return;
    }

    const headers = [
      "Title",
      "Name",
      "Price/Ton",
      "Tons",
      "Remaining",
      "Country",
      "Vintage Year",
      "Project Type",
      "Project Developer",
      "Verified By",
      "Retired",
      "Registry Link",
      "Active",
      "Certificate ID",
"Registry",
"Status",
    ];

    const rows = filteredCredits.map((credit) => [
      credit.title || "",
      credit.name || "",
      credit.pricePerTon || "",
      credit.tons || "",
      credit.remainingTons || "",
      credit.country || "",
      credit.vintageYear || "",
      credit.projectType || "",
      credit.projectDeveloper || "",
      credit.verifiedBy || "",
      credit.retired ? "Yes" : "No",
      credit.registryLink || "",
      credit.isActive ? "Yes" : "No",
      credit.certificateId || "",
credit.registrySerialNumbers || "",
credit.retirementStatus || "",
    ]);

    doc.autoTable({
      startY: 25,
      head: [headers],
      body: rows,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: "#28a745" },
    });
    doc.save("carbon_credits.pdf");
  };

  const handleViewDetails = (credit) => {
    setSelectedCredit(credit);
    setOpenMenuId(null);
  };

  const handleCheckboxChange = (id) => {
    setSelectedCredits((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((creditId) => creditId !== id)
        : [...prevSelected, id]
    );
  };

  const handleBulkSelectAll = () => {
    setIsBulkSelectMode(true);
    if (selectedCredits.length === filteredCredits.length) {
      setSelectedCredits([]);
      setIsBulkSelectMode(false);
    } else {
      const allIds = filteredCredits.map((c) => c._id);
      setSelectedCredits(allIds);
    }
  };

  const handleBulkActivateAll = async () => {
    if (selectedCredits.length === 0) {
      alert("No credits selected for bulk activation.");
      return;
    }
    if (
      !window.confirm(
        "Are you sure you want to activate all selected credits?"
      )
    )
      return;
    try {
      await Promise.all(
        selectedCredits.map((id) =>
          axios.put(`${API}/admin/toggle-active/${id}`, { isActive: true })
        )
      );
      fetchCredits();
      setSelectedCredits([]);
      setOpenBulkMenu(false);
      setIsBulkSelectMode(false);
    } catch (err) {
      console.error("Failed to activate selected credits", err);
    }
  };

  const handleBulkDeactivateAll = async () => {
    if (selectedCredits.length === 0) {
      alert("No credits selected for bulk deactivation.");
      return;
    }
    if (
      !window.confirm(
        "Are you sure you want to deactivate all selected credits?"
      )
    )
      return;
    try {
      await Promise.all(
        selectedCredits.map((id) =>
          axios.put(`${API}/admin/toggle-active/${id}`, { isActive: false })
        )
      );
      fetchCredits();
      setSelectedCredits([]);
      setOpenBulkMenu(false);
      setIsBulkSelectMode(false);
    } catch (err) {
      console.error("Failed to deactivate selected credits", err);
    }
  };

  const handleBulkArchiveAll = async () => {
    if (selectedCredits.length === 0) {
      alert("No credits selected for bulk archiving.");
      return;
    }
    if (
      !window.confirm("Are you sure you want to archive all selected credits?")
    )
      return;
    try {
      await Promise.all(
        selectedCredits.map((id) => axios.put(`${API}/admin/archive/${id}`))
      );
      fetchCredits();
      setSelectedCredits([]);
      setOpenBulkMenu(false);
      setIsBulkSelectMode(false);
    } catch (err) {
      console.error("Failed to archive selected credits", err);
    }
  };

  const handleBulkUnarchiveAll = async () => {
    if (selectedCredits.length === 0) {
      alert("No credits selected for bulk unarchiving.");
      return;
    }
    if (
      !window.confirm(
        "Are you sure you want to unarchive all selected credits?"
      )
    )
      return;
    try {
      await Promise.all(
        selectedCredits.map((id) => axios.put(`${API}/admin/unarchive/${id}`))
      );
      fetchCredits();
      setSelectedCredits([]);
      setOpenBulkMenu(false);
      setIsBulkSelectMode(false);
    } catch (err) {
      console.error("Failed to unarchive selected credits", err);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') return image;
    if (image.url) return image.url;
    return null;
  };

  return (
   <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 border-b-4 border-green-600 pb-3">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-2">
          <MdCheckCircle className="text-green-600 text-4xl" />
          <span>Carbon Credit Management</span>
        </h2>
        <button
          onClick={onAdd}
          className="w-full sm:w-auto bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-1"
        >
          <MdAddCircle className="text-xl" />
          <span>Add Credit</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center space-x-2">
          <FaFilter className="text-green-600" />
          <span>Filter & Bulk Actions</span>
        </h3>
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
            <input
              type="text"
              name="project"
              placeholder="Search by Project..."
              value={filters.project}
              onChange={handleFilterChange}
              className="p-3 border-2 border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm shadow-sm"
            />
            <input
              type="text"
              name="country"
              placeholder="Search by Country..."
              value={filters.country}
              onChange={handleFilterChange}
              className="p-3 border-2 border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm shadow-sm"
            />
            <input
              type="number"
              name="price"
              placeholder="Max Price (₹)"
              value={filters.price}
              onChange={handleFilterChange}
              className="p-3 border-2 border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm shadow-sm"
            />
           <select
  name="type"
  value={filters.type}
  onChange={handleFilterChange}
  className="p-3 border-2 border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm shadow-sm bg-white"
>
  <option value="">All Types</option>
  {projectTypes.map((type) => (
    <option key={type} value={type}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </option>
  ))}
</select>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="p-3 border-2 border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm shadow-sm bg-white"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>

<div className="relative w-full">
              <button
                onClick={() => setOpenBulkMenu(!openBulkMenu)}
                className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl shadow-sm hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <FaEllipsisV className="text-lg" />
                <span>Bulk Actions</span>
              </button>

              {openBulkMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-20 origin-top-right animate-scale-up-tr">
                  <button
                    onClick={handleBulkSelectAll}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors flex items-center space-x-2 rounded-t-xl"
                  >
                    <MdCheckCircle className="text-lg" />
                    <span>
                      {selectedCredits.length === filteredCredits.length
                        ? "Deselect All"
                        : "Select All"}
                    </span>
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={handleBulkActivateAll}
                    className="w-full text-left px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors flex items-center space-x-2"
                  >
                    <MdCheckCircle className="text-lg" />
                    <span>Bulk Activate</span>
                  </button>
                  <button
                    onClick={handleBulkDeactivateAll}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <MdCancel className="text-lg" />
                    <span>Bulk Deactivate</span>
                  </button>
                  <button
                    onClick={handleBulkArchiveAll}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <MdArchive className="text-lg" />
                    <span>Bulk Archive</span>
                  </button>
                  <button
                    onClick={handleBulkUnarchiveAll}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 rounded-b-xl"
                  >
                    <MdUnarchive className="text-lg" />
                    <span>Bulk Unarchive</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white font-semibold py-3 px-5 rounded-xl shadow-md hover:bg-green-700 transition-all duration-300 text-sm w-full sm:w-auto transform hover:scale-105"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-red-600 text-white font-semibold py-3 px-5 rounded-xl shadow-md hover:bg-red-700 transition-all duration-300 text-sm w-full sm:w-auto transform hover:scale-105"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {filteredCredits.length > 0 ? (
          filteredCredits.map((credit) => (
            <div
              key={credit._id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-4 sm:px-6 py-5 bg-white rounded-2xl shadow-xl border border-gray-200 transition-transform duration-300 hover:shadow-2xl hover:border-green-300"
            >
              {isBulkSelectMode && (
                <input
                  type="checkbox"
                  checked={selectedCredits.includes(credit._id)}
                  onChange={() => handleCheckboxChange(credit._id)}
                  className="mr-5 w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded-md focus:ring-green-500 cursor-pointer"
                />
              )}
              <div
                onClick={() => handleViewDetails(credit)}
                className="cursor-pointer flex-1 min-w-0"
              >
               <p className="font-bold text-lg sm:text-xl text-gray-800 break-words">
                  {credit.name}
                </p>
                <p className="text-xs text-gray-400">
  Cert: {credit.certificateId}
</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs sm:text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <FaMoneyBillWave className="text-green-500" />
                    <span>₹{credit.pricePerTon} / ton</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaTag className="text-blue-500" />
                    <span>{credit.projectType || "N/A"}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaGlobe className="text-indigo-500" />
                    <span>{credit.country}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Remaining:{" "}
                  <span className="font-semibold">{credit.remainingTons || credit.tons} tons</span>
                </p>
                <span
                  className={`inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-bold shadow-sm ${
                    credit.isArchived
                      ? "bg-gray-200 text-gray-800"
                      : credit.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {credit.isArchived
                    ? "ARCHIVED"
                    : credit.isActive
                    ? "ACTIVE"
                    : "INACTIVE"}
                </span>
              </div>
              <div className="relative flex-shrink-0">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === credit._id ? null : credit._id)
                  }
                  className="text-gray-500 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FaEllipsisV className="text-lg" />
                </button>
                {openMenuId === credit._id && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-2xl z-10 origin-top-right animate-scale-up-tr">
                    <button
                      onClick={() => handleViewDetails(credit)}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 rounded-t-xl transition-colors flex items-center space-x-2"
                    >
                      <span className="text-lg">👁️</span>
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleUpdate(credit)}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors flex items-center space-x-2"
                    >
                      <MdEdit className="text-lg text-blue-500" />
                      <span>Update Credit</span>
                    </button>
                    <button
                      onClick={() =>
                        handleToggleActive(credit._id, credit.isActive)
                      }
                      className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center space-x-2 ${
                        credit.isActive
                          ? "text-red-600 hover:bg-red-50"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {credit.isActive ? (
                        <MdCancel className="text-lg" />
                      ) : (
                        <MdCheckCircle className="text-lg" />
                      )}
                      <span>{credit.isActive ? "Deactivate" : "Activate"}</span>
                    </button>
                    {credit.isArchived ? (
                      <button
                        onClick={() => handleUnarchive(credit._id)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <MdUnarchive className="text-lg text-gray-600" />
                        <span>Unarchive</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleArchive(credit._id)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <MdArchive className="text-lg text-gray-600" />
                        <span>Archive</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(credit._id)}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition-colors flex items-center space-x-2"
                    >
                      <MdDelete className="text-lg" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-20 bg-white rounded-xl shadow-lg border border-gray-200">
            <p className="text-xl font-semibold">
              No carbon credits found matching the criteria.
            </p>
            <p className="mt-2 text-sm">Adjust your filters or add a new credit.</p>
          </div>
        )}
      </div>

      {selectedCredit && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10 pb-10">
          <div className="relative p-4 sm:p-8 w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto transform transition-all duration-300">
            <button
              onClick={() => setSelectedCredit(null)}
              className="absolute top-5 right-5 text-gray-500 hover:text-red-600 text-2xl p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MdClose />
            </button>
            <div className="flex flex-col items-center mb-8 border-b pb-4">
              {getImageUrl(selectedCredit.image) ? (
                <img
                  src={getImageUrl(selectedCredit.image)}
                  alt={selectedCredit.name}
                  className="w-full max-w-lg h-40 sm:h-64 object-cover rounded-xl shadow-lg mb-6 border-4 border-green-200"
                />
              ) : (
                <div className="w-full max-w-lg h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-lg mb-6 border-4 border-gray-300">
                  No Project Image Available
                </div>
              )}
              <h3 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
                {selectedCredit.title}
              </h3>
              <p className="text-xl text-green-700 font-semibold text-center">
                {selectedCredit.name}
              </p>
              <span
                className={`inline-flex items-center px-3 py-1 mt-3 rounded-full text-sm font-bold shadow-md ${
                  selectedCredit.isArchived
                    ? "bg-gray-300 text-gray-800"
                    : selectedCredit.isActive
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {selectedCredit.isArchived
                  ? "ARCHIVED"
                  : selectedCredit.isActive
                  ? "ACTIVE"
                  : "INACTIVE"}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="border-2 border-green-300 rounded-xl p-5 bg-green-50 shadow-inner">
                <h4 className="font-bold text-xl text-green-800 mb-4 border-b border-green-300 pb-3">
                  Project Overview
                </h4>
                <div className="space-y-3 text-base text-gray-700">
                  <div>
                    <p className="font-bold text-green-700 mb-1">Description:</p>
                    <p className="pl-3 border-l-2 border-green-500 italic">
                      {selectedCredit.info || "N/A"}
                    </p>
                  </div>
                  <DetailItem
                    label="Project Type"
                    value={selectedCredit.projectType}
                  />
                  <DetailItem
                    label="Vintage Year"
                    value={selectedCredit.vintageYear}
                  />
                  <DetailItem
                    label="Project Developer"
                    value={selectedCredit.projectDeveloper}
                  />
                  <DetailItem
                    label="Verified By"
                    value={selectedCredit.verifiedBy}
                  />
                  <div>
                    <span className="font-bold text-green-700">
                      Registry Link:
                    </span>
                    {selectedCredit.registryLink ? (
                      <a
                        href={selectedCredit.registryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-2 font-medium"
                      >
                        View Registry 🔗
                      </a>
                    ) : (
                      <span className="ml-2">N/A</span>
                    )}
                  </div>
                </div>
              </div>
<div className="border-2 border-blue-300 rounded-xl p-5 bg-blue-50 shadow-inner mb-8">
  <h4 className="font-bold text-xl text-blue-800 mb-4 border-b border-blue-300 pb-3">
    🧾 Certificate Details
  </h4>

  <div className="space-y-3 text-base text-gray-700">

    <DetailItem
      label="Certificate ID"
      value={selectedCredit.certificateId}
    />

    <div>
      <span className="font-bold text-blue-700">Verification Link:</span>
      <a
        href={`/certificate/${selectedCredit.certificateId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline ml-2"
      >
        Verify Certificate 🔗
      </a>
    </div>

    <DetailItem
      label="Registry Serial Numbers"
      value={selectedCredit.registrySerialNumbers}
    />

    <DetailItem
      label="Retirement Status"
      value={selectedCredit.retirementStatus}
    />

    <DetailItem
      label="Retirement Date"
      value={
        selectedCredit.retirementDate
          ? new Date(selectedCredit.retirementDate).toLocaleDateString()
          : "Not Retired"
      }
    />
  </div>
</div>
              <div className="border-2 border-green-300 rounded-xl p-5 bg-green-50 shadow-inner">
                <h4 className="font-bold text-xl text-green-800 mb-4 border-b border-green-300 pb-3">
                  Credit & Financial Details
                </h4>
                <div className="space-y-3 text-base text-gray-700">
                  <DetailItem
                    label="Total Tons"
                    value={`${selectedCredit.tons || "0"} tons`}
                  />
                  <DetailItem
                    label="Remaining Tons"
                    value={`${selectedCredit.remainingTons || "0"} tons`}
                  />
                  <DetailItem
                    label="Price per Ton"
                    value={`₹${selectedCredit.pricePerTon || "0.00"}`}
                  />
                  <DetailItem
                    label="Retired"
                    value={selectedCredit.retired ? "Yes" : "No"}
                  />
                  <DetailItem
                    label="Status"
                    value={
                      selectedCredit.isArchived
                        ? "Archived"
                        : selectedCredit.isActive
                        ? "Active"
                        : "Inactive"
                    }
                  />
                </div>
              </div>
            </div>

            <div className="border-2 border-green-300 rounded-xl p-5 bg-green-50 shadow-inner mb-8">
              <h4 className="font-bold text-xl text-green-800 mb-4 border-b border-green-300 pb-3">
                Location & Impact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base text-gray-700">
                <DetailItem
                  label="Country"
                  value={selectedCredit.country}
                />
                <DetailItem
                  label="State"
                  value={selectedCredit.state}
                />
                <DetailItem
                  label="City"
                  value={selectedCredit.city}
                />
                <div className="col-span-1 md:col-span-3">
                  <p className="font-bold text-green-700 mb-1">
                    SDG Alignment:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    {selectedCredit.sdgs && selectedCredit.sdgs.length > 0 ? (
                      selectedCredit.sdgs.map((sdg) => (
                        <li key={sdg} className="text-sm">
                          {sdg}
                        </li>
                      ))
                    ) : (
                      <li>N/A</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {selectedCredit.additionalNotes && (
              <div className="border-2 border-gray-300 rounded-xl p-5 bg-gray-50 shadow-inner">
                <h4 className="font-bold text-xl text-gray-700 mb-4 border-b border-gray-300 pb-3">
                  Additional Notes
                </h4>
                <p className="text-base text-gray-700 italic">
                  {selectedCredit.additionalNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value }) => (
<div className="flex flex-col sm:flex-row sm:justify-between gap-1">
    <span className="font-bold text-green-700">{label}:</span>
    <span className="ml-4">{value || "N/A"}</span>
  </div>
);

export default AdminManageCarbonCredits;