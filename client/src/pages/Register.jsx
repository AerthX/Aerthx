import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerOrganization, setUser } from "../shared-redux/src/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [emailError, setEmailError] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const emailTimerRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    orgName: "",
    orgType: "",
    industry: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    fullName: "",
    email: "",
    password: "",
    termsAgreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });

    if (name === "email") {
      if (emailTimerRef.current) {
        clearTimeout(emailTimerRef.current);
      }

      if (value.trim() !== "") {
        setEmailChecking(true);
        setEmailError("");

        emailTimerRef.current = setTimeout(async () => {
          if (!value.includes("@") || value.length < 6) {
            setEmailError("Please enter a valid email address.");
            setEmailChecking(false);
            return;
          }
          setEmailError("");
          setEmailChecking(false);
        }, 500);
      } else {
        setEmailError("");
        setEmailChecking(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  

    const requiredFields = ['orgName', 'orgType', 'industry', 'phone', 'country', 'state', 'city', 'fullName', 'email', 'password'];
    for (const field of requiredFields) {
      if (!form[field]) {
        alert(`Please fill in the '${field}' field.`);
        return;
      }
    }

    if (!form.termsAgreed) {
      alert("Please agree to the Terms & Conditions to register.");
      return;
    }
    if (emailError || emailChecking) {
      alert("Please resolve email issues before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
    
      const res = await axios.post(`${API_URL}/auth/send-register-otp`, { email: form.email });
     

      if (res.status === 200 || res.status === 201) {
       
        navigate("/verify-otp", { state: { form, userType: "organization" } });
      } else {
        console.log("Unexpected status:", res.status);
        alert("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.error("send-otp API error:", err);
      alert(err.response?.data?.message || "Failed to send OTP. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 bg-gradient-to-br from-emerald-50 to-teal-100 text-gray-800 antialiased">
      <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-green-700 tracking-tight leading-tight">
            Register Your Organization
          </h1>
          <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Begin your journey with us. Provide accurate details to effortlessly streamline your operations and connect with a thriving community.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-8 text-center text-lg shadow-md" role="alert">
            <strong className="font-semibold">Error:</strong>
            <span className="block sm:inline ml-3">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid grid-cols-1 lg:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-5 sm:gap-y-7">
          <div className="md:col-span-2">
            <label htmlFor="orgName" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Organization Name</label>
            <input
              id="orgName"
              name="orgName"
              value={form.orgName}
              onChange={handleChange}
              placeholder="Your Organization's Legal Name"
              className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-lg placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label htmlFor="orgType" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Organization Type</label>
            <div className="relative">
              <select
                id="orgType"
                name="orgType"
                value={form.orgType}
                onChange={handleChange}
                className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-lg appearance-none cursor-pointer pr-10"
                required
              >
                <option value="">Select Type</option>
                <option value="Corporation">Corporation</option>
                <option value="NGO">NGO (Non-Governmental Organization)</option>
                <option value="Partnership">Partnership</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Industry</label>
            <div className="relative">
              <select
                id="industry"
                name="industry"
                value={form.industry}
                onChange={handleChange}
                className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-lg appearance-none cursor-pointer pr-10"
                required
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Energy">Energy</option>
                <option value="Consulting">Consulting</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="phone" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g., +91 98765 43210"
              className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-lg placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Country</label>
            <input
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-lg placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">State / Province</label>
            <input
              id="state"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State / Province"
              className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-lg placeholder-gray-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="city" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">City</label>
            <input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-lg placeholder-gray-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="fullName" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Your Full Name (Primary Contact)</label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name of Primary Contact"
              className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-lg placeholder-gray-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm sm:text-basetext-base font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Business Email"
              className={`w-full p-4 border-b-2 ${emailError ? 'border-red-500' : 'border-gray-300'} bg-transparent focus:outline-none ${emailError ? 'focus:border-red-500' : 'focus:border-green-600'} transition-all duration-300 text-lg placeholder-gray-500`}
              required
            />
            {emailChecking && (
              <p className="text-blue-600 text-sm mt-2 animate-pulse">Checking email availability...</p>
            )}
            {emailError && (
              <p className="text-red-500 text-sm mt-2">{emailError}</p>
            )}
          </div>

          <div className="md:col-span-2 relative">
            <label htmlFor="password" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className="w-full p-4 pr-12 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-lg placeholder-gray-500"
              required
            />
            <div
              className="absolute top-10 sm:top-11 right-4 cursor-pointer text-gray-600 hover:text-green-600 transition"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </div>
          </div>
          <div className="md:col-span-2 flex items-start gap-2 sm:gap-4 mt-6">
            <input
              id="termsAgreed"
              type="checkbox"
              name="termsAgreed"
              checked={form.termsAgreed}
              onChange={handleChange}
              className="mt-1 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded-sm cursor-pointer"
            />
            <label htmlFor="termsAgreed" className={`ml-4 text-sm sm:text-base ${!form.termsAgreed ? "text-red-600" : "text-gray-700"} cursor-pointer leading-relaxed`}>
              I agree to the{" "}
              <a href="#" className="text-green-600 hover:text-green-700 underline font-semibold" onClick={(e) => e.preventDefault()}>Terms & Conditions</a> and{" "}
              <a href="#" className="text-green-600 hover:text-green-700 underline font-semibold" onClick={(e) => e.preventDefault()}>Privacy Policy</a> *
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !form.termsAgreed || emailChecking || emailError}
            className={`md:col-span-2 w-full py-4 px-6 rounded-xl font-bold text-xl text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl mt-12 mb-6
              ${!form.termsAgreed || emailChecking || emailError || isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-3 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-emerald-50"
              }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-3">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a12 12 0 00-12 12h4z" />
                </svg>
                <span>Registering...</span>
              </div>
            ) : (
              "Register Organization"
            )}
          </button>


          <Link
            to="/signin"
            className="md:col-span-2 text-center text-green-700 hover:text-green-900 mt-4 text-sm sm:text-base underline font-medium transition duration-200"
          >
            Already have an account? Sign In
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;