import React, { useState } from "react";
import StatsOverview from "../components/Admin/StatsOverview";
import IncomeChart from "../components/Admin/IncomeChart";
import LiveUserControl from "../components/Admin/LiveUserControl";
import CarbonInventory from "../components/Admin/CarbonInventory";
import AdminControls from "../components/Admin/AdminControls";
import AdminAddCarbonCredit from "../components/Admin/AdminAddCarbonCredit"; 
import AdminManageCarbonCredits from "../components/Admin/AdminManageCarbonCredits";
import AdminUpdateCarbonCredit from "../components/Admin/AdminUpdateCarbonCredit"; 
import AdminUserData from "../components/Admin/AdminUserData";
import AdminFAQManager from "../components/Admin/AdminFAQManager";
import AdminManagePricing from "../components/Admin/AdminManagePricing";
import AdminIndividualPricing from "../components/Admin/AdminIndividualPricing";
import AdminSubscriptions from "../components/Admin/AdminSubscriptions";
import AdminTopPurchasers from "../components/Admin/AdminTopPurchasers";

import {
  FaTachometerAlt,
  FaChartBar,
  FaUsers,
  FaLeaf,
  FaCogs,
  FaTags, // Used for Pricing
  FaEdit,
  FaClipboardList,
} from "react-icons/fa";
import AdminUserReports from "../components/Admin/AdminUserReports";

const navItems = [
  { id: "overview", icon: <FaTachometerAlt />, label: "Overview" },
  { id: "income", icon: <FaChartBar />, label: "Income Chart" },
  { id: "users", icon: <FaUsers />, label: "Live Users" },
{ id: "usermanagement", label: "Top Purchasers" },
{ id: "subscriptions", icon: <FaUsers />, label: "Subscriptions" },
  { id: "inventory", icon: <FaLeaf />, label: "Carbon Inventory" },
  { id: "controls", icon: <FaCogs />, label: "Controls" }, 
  { id: "managepricing", icon: <FaTags />, label: "Org Pricing" },
{ id: "individualpricing", icon: <FaTags />, label: "Individual Pricing" },
  { id: "managecredits", icon: <FaEdit />, label: "Manage Credits" },
  { id: "userdata", icon: <FaUsers />, label: "User Data" }, 
  { id: "userreports", icon: <FaClipboardList />, label: "User Reports" },
  { id: "faqmanager", icon: <FaClipboardList />, label: "FAQ Manager" },
];


const AdminDashboard = () => {
  const [selectedCreditId, setSelectedCreditId] = useState(null); 
  const [selected, setSelected] = useState("overview"); 
const [sidebarOpen, setSidebarOpen] = useState(false);

const renderContent = () => {
  if (selectedCreditId) {
    return <AdminUpdateCarbonCredit id={selectedCreditId} goBack={() => setSelectedCreditId(null)} />;
  }
    switch (selected) {
      case "overview":
        return <StatsOverview />;
      case "income":
        return <IncomeChart />;
      case "users":
        return <LiveUserControl />;
case "usermanagement":
  return <AdminTopPurchasers />;
case "subscriptions":
  return <AdminSubscriptions />;
      case "inventory":
        return <CarbonInventory />;
      case "controls":
        return <AdminControls />;
      case "managepricing":
        return <AdminManagePricing />;
case "individualpricing":
  return <AdminIndividualPricing />;
      case "managecredits":
  return (
    <AdminManageCarbonCredits 
      onEdit={(id) => setSelectedCreditId(id)} 
      onAdd={() => setSelected("addcredit")} 
    />
  );
      case "addcredit":
        return <AdminAddCarbonCredit />;
      case "userdata":
  return <AdminUserData />;
      case "userreports": 
        return <AdminUserReports />;
      case "faqmanager":
  return <AdminFAQManager />;
      default:
        return <StatsOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#06120c] text-white">
<aside
  className={`fixed top-0 left-0 h-screen w-64 bg-[#07150e]/95 backdrop-blur-xl text-white p-6 overflow-y-auto z-50 transform transition-transform duration-300 border-r border-emerald-500/20
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
>

  {/* 🔥 CLOSE BUTTON (ONLY MOBILE) */}
  <button
    className="md:hidden mb-6 text-white"
    onClick={() => setSidebarOpen(false)}
  >
    Close
  </button>

  <div className="text-2xl font-bold mb-10 text-emerald-400">
    AerthX Admin
  </div>

  <nav className="space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left hover:bg-emerald-700 ${
                selected === item.id ? "bg-emerald-600 shadow-lg shadow-emerald-900/30" : ""
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

<main className="flex-1 p-4 sm:p-6 md:p-10 md:ml-64 bg-gradient-to-br from-[#06120c] via-[#0a1b12] to-[#06120c]">
        <header className="mb-6 border-b border-emerald-500/20 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center">

  {/* 🔥 MOBILE MENU BUTTON */}
  <button
    className="md:hidden mb-4 px-4 py-2 bg-emerald-600 text-white rounded"
    onClick={() => setSidebarOpen(true)}
  >
    Menu
  </button>

  <h1 className="text-3xl font-bold text-white">
    {navItems.find((item) => item.id === selected)?.label || "Dashboard"}
  </h1>

  <span className="text-sm text-emerald-100/60 mt-2 md:mt-0">
    Last updated: {new Date().toLocaleString()}
  </span>

</header>

        <div className="bg-white/95 text-gray-900 rounded-2xl shadow-2xl shadow-black/30 p-4 sm:p-6 border border-emerald-500/10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;