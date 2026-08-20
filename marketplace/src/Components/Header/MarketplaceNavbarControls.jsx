  import React, { useEffect, useState, useRef } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { useSelector, useDispatch } from "react-redux";
  import { logout } from "../../shared-redux/src/slices/authSlice";
  import { fetchProfile } from "../../shared-redux/src/slices/profileSlice";
  import DefaultAvatar from "../Header/DefaultAvatar";
  import ProfileDropdown from "../Header/ProfileDropdown";
  import { CiSearch } from "react-icons/ci";
  import { FaBell } from "react-icons/fa";
  import aerthxlogo from "../../assets/aerthxLogo.png";
  import SubscriptionStatus from "../SubscriptionStatus";

  const MarketplaceHeroNavbarControls = ({ onSearch }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = !!user;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const profile = useSelector((state) => state.profile.data);
  const token = localStorage.getItem("accessToken");
    const userType = useSelector((state) => state.auth.userType);
    const dropdownRef = useRef(null);
    const notificationsRef = useRef(null);
    const [query, setQuery] = useState("");

    const handleSearch = () => {
      onSearch(query);
    };

    const decodeJwt = (token) => {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
      }
    };

    useEffect(() => {
  const refreshToken = localStorage.getItem("refreshToken");

 if (!refreshToken) return;

  try {
    const decoded = decodeJwt(refreshToken);

    if (!decoded) throw new Error("Invalid refresh token");

    // 🔥 ONLY logout if refresh token expired
if (decoded.exp * 1000 < Date.now()) {

  // 🔥 REMOVE TOKEN FIRST (STOP LOOP)
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessToken");

  dispatch(logout());

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
      if (token && userType) {
        dispatch(fetchProfile({ token, userType }));
      }
    }, [token, userType, dispatch]);

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
      <nav className="bg-[#07150e]/95 backdrop-blur-xl shadow-lg w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:px-8 fixed top-0 z-50 border-b border-emerald-500/20">
        <div className="flex justify-between items-center gap-2 sm:gap-4 min-h-[56px]">
          <img src={aerthxlogo} alt="AerthX Logo" className="h-12 sm:h-14 lg:h-16 ml-0 sm:ml-2 object-contain shrink-0" />


          <div className="relative flex items-center gap-2 sm:gap-4 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-4">
        <SubscriptionStatus
  userId={user?.id}
  onSubscribe={() =>
    navigate(
      userType === "organization"
        ? "/MarketplaceHero/pricing"
        : "/MarketplaceHero/individual-pricing"
    )
  }
/>
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={toggleNotifications}
                    className="relative p-1.5 sm:p-2 text-emerald-100/70 hover:text-emerald-300 transition-colors duration-200 rounded-full hover:bg-gray-100"
                  >
                    <FaBell className="w-5 h-5 sm:w-6 sm:h-6" />
                    {unreadCount > 0 && (
  <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-red-600 rounded-full shadow">
    {unreadCount}
  </span>
)}
                  </button>
                {notificationsOpen && (
  <div className="fixed sm:absolute top-16 sm:top-auto left-1/2 sm:left-auto right-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 mt-0 sm:mt-3 w-[94vw] sm:w-80 md:w-96 max-w-[420px] bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 z-[9999] overflow-hidden transition-all duration-300">

    <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
      <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">Alerts & Notifications</h3>
      {unreadCount > 0 && (
        <span className="text-[10px] sm:text-xs font-medium bg-red-500 text-white px-2 py-1 rounded-full shadow-sm whitespace-nowrap shrink-0">
          {unreadCount} new
        </span>
      )}
    </div>

    <div className="max-h-[65vh] sm:max-h-[420px] overflow-y-auto divide-y divide-gray-100 overscroll-contain">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm transition-all duration-200 cursor-pointer hover:bg-gray-100 active:bg-gray-200 ${
  !notification.read
    ? "bg-slate-50 border-l-4 border-indigo-500"
    : "bg-white"
}`}
          >
            <p className="font-semibold text-gray-800 text-xs sm:text-sm leading-relaxed break-words">{notification.title}</p>
            <p className="text-gray-600 text-[11px] sm:text-xs mt-1.5 leading-relaxed break-words line-clamp-3">
              {notification.message}
            </p>
            <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 uppercase tracking-wide break-words">
              {new Date(notification.timestamp).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <div className="px-4 py-10 text-center text-gray-500 text-xs sm:text-sm flex flex-col items-center justify-center">
          <svg className="w-8 h-8 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          <p className="font-medium">No Pending Alerts</p>
          <p className="text-xs mt-0.5">You're all caught up!</p>
        </div>
      )}
    </div>

    <div className="px-4 py-3 border-t border-gray-100 bg-white text-center sticky bottom-0">
      <Link
        to="/notification"
       className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors break-words"
      >
        View All Notifications &rarr;
      </Link>
    </div>
  </div>
)}

         </div>
                <div ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                      setNotificationsOpen(false);
                    }}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors shrink-0"
                  >
                    <DefaultAvatar
                      name={user.fullName || user.orgName || "User"}
                      size={40}
                  avatarUrl={
  profile?.user?.avatarUrl ||
  profile?.org?.avatarUrl ||
  user?.avatarUrl ||
  null
}
                    />
                  </button>
                  {dropdownOpen && (
                    <ProfileDropdown
                      onClose={() => setDropdownOpen(false)}
                      onLogout={handleLogout}
                    />
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/register-choice"
                className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-all shadow-md whitespace-nowrap"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </nav>
    );
  };

  export default MarketplaceHeroNavbarControls;