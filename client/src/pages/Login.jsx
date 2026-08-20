import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginOrganization, loginIndividual, setUser } from "../shared-redux/src/slices/authSlice";
import aerthxlogo from "../assets/aerthxLogo.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [role, setRole] = useState("organization");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      let result;

      if (role === "organization") {
        result = await dispatch(loginOrganization({ email, password })).unwrap();
      } else {
        result = await dispatch(loginIndividual({ email, password })).unwrap();
      }

      const { user } = result;
      dispatch(setUser(user));

      if (user.role === "admin") {
       window.location.href = `${import.meta.env.VITE_ADMIN_URL}/dashboard`;
      } else {
        navigate("/");
      }

    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black overflow-hidden relative p-0 m-0">
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <path
            d="M0 0 L100 0 C80 20 80 80 100 100 L0 100 Z"
            fill="url(#gradient1)"
            className="animate-pulse"
          />
          <path
            d="M0 100 L100 100 C20 80 20 20 0 0 Z"
            fill="url(#gradient1)"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row w-full h-full bg-white bg-opacity-10 backdrop-blur-md overflow-hidden relative z-10 scale-100 transition-all duration-500 ease-in-out">
       <div className="relative hidden md:flex md:w-1/2 items-center justify-center overflow-hidden">
<div
  className="absolute inset-0 opacity-90 transition-opacity duration-500 hover:opacity-100"
  style={{
    background: "radial-gradient(circle, #ffffff 0%, #ffffff 35%, #86efac 80%)",
  }}
></div>


{/* 
<div className="absolute inset-0 bg-gradient-to-br from-green-500 via-gray-100 to-green-500 opacity-90 transition-opacity duration-500 hover:opacity-100"></div> */}
  <div className="flex justify-center mb-6">
 <img 
  src={aerthxlogo} 
  alt="AerthX Logo" 
  className="h-48 w-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] object-contain" 
/>

  </div>

  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
  <p className="absolute bottom-10 left-10 text-white text-lg font-light opacity-80 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
    Innovating for a Sustainable Future.
  </p>
</div>

        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white bg-opacity-95 transition-all duration-500 hover:shadow-xl">
          <h2 className="text-5xl font-extrabold mb-10 text-center text-gray-900 animate-slide-in-down">
            Login to AerthX
          </h2>

          {error && (
            <div className="mb-8 bg-red-50 bg-opacity-90 text-red-700 p-4 text-base text-center shadow-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative flex justify-center mb-8 bg-gray-100 rounded-full p-1 shadow-inner">
              <div
                className={`absolute h-full w-1/2 rounded-full bg-gradient-to-r from-green-500 to-green-700 transition-all duration-300 ease-in-out z-0
                  ${role === "organization" ? "left-0" : "left-1/2"}`}
              ></div>
              <div
                className={`flex-1 text-center py-4 cursor-pointer rounded-full font-semibold text-lg transition-colors duration-300 ease-in-out z-10 transform hover:scale-105
                  ${role === "organization" ? "text-white" : "text-gray-700 hover:text-gray-900"}`}
                onClick={() => setRole("organization")}
              >
                Organization
              </div>
              <div
                className={`flex-1 text-center py-4 cursor-pointer rounded-full font-semibold text-lg transition-colors duration-300 ease-in-out z-10 transform hover:scale-105
                  ${role === "individual" ? "text-white" : "text-gray-700 hover:text-gray-900"}`}
                onClick={() => setRole("individual")}
              >
                Individual
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-800 mb-3">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-5 py-4 border-none rounded-xl focus:outline-none focus:ring-4 focus:ring-green-400 placeholder-gray-400 text-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-lg font-medium text-gray-800 mb-3">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your secure password"
                required
                className="w-full px-5 py-4 border-none rounded-xl focus:outline-none focus:ring-4 focus:ring-green-400 pr-14 placeholder-gray-400 text-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 top-9 pr-5 flex items-center text-base leading-5 text-gray-600 hover:text-green-700 transition-colors duration-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-base text-green-700 hover:underline font-semibold focus:outline-none transition-colors duration-200 transform hover:scale-105"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-xl shadow-lg
                ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 transform hover:-translate-y-1 hover:shadow-xl"}
                transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-400`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-800 text-lg">
            Don't have an account?{" "}
            <Link to="/register-choice" className="text-green-600 hover:underline font-bold transition-colors duration-200 transform hover:scale-105 inline-block">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;