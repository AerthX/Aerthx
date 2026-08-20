import React from "react";
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