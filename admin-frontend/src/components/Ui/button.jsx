import React from "react";

export const Button = ({ children, onClick, className = "", type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 ${className}`}
    >
      {children}
    </button>
  );
};
