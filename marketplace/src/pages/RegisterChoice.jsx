import React, { useState } from "react";
import OrganizationRegisterForm from "./OrganizationRegisterForm";
import IndividualRegisterForm from "./IndividualRegisterForm";

const RegisterChoice = () => {
  const [isIndividual, setIsIndividual] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 overflow-x-hidden">

      {/* ================= MOBILE / TABLET ================= */}
      <div className="lg:hidden min-h-screen flex flex-col">

        {/* TOP PANEL */}
        <div className="bg-gradient-to-br from-green-800 via-green-900 to-black text-white px-5 py-8 text-center">
          <h2 className="text-3xl font-bold mb-3">
            {isIndividual
              ? "Individual Registration"
              : "Organization Registration"}
          </h2>

          <p className="text-sm text-gray-200 max-w-md mx-auto mb-5 leading-relaxed">
            {isIndividual
              ? "Create your personal account and begin your sustainability journey."
              : "Register your organization and manage carbon credit operations professionally."}
          </p>

          <button
            onClick={() => setIsIndividual(!isIndividual)}
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full font-semibold transition-all"
          >
            {isIndividual
              ? "Switch to Organization"
              : "Switch to Individual"}
          </button>
        </div>

        {/* MOBILE FORM */}
        <div className="flex-1 px-4 py-6">
          <div className="max-w-2xl mx-auto">
            {isIndividual ? (
              <IndividualRegisterForm />
            ) : (
              <OrganizationRegisterForm />
            )}
          </div>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden lg:flex relative min-h-screen overflow-hidden bg-white">

        {/* SLIDING GREEN PANEL */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-green-800 via-green-900 to-black text-white flex items-center justify-center p-12 z-20 transition-transform duration-700 ease-in-out ${
            isIndividual ? "translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="max-w-md text-center">

            <h2 className="text-5xl font-extrabold mb-6 leading-tight">
              {isIndividual ? "Already Registered?" : "New Here?"}
            </h2>

            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              {isIndividual
                ? "Switch back to register as an organization and manage your carbon projects professionally."
                : "Register as an individual to join the carbon offsetting journey."}
            </p>

            <button
              onClick={() => setIsIndividual(!isIndividual)}
              className="bg-green-500 hover:bg-green-600 px-6 py-3
md:px-8 md:py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-xl"
            >
              {isIndividual
                ? "Register as Organization"
                : "Register as Individual"}
            </button>

          </div>
        </div>

        {/* SLIDING FORMS CONTAINER */}
        <div
          className={`flex w-[200%] min-h-screen transition-transform duration-700 ease-in-out ${
            isIndividual ? "-translate-x-1/2" : "translate-x-0"
          }`}
        >

          {/* ORGANIZATION FORM */}
          <div className="w-1/2 flex items-center justify-end bg-white px-16 py-10">
            <div className="w-full max-w-2xl">
              <OrganizationRegisterForm />
            </div>
          </div>

          {/* INDIVIDUAL FORM */}
          <div className="w-1/2 flex items-center justify-start bg-white px-16 py-10">
            <div className="w-full max-w-2xl">
              <IndividualRegisterForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterChoice;