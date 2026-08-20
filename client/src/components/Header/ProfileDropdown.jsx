import React from "react";
import { Link } from "react-router-dom";
import {
  FaGlobe,
  FaQuestionCircle,
  FaCreditCard,
  FaCog,
  FaBell,
  FaUser,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import DefaultAvatar from "./DefaultAvatar";

 
const ProfileDropdown = ({ onClose, onLogout }) => {
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.profile.data);
 const userType = useSelector((state) => state.auth.userType);

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
      label: "About Us",
      to: "/about",
      icon: <FaGlobe className="text-gray-400" />,
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
    <div className="fixed lg:absolute top-[190px] lg:top-auto left-1/2 lg:left-auto right-auto lg:right-0 -translate-x-1/2 lg:translate-x-0 mt-0 lg:mt-3 w-[95vw] sm:w-[92vw] lg:w-80 max-w-md max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-[9999] p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <DefaultAvatar
          name={user.fullName || user.orgName || "User"}
          size={40}
          avatarUrl={getAvatarUrl()}
        />
        <div>
          <p className="font-semibold text-gray-900 text-lg truncate max-w-[220px]">
            {user.fullName || user.orgName || "User"}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[220px]">
            {user.email}
          </p>
        </div>
      </div>

    

      <ul className="text-xs sm:text-sm space-y-1 border-b border-gray-200 pb-4 mb-4">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-indigo-50 font-medium text-gray-700 transition"
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
        <span className="flex items-center gap-1 text-gray-600">
          <FaGlobe className="text-indigo-600" />
          English
        </span>
        <span>₹ INR</span>
      </div>

      <button
        onClick={onLogout}
        className="w-full mt-5 py-2 bg-red-600 text-white rounded-md text-xs sm:text-sm font-semibold hover:bg-red-700 transition"
      >
        Sign out
      </button>
    </div>
  );
};

export default ProfileDropdown;