import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import heroBg from "../assets/servicesBg.jpg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const submit = async (e) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/admin/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // User information goes into Redux.
    // Access and refresh tokens remain in HttpOnly cookies.
    dispatch(setUser(data.user));

    navigate("/dashboard", { replace: true });
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
  <div className="min-h-screen bg-[#06120c] text-white px-3 sm:px-4 flex items-center justify-center relative overflow-hidden">
    {/* Services Background */}
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />

    {/* Dark AerthX Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#06120c]/90 via-[#06120c]/80 to-[#06120c]/95" />

    {/* Green Glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-[-15%] left-[10%] h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute bottom-[-15%] right-[10%] h-72 w-72 rounded-full bg-green-700/10 blur-3xl" />
    </div>

    {/* Admin Login Card */}
    <div className="relative z-10 w-full max-w-md">
      <form onSubmit={submit} className="rounded-2xl border border-emerald-400/20 bg-[#0a1b12]/85 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-950/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Authorized Access
          </span>

          <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">
            <span className="bg-gradient-to-r from-[#1A5C38] to-[#2E8B57] bg-clip-text text-transparent">AerthX</span>{" "}
            <span className="text-white">Admin Portal</span>
          </h1>

          <p className="mt-3 text-sm text-emerald-50/60">Authorized administrators only.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-950/40 p-3 text-sm text-red-300">{error}</div>
        )}

        {/* Email */}
        <label className="mt-7 block text-sm font-medium text-emerald-50/90">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="admin@aerthx.in"
            className="mt-2 w-full rounded-xl border border-emerald-400/20 bg-[#06120c]/90 px-4 py-3 text-white placeholder:text-emerald-50/30 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>

        {/* Password */}
        <label className="mt-5 block text-sm font-medium text-emerald-50/90">
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="Enter your password"
            className="mt-2 w-full rounded-xl border border-emerald-400/20 bg-[#06120c]/90 px-4 py-3 text-white placeholder:text-emerald-50/30 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#1A5C38] to-[#2E8B57] p-3.5 font-semibold text-white shadow-lg shadow-emerald-950/30 transition hover:from-[#216f45] hover:to-[#359d64] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Admin Sign In"}
        </button>

        {/* Security Text */}
        <p className="mt-5 text-center text-xs text-emerald-50/40">
          Secure access for authorized AerthX administrators.
        </p>
      </form>
    </div>
  </div>
);
}


