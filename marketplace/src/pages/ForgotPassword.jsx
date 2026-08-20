import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaKey, FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendOtp = async () => {
    setError("");
    setMessage("");
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, { email });
      setServerOtp(res.data.otp);
      setStep(2);
      setMessage("OTP has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = () => {
    setError("");
    setMessage("");
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    if (otp === serverOtp) {
      setStep(3);
      setMessage("OTP verified. You can now reset your password.");
    } else {
      setError("Invalid OTP. Please check again.");
    }
  };

  const resetPassword = async () => {
    setError("");
    setMessage("");
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        email,
        password,
         otp,
      });
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="relative mb-6">
              <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-emerald-500" />
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-emerald-300 rounded-lg bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
              />
            </div>
            <button
              onClick={sendOtp}
              disabled={loading}
              className={`w-full py-2.5 sm:py-3 rounded-lg text-white font-bold text-sm sm:text-base shadow-md transition duration-300 ${
                loading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        );
      case 2:
        return (
          <>
            <div className="relative mb-6">
              <FaKey className="absolute top-1/2 left-4 -translate-y-1/2 text-emerald-500" />
              <input
                type="text"
                id="otp"
                placeholder="Enter the OTP from your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-emerald-300 rounded-lg bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
              />
            </div>
            <button
              onClick={verifyOtp}
             className="w-full py-2.5 sm:py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Verify OTP
            </button>
          </>
        );
      case 3:
        return (
          <>
            <div className="relative mb-4">
              <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-emerald-500" />
              <input
                type="password"
                id="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-emerald-300 rounded-lg bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
              />
            </div>
            <div className="relative mb-6">
              <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-emerald-500" />
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-emerald-300 rounded-lg bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
              />
            </div>
            <button
              onClick={resetPassword}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition duration-300 ${
                loading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              }`}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </>
        );
      default:
        return null;
    }
  };

  const leaves = Array.from({ length: 40 }, (_, i) => {
    const randomSize = 20 + Math.random() * 20;
    const randomDuration = 10 + Math.random() * 8;
    const randomDelay = -Math.random() * 10;
    const randomHSL = `hsl(${Math.random() * 30 + 100}, 50%, ${40 + Math.random() * 30}%)`;
    const randomRotate = Math.random() * 360;
    const randomFlipX = Math.random() > 0.5 ? 1 : -1;
    return (
      <div
        key={i}
        className="leaf"
        style={{
          left: `${Math.random() * 100}vw`,
          animationDuration: `${randomDuration}s`,
          animationDelay: `${randomDelay}s`,
          width: `${randomSize}px`,
          height: `${randomSize}px`,
          backgroundColor: randomHSL,
          transform: `rotate(${randomRotate}deg) scaleX(${randomFlipX})`,
        }}
      ></div>
    );
  });

  return (
    <div className="leaf-container min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 bg-gradient-to-br from-lime-100 via-green-100 to-emerald-200">
      <style>
        {`
        .leaf-container {
            overflow: hidden;
            position: relative;
        }
        .leaf {
            position: absolute;
            background-color: transparent;
            border-radius: 50% 0;
            pointer-events: none;
            z-index: 0;
            opacity: 0.8;
            animation: fall linear infinite;
        }
        .leaf::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-image: radial-gradient(circle at 70% 30%, transparent 10px, #ffffff33 11px, #ffffff00 12px),
                               linear-gradient(135deg, transparent 50%, #ffffff33 51%, #ffffff00 52%);
            border-radius: 50% 0;
            transform: scale(0.6);
            opacity: 0.5;
        }
        .leaf::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 2px;
            height: 150%;
            background-color: #ffffff33;
            transform: translate(-50%, -50%) rotate(45deg);
            border-radius: 2px;
        }
        @keyframes fall {
            0% {
                transform: translateY(-10vh) rotate(0deg) scale(1) perspective(100px);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            100% {
                transform: translateY(110vh) rotate(720deg) scale(0.8) perspective(100px);
                opacity: 0;
            }
        }
        `}
      </style>
      {leaves}
      <div className="max-w-md w-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border-t-8 border-emerald-500 z-10">
        <div className="relative flex flex-col items-center mb-6 sm:mb-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
            className="absolute top-0 left-0 text-gray-600 hover:text-emerald-600 transition p-1"
              title="Go back"
            >
              <FaArrowLeft className="w-6 h-6" />
            </button>
          )}
          <FaLock className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-emerald-600 mb-3 sm:mb-4" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
            Forgot Password?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 text-center px-2">
            {step === 1 && "Enter your email and we'll send a code to reset your password."}
            {step === 2 && "Enter the OTP we sent to your email to verify your identity."}
            {step === 3 && "Create a new, strong password for your account."}
          </p>
        </div>
        {message && (
          <div className="bg-emerald-100 text-emerald-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mb-4 sm:mb-6 text-center text-xs sm:text-sm font-medium border border-emerald-200">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mb-4 sm:mb-6 text-center text-xs sm:text-sm font-medium border border-red-200">
            {error}
          </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
};

export default ForgotPassword;