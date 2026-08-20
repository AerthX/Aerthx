import React from "react";
import {
  FaLock,
  FaCreditCard,
  FaHistory,
  FaWallet,
  FaFileContract,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const tabData = [
  { name: "Security", icon: <FaLock /> },
  { name: "Subscription", icon: <FaCreditCard /> },
  { name: "Billing History", icon: <FaHistory /> },
  { name: "Payment Methods", icon: <FaWallet /> },
  { name: "Terms & Conditions", icon: <FaFileContract /> },
];

const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  return (
    <aside className={`transition-all duration-300 ${collapsed ? "w-20" : "w-64"} bg-white shadow-lg p-4 border-r border-gray-200`}>
      <div className="flex justify-between items-center mb-6">
        {!collapsed && <h2 className="text-xl font-bold text-green-800">Settings</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-green-600"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <ul className="space-y-2">
        {tabData.map((tab) => (
          <li key={tab.name}>
            <button
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition font-medium text-left text-sm ${
                activeTab === tab.name
                  ? "bg-green-100 text-green-800"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {tab.icon}
              {!collapsed && <span>{tab.name}</span>}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
