import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCertificate,
  FaExchangeAlt,
  FaStore,
  FaUsers,
  FaChartBar,
  FaKey,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userType } = useSelector((state) => state.auth);
  const [featureMap, setFeatureMap] = useState({});
const [mobileOpen, setMobileOpen] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [planFeatures, setPlanFeatures] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔥 Redirect logic
useEffect(() => {
  if (!userType) return;

  if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
    navigate("/dashboard/overview", { replace: true });
  }
}, [location.pathname, navigate, userType]);

  // 🔥 Fetch subscription + features
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        if (!user?.id) return;

        // 1. Get subscription
        const subRes = await fetch(
          `${import.meta.env.VITE_API_URL}/payment/subscription/${user.id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` } }
        );
        const subData = await subRes.json();

        if (subData?.status === "active") {
          setSubscription(subData);

          // 2. Get pricing config
          const pricingRes = await fetch(
            `${import.meta.env.VITE_API_URL}/admin/pricing`
          );
         const pricingData = await pricingRes.json();

const currentPlan = pricingData.plans[subData.plan];
setPlanFeatures(currentPlan?.features || {});

// 🔥 BUILD MAP
const map = {};
pricingData.featureGroups.forEach((group) => {
  group.features.forEach((f) => {
    map[f.label.toLowerCase().replace(/\s/g, "")] = f.key;
  });
});
setFeatureMap(map);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (!userType || loading) return <div>Loading...</div>;

  // 🔑 Feature checker
const hasFeature = (label) => {
  if (!subscription) return false;

  const lookup = label.toLowerCase().replace(/\s/g, "");
  const key = featureMap[lookup];

  return planFeatures[key] === true;
};
  // ✅ ALWAYS VISIBLE
  const baseNav = [
    { label: "Overview", to: "/dashboard/overview", icon: <FaHome /> },
    { label: "Certificates", to: "/dashboard/certificates", icon: <FaCertificate /> },
    { label: "Transactions", to: "/dashboard/transactions", icon: <FaExchangeAlt /> },
    { label: "MarketplaceHero", to: "/dashboard/MarketplaceHero", icon: <FaStore /> },
  ];

  // 🔥 CONDITIONAL FEATURES
 const premiumNav = [
  {
    label: "Team",
    to: "/dashboard/team",
    icon: <FaUsers />,
    feature: "Team",
  },
  {
    label: "ESG Reports",
    to: "/dashboard/esg-reports",
    icon: <FaChartBar />,
    feature: "ESG Reports",
  },
  {
    label: "API Access",
    to: "/dashboard/api-access",
    icon: <FaKey />,
    feature: "APIAccess",
  },
];
  // 🔥 FINAL NAV
  const navItems = [
    ...baseNav,
    ...premiumNav.filter((item) => hasFeature(item.feature)),
  ];

  return (
  <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">

    {/* 🔴 MOBILE TOP BAR */}
    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow">
      <h1 className="text-lg font-bold text-green-700">AerthX</h1>
      <button
        onClick={() => setMobileOpen((prev) => !prev)}
        className="text-gray-600 text-xl"
      >
        ☰
      </button>
    </div>

    {/* 🔴 SIDEBAR */}
    <aside
      className={`
  fixed md:sticky top-0 left-0
  h-screen md:h-screen
  z-50
  bg-white shadow-md p-5
  transition-transform duration-300
  w-64
  ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0
`}
    >
      {/* CLOSE BUTTON MOBILE */}
      <div className="md:hidden flex justify-end mb-4">
        <button onClick={() => setMobileOpen(false)}>✕</button>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-600"
      >
        ← Back to Home
      </button>

      <h1 className="text-xl font-bold text-green-700 mb-6">AerthX</h1>

      {/* PLAN */}
      {subscription?.status === "active" && (
        <div className="mb-6 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
          <div className="flex justify-between text-xs">
            <span>Current Plan</span>
            <span className="bg-white/20 px-2 py-1 rounded">Active</span>
          </div>

          <div className="mt-2 text-lg font-bold">
            {subscription.plan.toUpperCase()}
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm sm:text-base font-medium ${
              location.pathname === item.to
                ? "bg-green-100 text-green-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>

    {/* 🔴 OVERLAY */}
    {mobileOpen && (
      <div
        className="fixed inset-0 bg-black/30 md:hidden"
        onClick={() => setMobileOpen(false)}
      />
    )}

    {/* 🔴 MAIN CONTENT */}
    <main className="flex-1 w-full min-h-screen">
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <Outlet />
      </div>
    </main>
  </div>
);
};
export default DashboardLayout;