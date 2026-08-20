import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerIndividual } from "../shared-redux/src/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const RegisterIndividual = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);
  const [emailError, setEmailError] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const emailTimerRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });

    if (name === "email") {
      if (emailTimerRef.current) clearTimeout(emailTimerRef.current);

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

    const requiredFields = ['fullName', 'email', 'password', 'country', 'city'];
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
        navigate("/verify-otp", { state: { form, userType: "Individual" } });
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start sm:justify-center p-3 sm:p-6 bg-gradient-to-br from-green-50 to-teal-100 text-gray-800 antialiased">
      <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-green-700 tracking-tight leading-tight">
            Join as an Individual
          </h1>
          <p className="mt-6 grid-cols-1 lg:grid-cols-2 text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create your personal profile to get started and explore new opportunities.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-8 text-center text-lg shadow-md" role="alert">
            <strong className="font-semibold">Error:</strong>
            <span className="block sm:inline ml-3">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-5 sm:gap-y-7">
          <div className="md:col-span-2">
            <label htmlFor="fullName" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Your Full Name"
              className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-lg placeholder-gray-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email Address"
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
            <label htmlFor="password" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-lg pr-12 placeholder-gray-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-9 sm:top-10 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.622a8.956 8.956 0 01.996-1.416A.75.75 0 016.3 7.02c1.769-.472 3.582-.638 5.42-.638h.001c.73 0 1.443.08 2.14.242a.75.75 0 01.618.528c.376.92.658 1.905.842 2.923C17.023 10.995 18 12 18 12c.008.008.008.008.016.016v.005L21.49 16.89l-1.415 1.415L16 14.505l-.004-.004a.75.75 0 01-.132-.196c-.323-.746-.605-1.543-.842-2.393H12c-.742 0-1.455-.078-2.14-.241a.75.75 0 01-.618-.528c-.376-.92-.658-1.905-.842-2.923-1.41-1.01-2.395-2.006-2.923-2.923a.75.75 0 01-.528-.618c-.162-.697-.24-1.41-.241-2.14v-.001c0-1.838.166-3.651.638-5.42a.75.75 0 01.528-.618c.92-.376 1.905-.658 2.923-.842C9.005 5.023 10 4 10 4s.992 0 1.98.016v.005l2.49 3.395L16 9.495l.004.004a.75.75 0 01.196.132c.746.323 1.543.605 2.393.842c1.01.141 2.006.395 2.923.842a.75.75 0 01.618.528c.162.697.24 1.41.241 2.14v.001c0 1.838-.166 3.651-.638 5.42a.75.75 0 01-.528.618c-.92.376-1.905.658-2.923.842-1.01.141-2.006.395-2.923.842a.75.75 0 01-.618-.528c-.162-.697-.24-1.41-.241-2.14v-.001c0-1.838.166-3.651.638-5.42a.75.75 0 01.528-.618c.92-.376 1.905-.658 2.923-.842C12.995 10.995 12 10 12 10zM12 12c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          <div>
            <label htmlFor="designation" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Designation </label>
            <input
              id="designation"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="e.g., Software Engineer, Manager"
              className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-lg placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g., +91 98765 43210"
              className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-lg placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Country</label>
            <input
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="e.g., India"
              className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-sm sm:text-base placeholder-gray-500"
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
              placeholder="e.g., Maharashtra, Gujarat"
              className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-sm sm:text-base placeholder-gray-500"
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
              className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-green-600 transition-all duration-300 text-sm sm:text-base placeholder-gray-500"
              required
            />
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
                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-3 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-50"
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
              "Register Individual"
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

export default RegisterIndividual;