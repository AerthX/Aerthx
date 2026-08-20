import { useEffect } from "react";

const GlobalLogout = () => {

  useEffect(() => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");

    window.location.href = "/";

  }, []);

  return null;
};

export default GlobalLogout;