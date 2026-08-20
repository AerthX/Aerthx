import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerOrganization } from "../shared-redux/src/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const OrganizationRegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [localLoading, setLocalLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const emailTimerRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [showPassword, setShowPassword] = useState(false);

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
      setEmailChecking(true);
      setEmailError("");

      if (emailTimerRef.current) clearTimeout(emailTimerRef.current);

      emailTimerRef.current = setTimeout(async () => {
        if (!value.includes("@") || value.length < 6) {
          setEmailError("Invalid email format");
          setEmailChecking(false);
          return;
        }

        setEmailError("");
        setEmailChecking(false);

      }, 500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Register form submitted");


    if (!form.termsAgreed) return alert("Please agree to Terms & Conditions");
    if (emailError || emailChecking) return;
setLocalLoading(true);
    try {
      console.log("Sending OTP request...");
      const res = await axios.post(`${API_URL}/auth/send-register-otp`, { email: form.email });

      if (res.status === 200 || res.status === 201) {
       
        navigate("/verify-otp", { state: { form, userType: "organization" } });
      } else {
        console.log("Unexpected status:", res.status);
      }
    } catch (err) {
  console.error("send-otp API error:", err);
  alert(err.response?.data?.message || "Failed to send OTP");
} finally {
  setLocalLoading(false);
}
  };


  return (
    <div className="max-w-4xl mx-auto mt-6 sm:mt-10 md:mt-12 p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-green-700 text-center leading-tight">
        Organization Registration
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6 text-center px-2">
        Provide accurate details about your organization to proceed.
      </p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full max-w-3xl mx-auto">
        <input
          name="orgName"
          value={form.orgName}
          onChange={handleChange}
          placeholder="Organization Name"
         className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <select
          name="orgType"
          value={form.orgType}
          onChange={handleChange}
          className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        >
          <option value="">Select Type</option>
          <option>Corporation</option>
          <option>NGO</option>
        </select>

        <select
          name="industry"
          value={form.industry}
          onChange={handleChange}
          className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        >
          <option value="">Industry</option>
          <option>Energy</option>
          <option>Technology</option>
        </select>

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        {emailChecking && (
          <p className="md:col-span-2 text-blue-500 text-xs sm:text-sm">Checking email...</p>
        )}
        {emailError && (
          <p className="md:col-span-2 text-red-500 text-xs sm:text-sm">{emailError}</p>
        )}

        <div className="relative md:col-span-2">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
          className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl pr-16 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-4 flex items-center text-xs sm:text-sm text-green-700 font-medium"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="md:col-span-2 flex items-start gap-3 mt-1">
          <input
            type="checkbox"
            name="termsAgreed"
            checked={form.termsAgreed}
            onChange={handleChange}
          />
          <label className={`text-xs sm:text-sm leading-relaxed ${!form.termsAgreed ? "text-red-600" : "text-gray-700"}`}>
            I agree to the{" "}
            <a href="#" className="text-green-600 underline">
              Terms & Conditions
            </a>{" "}
            *
          </label>
        </div>

      <button
  type="submit"
  disabled={localLoading || !form.termsAgreed}
 className={`md:col-span-2 py-3 rounded-xl text-white mt-3 font-semibold text-sm sm:text-base transition-all
${!form.termsAgreed
  ? "bg-gray-400 cursor-not-allowed"
  : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
}`}
>
  {localLoading ? "Registering..." : "Register Organization"}
</button>

        <Link
          to="/signin"
          className="md:col-span-2 block w-full mt-2 sm:mt-4 text-center border-2 border-green-700 text-green-700 font-semibold rounded-xl
py-3 text-sm sm:text-base hover:bg-green-700 hover:text-white transition-all"
        >
          Already have an account? Sign In
        </Link>
      </form>
    </div>
  );
};

export default OrganizationRegisterForm;