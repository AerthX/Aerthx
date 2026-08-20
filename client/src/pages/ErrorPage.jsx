// src/pages/ErrorPage.jsx
import React from "react";
import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-10 text-center">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Oops! Something went wrong.</h1>
      <p className="mb-4 text-sm sm:text-base md:text-lg text-gray-600 px-2">{error?.statusText || error?.message || "Page not found"}</p>
      <Link to="/" className="inline-block mt-2 text-sm sm:text-base text-blue-600 underline hover:text-blue-800 transition">Go Home</Link>
    </div>
  );
};

export default ErrorPage;
