import React from "react";
import { Link } from "react-router-dom";
import { FaGlobe, FaQuestionCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import DefaultAvatar from "../components/Header/DefaultAvatar";

const ProfileDropdown = ({ onClose, onLogout }) => {
  const user = useSelector((state) => state.auth.user);
  if (!user) return null;
const profile = useSelector((state) => state.profile.data);
  return (
    <div className="absolute right-0 mt-3 w-[90vw] max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg z-50 p-4 sm:p-5 md:p-6 border border-gray-200">
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <DefaultAvatar
  name={user.fullName || user.orgName || "User"}
  size={40}
  avatarUrl={
    profile?.user?.avatarUrl
      ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${profile.user.avatarUrl}`
      : profile?.org?.avatarUrl
        ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${profile.org.avatarUrl}`
        : user.avatarUrl
          ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${user.avatarUrl}`
          : null
  }
/>
        <div>
          <p className="font-semibold text-gray-900 text-base sm:text-lg truncate max-w-[180px] sm:max-w-[220px]">
            {user.fullName || user.orgName || "User"}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[180px] sm:max-w-[220px]">{user.email}</p>
        </div>
      </div>

   <Link
            to="/profile"
            onClick={onClose}
         className="block px-3 sm:px-4 py-2 rounded-md hover:bg-indigo-50 text-gray-700 text-sm sm:text-base font-medium transition"
          >
  Profile
</Link>

      <ul className="text-sm space-y-3">
         <li>
              <Link
  to="/MarketplaceHero"
            onClick={onClose}
          className="block px-3 sm:px-4 py-2 rounded-md hover:bg-indigo-50 text-gray-700 text-sm sm:text-base font-medium transition"
          >
            MarketplaceHero
          </Link>
        </li>
        <li>
       <a
  href={`${import.meta.env.VITE_MAIN_URL}/pricing`}
  onClick={onClose}
 className="block px-3 sm:px-4 py-2 rounded-md hover:bg-indigo-50 text-gray-700 text-sm sm:text-base font-medium transition"
>
  Subscription
</a>

        </li>
        <li>
           <a
  href="notification" 
           
            onClick={onClose}
            className="block px-3 sm:px-4 py-2 rounded-md hover:bg-indigo-50 text-gray-700 text-sm sm:text-base font-medium transition"
          >
            Notification
            
          </a>
        </li>
        <li>
          <a
 href={`${import.meta.env.VITE_MAIN_URL}/help`}

           
            onClick={onClose}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md hover:bg-indigo-50 text-gray-700 text-sm sm:text-base transition"
          >
            <FaQuestionCircle className="text-indigo-600" />
            Help & Support
          </a>
        </li>
        <li>
 
</li>
        <li>
              <a 
  href={`${import.meta.env.VITE_MAIN_URL}/settings`}
            onClick={onClose}
            className="block px-4 py-2 rounded-md hover:bg-indigo-50 text-gray-700 transition"
          >
            Settings
          </a>
        </li>
      </ul>

      <div className="flex justify-between items-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 border-t border-gray-200 pt-3 sm:pt-4">
        <span className="flex items-center gap-1 text-gray-600">
          <FaGlobe />
          English
        </span>
        <span>₹ INR</span>
      </div>

      <button
        onClick={onLogout}
        className="w-full mt-4 sm:mt-5 py-2 sm:py-2.5 bg-red-600 text-white rounded-md text-sm sm:text-base font-semibold hover:bg-red-700 transition"
      >
       Sign out
      </button>
    </div>
  );
};

export default ProfileDropdown;
