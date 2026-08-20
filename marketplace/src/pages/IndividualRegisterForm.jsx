import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerIndividual } from "../shared-redux/src/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const IndividualRegisterForm = () => {
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
    fullName: "",
    email: "",
    password: "",
    designation: "",
    country: "",
    state: "",
    city: "",
    phone: "",
    termsAgreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

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

    if (!form.termsAgreed) return alert("Please agree to Terms & Conditions");
    if (emailError || emailChecking) return;
setLocalLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/send-register-otp`, { email: form.email });


      if (res.status === 200) {
        navigate("/verify-otp", { state: { form, userType: "Individual" } });
      }
    } catch (err) {
      console.error("send-otp API error:", err);
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const statesOfIndia = [
    "Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Delhi",
    "Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "West Bengal", "Punjab",
  ];

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-green-700 text-center">
        Individual Registration
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Please provide your personal information to register.
      </p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="p-2 border border-gray-300 rounded w-full"
            required
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-2 border border-gray-300 rounded w-full"
            required
          />

          {emailChecking && (
            <p className="col-span-2 text-blue-500 text-sm">
              Checking email...
            </p>
          )}

          {emailError && (
            <p className="col-span-2 text-red-500 text-sm">
              {emailError}
            </p>
          )}

          <div className="relative col-span-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="p-2 border border-gray-300 rounded w-full pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <input
            name="designation"
            value={form.designation}
            onChange={handleChange}
            placeholder="Designation"
            className="p-2 border border-gray-300 rounded w-full"
          />

          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="USA">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="Other">Other</option>
          </select>

          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-full"
          >
            <option value="">Select State</option>
            {statesOfIndia.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="p-2 border border-gray-300 rounded w-full"
            required
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="w-full max-w-2xl mt-2 flex items-start gap-2">
          <input
            type="checkbox"
            name="termsAgreed"
            checked={form.termsAgreed}
            onChange={handleChange}
          />
          <label className={`text-sm ${!form.termsAgreed ? "text-red-600" : ""}`}>
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
  className={`w-full max-w-2xl py-2 rounded text-white mt-2 font-semibold
    ${!form.termsAgreed || localLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
>
  {localLoading ? "Registering..." : "Register Individual"}
</button>


        <Link
          to="/signin"
          className="block w-full max-w-2xl mt-4 text-center border-2 border-green-700 text-green-700 font-semibold rounded-lg
            py-3 hover:bg-green-700 hover:text-white transition-all"
        >
          Already have an account? Sign In
        </Link>
      </form>
    </div>
  );
};

export default IndividualRegisterForm;