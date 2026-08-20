import React, { useEffect, useState } from "react";
import api from "../utils/api";

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const userType = localStorage.getItem("userType") || "individual";

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await api.get(`/pricing?userType=${userType}`);

        const rawPlans = res.data.plans;

        // 🔥 Ensure array
        const plansArray = Array.isArray(rawPlans)
          ? rawPlans
          : Object.values(rawPlans || {});

        // 🔥 Normalize EVERYTHING properly
        const cleanedPlans = plansArray.map((plan) => ({
          name: plan.name,

          price:
            typeof plan.price === "number"
              ? plan.price
              : userType === "organization"
              ? plan.monthly?.organization
              : plan.monthly?.individual,

          // 🔥 FIX: always string array
          features: (Array.isArray(plan.features)
            ? plan.features
            : Object.values(plan.features || {})
          ).map((f) =>
            typeof f === "string" ? f : f?.name || f?.label || "Feature"
          ),

          highlight: plan.highlight || false,
        }));

        setPlans(cleanedPlans);
      } catch (err) {
        console.error("Pricing fetch error:", err);
      }
    };

    fetchPricing();
  }, [userType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-green-700 mb-10 sm:mb-12 md:mb-16">
        Our Pricing Plans
      </h1>

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-6 sm:p-8 md:p-10 border transition"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              {plan.name}
            </h2>

            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-600 mb-4 sm:mb-6">
              {typeof plan.price === "number"
                ? `₹${plan.price} / month`
                : "Custom Pricing"}
            </p>

            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              {plan.features.map((f, i) => (
                <li key={i}>
                  ✔ {f}
                </li>
              ))}
            </ul>

            <div className="text-xs sm:text-sm text-gray-400 text-center border-t pt-3 sm:pt-4">
              Available in MarketplaceHero
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;