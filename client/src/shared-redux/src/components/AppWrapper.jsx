import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProfile } from "../slices/profileSlice";
import { setUser, logout } from "../slices/authSlice";

const AppWrapper = ({ children }) => {
  const dispatch = useDispatch();

  // Sync user from localStorage → Redux
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userType = localStorage.getItem("userType");
  const storedUser = localStorage.getItem("user");

let localUser = null;

try {
  localUser =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;
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