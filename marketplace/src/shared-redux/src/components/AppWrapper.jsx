import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProfile } from "../slices/profileSlice";
import { setUser, logout } from "../slices/authSlice";

const AppWrapper = ({ children }) => {
  const dispatch = useDispatch();

  // Accept authenticated handoff from the public Client app.
  // The token is consumed from the URL immediately and the URL is cleaned.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const userType = params.get("userType");
    const userJson = params.get("user");

    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (userType) localStorage.setItem("userType", userType);
    if (userJson) {
      try {
        localStorage.setItem("user", JSON.stringify(JSON.parse(userJson)));
      } catch {
        // Ignore malformed optional user payload; profile sync can recover it.
      }
    }

    if (accessToken || userType || userJson) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    }
  }, []);

  // Sync user from localStorage → Redux
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userType = localStorage.getItem("userType");
    let localUser = null;
    try {
      const rawUser = localStorage.getItem("user");
      localUser = rawUser ? JSON.parse(rawUser) : null;
    } catch {
      localUser = null;
    }

    if (
      token &&
      userType &&
      (!localUser || (!localUser.fullName && !localUser.orgName))
    ) {
      dispatch(fetchProfile({ token, userType }))
        .unwrap()
        .then((res) => {
          const correctUser =
            userType === "organization"
              ? res?.org || res?.user
              : res?.user || res?.org;

          dispatch(setUser(correctUser));
        })
        .catch((err) => console.error("Profile sync error:", err));
    } else if (localUser) {
      dispatch(setUser(localUser));
    }
  }, [dispatch]);

  // Sync logout between tabs
  useEffect(() => {
const handleStorage = () => {
  const token = localStorage.getItem("accessToken");

if (!token) {
  // 🔥 stop infinite reload
  if (window.location.pathname !== "/") {
    dispatch(logout());
    window.location.href = "/";
  }
}
};

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default AppWrapper;