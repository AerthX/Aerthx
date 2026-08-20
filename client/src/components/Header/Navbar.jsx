import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../shared-redux/src/slices/authSlice";
import { fetchProfile } from "../../shared-redux/src/slices/profileSlice";
import ProfileDropdown from "./ProfileDropdown";
import DefaultAvatar from "./DefaultAvatar";
import { FaBell } from "react-icons/fa"; 

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false); 
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const profile = useSelector((state) => state.profile.data);
const token = localStorage.getItem("accessToken");
  const userType = useSelector((state) => state.auth.userType);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null); 
  const isAuthenticated = !!user && !!token;

  function decodeJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Failed to decode JWT:", e);
      return null;
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) return;

    try {
      const decoded = decodeJwt(refreshToken);

      if (!decoded) throw new Error("Invalid refresh token");

      // 🔥 ONLY logout if REFRESH TOKEN expired
      if (decoded.exp * 1000 < Date.now()) {
        // 🔥 REMOVE TOKEN FIRST (STOP LOOP)
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");

        dispatch(logout());

        // 🔥 NAVIGATE ONLY IF NOT ALREADY ON "/"
        if (window.location.pathname !== "/") {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");

      dispatch(logout());

      if (window.location.pathname !== "/") {
        navigate("/");
      }
    }
  }, [dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleNotifications = async () => {
    const newState = !notificationsOpen;
    setNotificationsOpen(newState);
    setDropdownOpen(false);

    if (newState && unreadCount > 0) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/user/notifications/mark-read`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userType }),
        });

        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);
        setUnreadCount(0);
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/user/notifications/mark-one/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const updated = notifications.map(n =>
        n._id === id ? { ...n, read: true } : n
      );
      setNotifications(updated);

      setUnreadCount(prev => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token || !userType) return;

      try {
        const endpoint =
          userType?.toLowerCase() === "organization"
            ? "organization"
            : "individual";

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/user/notifications/${endpoint}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount((data.notifications || []).filter(n => !n.read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [token, userType]);

  return (
  <nav className="absolute top-0 left-0 w-full z-50 bg-transparent border-none text-white">
  <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16 sm:h-20">
          <div
            className="flex items-center cursor-pointer flex-shrink-0"
            onClick={() => navigate("/")}
          >
  <img
  src="/logo_aerthx.png"
  alt="AerthX Logo"
  className="h-20 sm:h-24 md:h-28 w-auto object-contain -translate-y-1 sm:translate-y-0 hover:scale-105 transition-all duration-300"
/>
          </div>
          {/* HAMBURGER BUTTON */}
          <button
            className="lg:hidden p-2 text-slate-100 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>

          {/* NAVIGATION MENU */}
          <ul
            className={`
              ${menuOpen ? "flex" : "hidden"}
              lg:flex
              flex-col lg:flex-row
              absolute lg:static
              top-20 lg:top-0
              left-0
              w-full lg:w-auto
              bg-slate-950/95 lg:bg-transparent
              shadow-lg lg:shadow-none
              border-t border-slate-800/70 lg:border-0
              p-3 sm:p-4 lg:p-0
              gap-1 lg:gap-1
              text-sm font-medium text-slate-100
              z-40
              lg:items-center
              rounded-b-2xl lg:rounded-none
              max-h-[calc(100vh-80px)] lg:max-h-none
              overflow-y-auto lg:overflow-y-visible
            `}
          >
            {/* MOBILE AUTH BUTTONS */}
            {isAuthenticated && (
              <div className="flex lg:hidden items-center justify-center gap-2 sm:gap-3 py-3 border-t border-slate-800/70">
                
                {/* MOBILE NOTIFICATION */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={toggleNotifications}
                    className="relative p-2 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200"
                  >
                    <FaBell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="fixed top-32 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-slate-950/95 rounded-2xl shadow-2xl ring-1 ring-slate-700 z-[9999] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
                        <h3 className="text-sm font-semibold text-slate-100">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs font-semibold bg-red-600 text-white px-2 py-1 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>

                      <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-800">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification._id}
                              onClick={() => handleNotificationClick(notification._id)}
                              className={`px-4 py-3 text-sm cursor-pointer transition-colors duration-200 ${
                                !notification.read ? "bg-emerald-500/10 hover:bg-emerald-500/15" : "bg-slate-900/90 hover:bg-slate-800/90"
                              }`}
                            >
                              <p className="font-medium text-slate-100">{notification.title}</p>
                              <p className="text-slate-300 text-xs mt-1">{notification.message}</p>
                              <p className="text-[10px] text-gray-400 mt-2">{new Date(notification.timestamp).toLocaleString()}</p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-slate-400">
                            <p className="text-sm">No notifications</p>
                          </div>
                        )}
                      </div>

                      <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/90 text-center">
                        <Link to="/notification" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200 transition-colors">
                          View All →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* MOBILE PROFILE */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                      setNotificationsOpen(false);
                    }}
                    className="rounded-full hover:ring-2 hover:ring-[#2E8B57]/30 transition-all duration-200"
                  >
                    <DefaultAvatar
                      name={user.fullName || user.orgName || "User"}
                      size={36}
                      avatarUrl={
                        profile?.user?.avatarUrl ||
                        profile?.org?.avatarUrl ||
                        user?.avatarUrl ||
                        null
                      }
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-950/95 rounded-xl shadow-lg ring-1 ring-slate-700 overflow-hidden z-20">
                      <ProfileDropdown
                        onClose={() => setDropdownOpen(false)}
                        onLogout={handleLogout}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* NAV ITEMS */}
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? "text-emerald-300 font-semibold" : "text-slate-200 hover:text-white hover:bg-slate-900/70"}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/MarketplaceHero"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? "text-emerald-300 font-semibold" : "text-slate-200 hover:text-white hover:bg-slate-900/70"}`
                }
              >
                Marketplace
              </NavLink>
            </li>

            <li className="relative group">
              <NavLink
                to="/solutions"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg inline-flex items-center gap-2 transition-all duration-200 ${isActive ? "text-emerald-300 font-semibold" : "text-slate-200 hover:text-white hover:bg-slate-900/70"}`
                }
              >
                Solutions
                <span className="text-xs">▾</span>
              </NavLink>
              <div className="absolute left-0 top-full mt-0 bg-slate-950/95 rounded-xl shadow-lg border border-slate-800 px-3 py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-1 group-hover:translate-y-0 transition-all duration-200 min-w-[160px]">
                <Link to="/solutions/business" className="block px-3 py-2 rounded-lg text-sm text-slate-100 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors">
                  For Businesses
                </Link>
                <Link to="/solutions/individuals" className="block px-3 py-2 rounded-lg text-sm text-slate-100 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors">
                  For Individuals
                </Link>
              </div>
            </li>
            <li>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? "text-emerald-300 font-semibold" : "text-slate-200 hover:text-white hover:bg-slate-900/70"}`
                }
              >
                Services
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/pricing"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? "text-emerald-300 font-semibold" : "text-slate-200 hover:text-white hover:bg-slate-900/70"}`
                }
              >
                Pricing
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/resources"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? "text-emerald-300 font-semibold" : "text-slate-200 hover:text-white hover:bg-slate-900/70"}`
                }
              >
                Resources
              </NavLink>
            </li>

            {/* AUTHENTICATED ACTIONS */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-2">
                <li className="relative" ref={notificationsRef}>
                  <button
                    onClick={toggleNotifications}
                    className="relative p-2 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200"
                  >
                    <FaBell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full shadow-sm">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {notificationsOpen && (
                    <div className="fixed lg:absolute top-20 lg:top-full right-0 lg:-right-8 left-0 lg:left-auto mx-4 lg:mx-0 lg:mt-3 w-auto lg:w-80 bg-slate-950/95 rounded-2xl shadow-2xl ring-1 ring-slate-700 z-[9999] overflow-hidden">

                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
                        <h3 className="text-sm font-semibold text-slate-100">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs font-semibold bg-red-600 text-white px-2 py-1 rounded-full">{unreadCount}</span>
                        )}
                      </div>

                      <div className="max-h-96 overflow-y-auto divide-y divide-slate-800">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification._id}
                              onClick={() => handleNotificationClick(notification._id)}
                              className={`px-4 py-3 text-sm transition-colors duration-200 cursor-pointer ${!notification.read ? "bg-emerald-500/10 hover:bg-emerald-500/15" : "bg-slate-900/90 hover:bg-slate-800/90"}`}
                            >
                              <p className="font-medium text-slate-100">{notification.title}</p>
                              <p className="text-slate-300 text-xs mt-1 leading-snug truncate">{notification.message}</p>
                              <p className="text-[10px] text-slate-400 mt-2">{new Date(notification.timestamp).toLocaleString()}</p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-slate-400 text-sm">
                            <svg className="w-6 h-6 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            <p className="font-medium">All caught up!</p>
                            <p className="text-xs mt-0.5">No new notifications</p>
                          </div>
                        )}
                      </div>

                      <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/90 text-center">
                        <Link to="/notification" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200 transition-colors">View All →</Link>
                      </div>
                    </div>
                  )}
                </li>
                <li className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                      setNotificationsOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-full focus:outline-none hover:ring-2 hover:ring-[#2E8B57]/30 transition-all duration-200"
                  >
                    <DefaultAvatar
                      name={user.fullName || user.orgName || "User"}
                      size={36}
                      avatarUrl={
                        profile?.user?.avatarUrl || profile?.org?.avatarUrl || user?.avatarUrl || null
                      }
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-950/95 rounded-xl shadow-lg ring-1 ring-slate-700 overflow-hidden z-20">
                      <ProfileDropdown onClose={() => setDropdownOpen(false)} onLogout={handleLogout} />
                    </div>
                  )}
                </li>
              </div>
            ) : (
              <li className="hidden lg:block ml-auto">
                <Link
                  to="#waitlist"
                  onClick={(e) => {
                    const waitlistElement = document.getElementById('waitlist');
                    if (waitlistElement) {
                      e.preventDefault();
                      waitlistElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1A5C38] hover:bg-[#14472C] rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Join Waitlist
                </Link>
              </li>
            )}

            {/* MOBILE CTA BUTTON (UNAUTHENTICATED ONLY) */}
            {!isAuthenticated && (
              <li className="lg:hidden w-full mt-3 pt-3 border-t border-slate-800/70">
                <Link
                  to="#waitlist"
                  onClick={(e) => {
                    const waitlistElement = document.getElementById('waitlist');
                    if (waitlistElement) {
                      e.preventDefault();
                      waitlistElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block w-full px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-white bg-[#1A5C38] hover:bg-[#14472C] rounded-lg transition-colors duration-200"
                >
                  Join Waitlist
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;