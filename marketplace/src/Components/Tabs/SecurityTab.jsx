import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
  FaMobileAlt,
  FaHistory,
  FaSignOutAlt,
  FaTrashAlt,
  FaCheckCircle,
  FaArrowRight,
  FaTimes,
  FaInfoCircle,
  FaDesktop,
  FaLaptop,
  FaMobileAlt as FaMobileDevice,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import zxcvbn from "zxcvbn";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const SecurityTab = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [strength, setStrength] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    setStrength(zxcvbn(form.newPassword));
  }, [form.newPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const togglePassword = (field) =>
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });

  const validateStep = () => {
    const errs = {};
    if (step === 1 && !form.currentPassword)
      errs.currentPassword = "Enter current password.";
    if (step === 2) {
      if (form.newPassword.length < 8)
        errs.newPassword = "Password must be at least 8 characters.";
      if (strength?.score < 2) errs.newPassword = "Try a stronger password.";
      if (form.newPassword !== form.confirmPassword)
        errs.confirmPassword = "Passwords must match.";
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep();
    if (Object.keys(errs).length) return setErrors(errs);
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType") || "Individual";
      const response = await axios.post(
        `${API_URL}/auth/change-password/${userType.toLowerCase()}`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          userType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(response.data.message || "Password update failed");
      }
      toast.success("Password updated! Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      setTimeout(() => (window.location.href = "/signin"), 2000);
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-400",
    "bg-green-500",
    "bg-green-600",
  ];

  const getStrengthText = () => {
    if (!form.newPassword) return "";
    const score = strength?.score || 0;
    return ["Very weak", "Weak", "Fair", "Good", "Strong"][score];
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <header className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 flex items-center justify-center gap-4">
          <FaShieldAlt className="text-green-600 text-5xl" /> Account Security
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Manage your password, linked devices, and other critical security settings to keep your account safe.
        </p>
      </header>
      <div className="space-y-12">
        <section className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaLock className="text-green-600" /> Change Password
            </h2>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold border-2 border-gray-200 hover:bg-gray-200 transition-colors duration-200"
            >
              {showPasswordForm ? "Cancel" : "Update Password"}
            </button>
          </div>
          {showPasswordForm && (
            <>
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto font-bold transition-all duration-300 ${
                        step === s
                          ? "bg-green-600 text-white shadow-lg"
                          : s < step
                          ? "bg-green-300 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {s === 3 ? <FaCheckCircle /> : s}
                    </div>
                    {s !== 3 && (
                      <div className={`absolute top-5 left-1/2 w-full h-1 bg-gray-200 transition-all duration-300 transform -translate-x-1/2 z-[-1] ${
                        s < step ? "bg-green-300" : ""
                      }`} />
                    )}
                    {s === 1 && (
                      <p className="mt-2 text-sm text-center font-medium">
                        Current Password
                      </p>
                    )}
                    {s === 2 && (
                      <p className="mt-2 text-sm text-center font-medium">
                        New Password
                      </p>
                    )}
                    {s === 3 && (
                      <p className="mt-2 text-sm text-center font-medium">Confirm</p>
                    )}
                  </div>
                ))}
              </div>
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        className={`w-full border-2 ${
                          errors.currentPassword ? "border-red-500" : "border-gray-200"
                        } rounded-xl px-5 py-3 pr-12 focus:ring-4 focus:ring-green-100 focus:border-green-300 transition-all duration-200 outline-none`}
                        placeholder="Enter your current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("current")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={handleNext}
                      className="px-6 py-2 bg-green-600 text-white rounded-full font-bold shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        className={`w-full border-2 ${
                          errors.newPassword ? "border-red-500" : "border-gray-200"
                        } rounded-xl px-5 py-3 pr-12 focus:ring-4 focus:ring-green-100 focus:border-green-300 transition-all duration-200 outline-none`}
                        placeholder="Create a new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("new")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {form.newPassword && (
                      <div className="mt-3">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${(strength?.score + 1) * 20}%` }}
                            className={`h-full rounded-full transition-all duration-300 ${
                              strengthColors[strength?.score] || "bg-red-500"
                            }`}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Password strength:{" "}
                          <span
                            className={`font-semibold ${
                              strengthColors[strength?.score]?.replace("bg", "text") || "text-red-500"
                            }`}
                          >
                            {getStrengthText()}
                          </span>
                        </p>
                      </div>
                    )}
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={`w-full border-2 ${
                          errors.confirmPassword ? "border-red-500" : "border-gray-200"
                        } rounded-xl px-5 py-3 pr-12 focus:ring-4 focus:ring-green-100 focus:border-green-300 transition-all duration-200 outline-none`}
                        placeholder="Re-enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("confirm")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between gap-3 mt-4">
                    <button
                      onClick={handleBack}
                      className="px-6 py-2 border rounded-full font-semibold border-gray-200 hover:bg-gray-100 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-6 py-2 bg-green-600 text-white rounded-full font-bold shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="text-center space-y-6">
                  <div className="flex justify-center items-center mb-4">
  <FaCheckCircle className="text-green-600 text-6xl" />
</div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Confirm Password Change
                  </h3>
                  <p className="text-gray-500">
                    You will be logged out from all devices after this change.
                  </p>
                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={handleBack}
                      className="px-6 py-2 border rounded-full font-semibold border-gray-200 hover:bg-gray-100 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-green-600 text-white rounded-full font-bold shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Updating..." : "Confirm & Update"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
        <section className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
            <FaMobileAlt className="text-green-600" /> Linked Devices
          </h2>
          <p className="text-gray-600 mb-6">
            Review and manage the devices currently logged into your account.
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <FaLaptop className="text-gray-500 text-xl sm:text-2xl" />
                <div>
                  <h4 className="font-semibold text-gray-800">MacBook Pro</h4>
                  <p className="text-sm text-gray-500">
                    Pune, India - Chrome
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    Current session
                  </p>
                </div>
              </div>
              <button
                className="text-red-500 hover:text-red-700 transition-colors text-lg sm:text-xl"
                title="Remove device"
              >
                <FaTrashAlt />
              </button>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <FaMobileDevice className="text-gray-500 text-xl sm:text-2xl" />
                <div>
                  <h4 className="font-semibold text-gray-800">iPhone 14</h4>
                  <p className="text-sm text-gray-500">
                    Bangalore, India - Safari
                  </p>
                </div>
              </div>
              <button
                className="text-red-500 hover:text-red-700 transition-colors text-lg sm:text-xl"
                title="Remove device"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button className="px-8 py-3 bg-red-500 text-white rounded-full font-bold shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105">
              <FaSignOutAlt className="mr-2" /> Log Out All Devices
            </button>
          </div>
        </section>
        <section className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
            <FaHistory className="text-green-600" /> Account Activity
          </h2>
          <p className="text-gray-600 mb-6">
            Review recent sign-ins and password changes to ensure your account security.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FaCheckCircle className="text-green-500 text-xl mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Signed in on Chrome</p>
                <p className="text-sm text-gray-500">from Pune, India • Just now</p>
              </div>
            </li>
            <li className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FaLock className="text-orange-500 text-xl mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Password changed</p>
                <p className="text-sm text-gray-500">from Bangalore, India • Yesterday</p>
              </div>
            </li>
            <li className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FaEnvelopeOpenText className="text-blue-500 text-xl mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Account details updated</p>
                <p className="text-sm text-gray-500">from Mumbai, India • 3 days ago</p>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default SecurityTab;