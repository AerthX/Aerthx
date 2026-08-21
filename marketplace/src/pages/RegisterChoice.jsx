import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full overflow-hidden bg-black">
      <div className="flex h-full w-full flex-col md:flex-row">
        
        {/* Organization */}
        <div
          className="
            group relative
            h-1/2 w-full md:h-full md:w-1/2
            bg-green-600
            flex flex-col items-center justify-center
            p-8
            text-center text-white
            cursor-pointer
            overflow-hidden
          "
          onClick={() => navigate("/register")}
        >
          {/* Background hover effect */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-br from-green-500 to-green-800
              opacity-0
              group-hover:opacity-100
              transition-opacity duration-500
            "
          />

          <h2
            className="
              relative z-10
              text-3xl sm:text-4xl md:text-5xl
              font-extrabold
              mb-6
              leading-tight
            "
          >
            For Businesses & Teams
          </h2>

          <p
            className="
              relative z-10
              text-base sm:text-lg md:text-xl
              mb-10
              max-w-sm
              opacity-0
              group-hover:opacity-100
              transition-opacity duration-500
            "
          >
            Empower your organization to make a significant environmental
            impact. Manage your carbon footprint and track your sustainability
            efforts.
          </p>

          <button
            type="button"
            className="
              relative z-10
              px-12 py-4
              bg-white text-green-800
              rounded-full
              text-base sm:text-lg md:text-xl
              font-bold
              shadow-lg
              translate-y-8
              opacity-0
              group-hover:translate-y-0
              group-hover:opacity-100
              transition-all duration-500
              focus:outline-none
              focus:ring-4
              focus:ring-white/50
            "
          >
            Register as Organization
          </button>
        </div>

        {/* Individual */}
        <div
          className="
            group relative
            h-1/2 w-full md:h-full md:w-1/2
            bg-white
            flex flex-col items-center justify-center
            p-8
            text-center text-gray-900
            cursor-pointer
            overflow-hidden
          "
          onClick={() => navigate("/register-individual")}
        >
          {/* Background hover effect */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-br from-gray-100 to-gray-300
              opacity-0
              group-hover:opacity-100
              transition-opacity duration-500
            "
          />

          <h2
            className="
              relative z-10
              text-3xl sm:text-4xl md:text-5xl
              font-extrabold
              mb-6
              leading-tight
            "
          >
            For Individuals
          </h2>

          <p
            className="
              relative z-10
              text-base sm:text-lg md:text-xl
              mb-10
              max-w-sm
              opacity-0
              group-hover:opacity-100
              transition-opacity duration-500
            "
          >
            Start your personal journey towards a greener planet. Offset your
            individual carbon emissions and contribute to a healthier
            environment.
          </p>

          <button
            type="button"
            className="
              relative z-10
              px-12 py-4
              bg-black text-white
              rounded-full
              text-base sm:text-lg md:text-xl
              font-bold
              shadow-lg
              translate-y-8
              opacity-0
              group-hover:translate-y-0
              group-hover:opacity-100
              transition-all duration-500
              focus:outline-none
              focus:ring-4
              focus:ring-black/50
            "
          >
            Register as Individual
          </button>
        </div>

      </div>
    </div>
  );
};

export default RegisterChoice;