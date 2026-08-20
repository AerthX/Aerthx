import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-black">
      <div className="flex flex-col md:flex-row w-full min-h-screen">
        <div
          className="group relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen bg-green-600 flex flex-col items-center justify-center p-8 text-center text-white cursor-pointer overflow-hidden
                     transition-all duration-700 ease-in-out transform hover:scale-105"
          onClick={() => navigate("/register")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></div>
          <h2 className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight animate-fade-in-up">
            For Businesses & Teams
          </h2>
          <p className="relative z-10 text-base sm:text-lg md:text-xl mb-10 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out delay-200">
            Empower your organization to make a significant environmental impact. Manage your carbon footprint and track your sustainability efforts.
          </p>
          <button
            className="relative z-10 px-12 py-4 bg-white text-green-800 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-lg
                       transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100
                       transition-all duration-500 ease-out delay-300
                       focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
          >
            Register as Organization
          </button>
        </div>

        <div
          className="group relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center text-gray-900 cursor-pointer overflow-hidden
                     transition-all duration-700 ease-in-out transform md:hover:scale-105 active:scale-95"
          onClick={() => navigate("/register-individual")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></div>
          <h2 className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight animate-fade-in-up">
            For Individuals
          </h2>
          <p className="relative z-10 text-base sm:text-lg md:text-xl mb-10 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out delay-200">
            Start your personal journey towards a greener planet. Offset your individual carbon emissions and contribute to a healthier environment.
          </p>
          <button
            className="relative z-10 px-12 py-4 bg-black text-white rounded-full text-base sm:text-lg md:text-xl font-bold shadow-lg
                       transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100
                       transition-all duration-500 ease-out delay-300
                       focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-50"
          >
            Register as Individual
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterChoice;