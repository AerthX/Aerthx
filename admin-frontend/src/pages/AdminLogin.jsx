import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";

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

  return <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
    <form onSubmit={submit} className="w-full max-w-md rounded-2xl  p-8 shadow-2xl">
      <h1 className="text-3xl font-bold text-slate-900">AerthX Admin Portal</h1>
      <p className="mt-2 text-sm text-slate-500">Authorized administrators only.</p>
      {error && <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <label className="mt-6 block text-sm font-medium">Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="mt-2 w-full rounded-lg border p-3" /></label>
      <label className="mt-4 block text-sm font-medium">Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="mt-2 w-full rounded-lg border p-3" /></label>
      <button disabled={loading} className="mt-6 w-full rounded-lg bg-emerald-600 p-3 font-semibold  disabled:opacity-60">{loading ? "Signing in…" : "Admin Sign In"}</button>
    </form>
  </div>;
}
