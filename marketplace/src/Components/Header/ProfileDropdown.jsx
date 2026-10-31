import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaGlobe,
  FaQuestionCircle,
  FaCreditCard,
  FaCog,
  FaStore,
  FaBell,
  FaUser,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import DefaultAvatar from "./DefaultAvatar";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({ onClose, onLogout }) => {
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.profile.data);
const navigate = useNavigate();

const [subscription, setSubscription] = useState(null);
const [subscriptionLoading, setSubscriptionLoading] = useState(true);
const [pricingPlans, setPricingPlans] = useState({});

const planColors = {
  plan_1: {
    background: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  plan_2: {
    background: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  plan_3: {
    background: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  plan_4: {
    background: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
};

const matchedPlan = Object.entries(pricingPlans).find(
  ([planKey, plan]) => {
    const savedPlan = String(subscription?.plan || "")
      .trim()
      .toLowerCase();

    return (
      savedPlan === planKey.toLowerCase() ||
      savedPlan === String(plan.id || "").trim().toLowerCase() ||
      savedPlan === String(plan.name || "").trim().toLowerCase()
    );
  }
);

const currentPlan = {
  name: matchedPlan?.[1]?.name || subscription?.planName || "Subscription",
  ...(planColors[matchedPlan?.[0]] || {
    background: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-700",
    dot: "bg-gray-500",
  }),
};

const subscriptionStatus = subscription?.status || "none";



useEffect(() => {
  const fetchSubscription = async () => {
    try {
      const userId = user?.id || user?._id;

      if (!userId) {
        setSubscription({ status: "none" });
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/payment/subscription/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          },
        }
      );

      setSubscription(res.data);
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
      setSubscription({ status: "none" });
    } finally {
      setSubscriptionLoading(false);
    }
  };

  fetchSubscription();
}, [user]);

useEffect(() => {
  const fetchPricingPlans = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/pricing`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("accessToken") || ""
            }`,
          },
        }
      );

      setPricingPlans(response.data.plans || {});
    } catch (error) {
      console.error("Failed to fetch pricing plans:", error);
      setPricingPlans({});
    }
  };

  if (user) {
    fetchPricingPlans();
  }
}, [user]);

  if (!user) {
    return null;
  }

  const navItems = [
    {
      label: "Profile",
      to: "/profile",
      icon: <FaUser className="text-gray-400" />,
    },
    {
      label: "MarketplaceHero",
      to: "/MarketplaceHero",
      icon: <FaStore className="text-gray-400" />,
    },
{
  label: user?.orgName ? "Subscription" : "Individual Subscription",
  onClick: () => {
    navigate(
      user?.orgName
        ? "/MarketplaceHero/pricing"
        : "/MarketplaceHero/individual-pricing"
    );
  },
  icon: <FaCreditCard className="text-gray-400" />,
},

    {
      label: "Notification",
      to: "/notification",
      icon: <FaBell className="text-gray-400" />,
    },
    {
      label: "Help & Support",
      to: "/help",
      icon: <FaQuestionCircle className="text-gray-400" />,
    },
    {
      label: "Settings",
      to: "/settings",
      icon: <FaCog className="text-gray-400" />,
    },
  ];

const getAvatarUrl = () => {
  return (
    profile?.user?.avatarUrl ||
    profile?.org?.avatarUrl ||
    user?.avatarUrl ||
    null
  );
};

  return (
    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg z-50 p-6 border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        <DefaultAvatar
          name={user.fullName || user.orgName || "User"}
          size={48}
          avatarUrl={getAvatarUrl()}
        />
        <div>
          <p className="font-semibold text-gray-900 text-lg truncate max-w-[220px]">
            {user.fullName || user.orgName || "User"}
          </p>
          <p className="text-sm text-gray-500 truncate max-w-[220px]">
            {user.email}
          </p>
        </div>
      </div>

      {/* Subscription Card */}
      <div
        className={`relative mb-5 rounded-xl border p-3 ${
          subscriptionStatus === "active"
            ? `${currentPlan.background} ${currentPlan.border}`
            : subscriptionStatus === "expired"
            ? "bg-red-50 border-red-200"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        {subscriptionLoading ? (
          <p className="text-xs text-gray-500">
            Checking subscription...
          </p>
        ) : subscriptionStatus === "active" ? (
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${currentPlan.dot}`} />
                <span className={`text-xs font-semibold ${currentPlan.text}`}>
                  Active Subscription
                </span>
              </div>

              <p className="text-sm font-bold text-gray-900">
                {currentPlan.name} Plan
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Expires:{" "}
                {subscription?.endDate
                  ? new Date(subscription.endDate).toLocaleDateString(
                      "en-IN",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )
                  : "Date unavailable"}
              </p>
            </div>

            <FaCreditCard className={`text-xl ${currentPlan.text}`} />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs font-semibold text-red-600">
                  {subscriptionStatus === "expired"
                    ? "Subscription Expired"
                    : "Inactive Subscription"}
                </span>
              </div>

              <p className="text-sm font-bold text-gray-800">
                No Active Plan
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Choose a plan to continue
              </p>
            </div>

            <button
              onClick={() => {
                navigate(
                  user?.orgName
                    ? "/MarketplaceHero/pricing"
                    : "/MarketplaceHero/individual-pricing"
                );
                onClose();
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 whitespace-nowrap"
            >
              {subscriptionStatus === "expired"
                ? "Renew Plan"
                : "Choose Plan"}
            </button>
          </div>
        )}
      </div>

      <Link
        to="/dashboard"
        className="block w-full py-2 mb-5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition text-center"
        onClick={onClose}
      >
        Switch to Organization Dashboard
      </Link>

      <ul className="text-sm space-y-1 border-b border-gray-200 pb-4 mb-4">
        {navItems.map((item) => (
          <li key={item.label}>
            {item.to ? (
  <Link
    to={item.to}
    onClick={onClose}
    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-50 font-medium text-gray-700 transition"
  >
    {item.icon}
    {item.label}
  </Link>
) : (
  <button
    onClick={() => {
      item.onClick();
      onClose();
    }}
    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-50 font-medium text-gray-700 transition w-full text-left"
  >
    {item.icon}
    {item.label}
  </button>
)}

          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span className="flex items-center gap-1 text-gray-600">
          <FaGlobe className="text-indigo-600" />
          English
        </span>
        <span>₹ INR</span>
      </div>

      <button
        onClick={onLogout}
        className="w-full mt-5 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition"
      >
        Sign out
      </button>
    </div>
  );
};

export default ProfileDropdown;