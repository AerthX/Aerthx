import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaMoneyBill,
  FaChartLine,
  FaPowerOff,
  FaLeaf,
  FaFileInvoice,
  FaCubes
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

const formatINR = (num) => {
  if (!num) return "₹0";
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
};

const StatsOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${API}/admin/overview`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  const cards = [
    {
      icon: <FaUsers />,
      label: "Total Users",
      value: stats.users,
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <FaMoneyBill />,
      label: "Total Revenue",
      value: formatINR(stats.revenue),
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <FaLeaf />,
      label: "CO₂ Offset",
      value: `${stats.tons} tons`,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: <FaChartLine />,
      label: "Subscriptions",
      value: stats.subs,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: <FaPowerOff />,
      label: "Suspended Users",
      value: stats.suspended,
      color: "bg-red-100 text-red-600"
    },
    {
      icon: <FaFileInvoice />,
      label: "Transactions",
      value: stats.transactions,
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <FaCubes />,
      label: "Credits Sold",
      value: stats.credits,
      color: "bg-indigo-100 text-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6 space-y-6 sm:space-y-8">

      {/* 🔥 HEADER */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xltext-3xl font-bold">📊 Admin Dashboard</h1>
          <p className="text-sm opacity-90 mt-1">
            Real-time analytics of your platform
          </p>
        </div>

        <div className="text-xs sm:text-sm opacity-80">
          {new Date().toLocaleString()}
        </div>
      </div>

      {/* 🔥 KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">

        {cards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-3 sm:p-5 hover:shadow-xl transition-all duration-300"
          >

            {/* ICON */}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg mb-4 ${stat.color}`}>
              <span className="text-xl">{stat.icon}</span>
            </div>

            {/* CONTENT */}
            <p className="text-gray-500 text-xs sm:text-sm">{stat.label}</p>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mt-1">
              {stat.value}
            </h2>

          </div>
        ))}

      </div>

      {/* 🔥 INSIGHTS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">💰 Revenue Insight</p>
          <h3 className="text-lg sm:text-xl font-bold mt-2 text-green-600">
            {formatINR(stats.revenue)}
          </h3>
          <p className="text-gray-400 text-xs mt-2">
            Total earnings from carbon credits & subscriptions
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">🌱 Environmental Impact</p>
          <h3 className="text-lg sm:text-xl font-bold mt-2 text-emerald-600">
            {stats.tons} Tons CO₂
          </h3>
          <p className="text-gray-400 text-xs mt-2">
            Total carbon offset achieved
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">⚡ Activity</p>
          <h3 className="text-lg sm:text-xl font-bold mt-2 text-indigo-600">
            {stats.transactions} Transactions
          </h3>
          <p className="text-gray-400 text-xs mt-2">
            Platform activity overview
          </p>
        </div>

      </div>

    </div>
  );
};

export default StatsOverview;