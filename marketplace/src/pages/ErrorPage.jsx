import React from "react";
import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      <div className="text-center max-w-md w-full">
        
        {/* TITLE */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Oops!
        </h1>

        {/* MESSAGE */}
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6">
          {error?.statusText || error?.message || "Page not found"}
        </p>

        {/* BUTTON */}
        <Link
          to="/"
          className="inline-block bg-green-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium shadow-md hover:bg-green-700 transition"
        >
          Go Home
        </Link>

      </div>
    </div>
  );
};

export default ErrorPage;