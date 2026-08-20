import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../shared-redux/src/slices/authSlice"; 
import { fetchProfile } from "../../shared-redux/src/slices/profileSlice";
import DefaultAvatar from "./DefaultAvatar";
import ProfileDropdown from "./ProfileDropdown";

const ProfileOrRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxUser = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(reduxUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!reduxUser) {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");

      if (storedUser && token && userType) {
        setUser(JSON.parse(storedUser));
        dispatch(fetchProfile({ token, userType }));
      }
    } else {
      setUser(reduxUser);
    }
  }, [reduxUser, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const isAuthenticated = !!user;

  return isAuthenticated ? (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2"
      >
        <DefaultAvatar
          name={user.fullName || user.orgName || "User"}
          size={36}
        />
        <span className="text-gray-700 font-semibold hidden sm:inline">
          {user.fullName?.split(" ")[0] || user.orgName}
        </span>
      </button>
      {dropdownOpen && (
        <ProfileDropdown
          onClose={() => setDropdownOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  ) : (
    <Link
      to="/register-choice"
      className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all"
    >
      Register
    </Link>
  );
};

export default ProfileOrRegister;
