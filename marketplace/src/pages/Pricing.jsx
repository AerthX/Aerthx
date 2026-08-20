import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Tooltip = ({ text }) => (
  <span
    className="ml-1 text-gray-400 cursor-help group relative inline-block"
    aria-label={text}
    role="tooltip"
  >
    <FaInfoCircle className="inline" />
    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-lg">
      {text}
    </span>
  </span>
);

const MostPopularBadge = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div
      className={`absolute -top-4 sm:-top-5 right-4 sm:right-6 bg-yellow-400 text-xs sm:text-sm text-green-900 px-5 py-1 rounded-full font-semibold shadow-lg select-none transform transition-transform duration-600 ease-out
      ${
        animate ? "opacity-100 scale-110 animate-pulse" : "opacity-0 scale-75"
      }`}
      aria-label="Most Popular Plan Badge"
    >
      Most Popular
    </div>
  );
};

const ContactSales = ({ onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      alert("Your request has been sent! Redirecting back to plans.");
      onBack();
    }, 500);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-green-100 to-white py-10 sm:py-16 lg:py-20 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-5 sm:p-8 lg:p-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-700 mb-5 sm:mb-6 text-center leading-tight drop-shadow-md">
          Contact Our Enterprise Team 🚀
        </h2>
        <p className="text-gray-600 text-center mb-10 text-lg leading-relaxed">
          Let’s talk about your carbon goals, API integration, or partnership
          plans. Our team will respond within 1-2 business days.
        </p>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Hardik Patil"
                required
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-semibold text-gray-700"
              >
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="Aearthex Pvt Ltd"
                required
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700"
              >
                Phone (Optional)
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+91 9876543210"
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-700"
            >
              What are you looking for?
            </label>
            <textarea
              id="message"
              rows="4"
              placeholder="E.g., API access, large volume credits, branding options..."
              required
              className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            ></textarea>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              className="flex-grow bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Submit Request
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-grow border-2 border-green-600 text-green-600 font-bold py-3 rounded-lg shadow-md hover:bg-green-50 transition-transform transform hover:scale-105"
            >
              Back to Plans
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

const formatCurrency = (amount) => {
  if (typeof amount === "string" && amount.toLowerCase() === "custom") {
    return "Custom";
  }
  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount === 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

const calcSavings = (monthly, yearly) => {
  if (typeof monthly === "number" && typeof yearly === "number") {
    const saved = monthly * 12 - yearly;
    return saved > 0 ? saved : 0;
  }
  return 0;
};

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/admin`;

const Pricing = () => {
  const [selectedUserType, setSelectedUserType] = useState("individual");
  const [showContactSales, setShowContactSales] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const planOrder = ["plan_1", "plan_2", "plan_3"];
  const [selectedBilling, setSelectedBilling] = useState("monthly");
  const [pricingData, setPricingData] = useState({
    plans: {},
    featureGroups: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/pricing`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();

        const processedPlans = Object.entries(config.plans).reduce(
          (acc, [planKey, planValue]) => {
            acc[planKey] = {
              ...planValue,
              key: planKey,
              displayName: planValue.name,
            };
            return acc;
          },
          {},
        );

        setPricingData({
          plans: processedPlans,
          featureGroups: config.featureGroups || [],
        });
      } catch (err) {
        console.error("Failed to fetch pricing config:", err);
        setError("Could not load pricing data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, []);

  useEffect(() => {
  const fetchSubscription = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
  

      if (!user?.id) return;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/payment/subscription/${user.id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` } }
      );

      const data = await res.json();


      if (data?.status === "active") {
        setCurrentPlan(data.plan);
      }
    } catch (err) {
      console.error("Subscription fetch error:", err);
    }
  };

  fetchSubscription();
}, []);

  if (showContactSales) {
    return <ContactSales onBack={() => setShowContactSales(false)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
        <FaSpinner className="animate-spin text-green-600 text-6xl" />
        <p className="mt-4 text-green-700 text-xl">Loading pricing plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-10">
        <div className="bg-white p-8 rounded-lg shadow-xl border border-red-300">
          <p className="text-red-700 text-lg font-semibold">Error: {error}</p>
          <p className="text-gray-500 mt-2">
            Check the console for details or the API endpoint.
          </p>
        </div>
      </div>
    );
  }

  const { plans, featureGroups } = pricingData;
  

  return (
    <>
      <section className="bg-gradient-to-b from-green-50 to-white py-10 sm:py-14 lg:py-20 px-4 sm:px-6 max-w-7xl mx-auto overflow-x-hidden">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-green-800 drop-shadow-md mb-3 leading-tight">
            Choose Your Plan 💰
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-green-900 max-w-xl mx-auto leading-relaxed font-medium px-2">
            Transparent pricing tailored for businesses of all sizes.
          </p>

          <div className="inline-flex flex-wrap justify-center bg-green-200 rounded-2xl sm:rounded-full mt-8 sm:mt-10 shadow-inner overflow-hidden select-none">
            
            <button
              onClick={() => setSelectedBilling("monthly")}
              className={`px-5 sm:px-8 lg:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-2xl sm:rounded-full transition-transform duration-300 focus:outline-none
                                ${
                                  selectedBilling === "monthly"
                                    ? "bg-white text-green-800 shadow-md scale-110"
                                    : "text-green-900 hover:text-green-700"
                                }`}
              aria-pressed={selectedBilling === "monthly"}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedBilling("yearly")}
              className={`px-5 sm:px-8 lg:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-2xl sm:rounded-full transition-transform duration-300 focus:outline-none
                                ${
                                  selectedBilling === "yearly"
                                    ? "bg-white text-green-800 shadow-md scale-110"
                                    : "text-green-900 hover:text-green-700"
                                }`}
              aria-pressed={selectedBilling === "yearly"}
            >
              Yearly{" "}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {Object.entries(plans).map(([planKey, plan]) => {
            const currentIndex = planOrder.indexOf(currentPlan);
const planIndex = planOrder.indexOf(planKey);
const monthlyPrice = Number(plan.monthly);
const yearlyPrice = Number(plan.yearly);
const savings = calcSavings(monthlyPrice, yearlyPrice);
const currentPrice = plan[selectedBilling];
const isCurrent = currentPlan === planKey;
const isLower = planIndex < currentIndex;
const isUpgrade = planIndex > currentIndex;

            const selectedPrice =
  selectedBilling === "yearly"
    ? plan.yearly
    : plan.monthly;

            const shouldContactSales =
              planKey === "Enterprise" || planKey === "plan_3";

            return (
              <article
                key={planKey}
                className={`relative rounded-3xl p-5 sm:p-7 lg:p-10 shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2
                                    ${
                                      plan.highlight
                                        ? "bg-gradient-to-tr from-green-500 via-green-600 to-green-700 text-white border-green-600 shadow-xl"
                                        : "bg-white text-gray-800 border-gray-200 hover:shadow-xl"
                                    }`}
                aria-label={`${plan.displayName} plan`}
              >
                {plan.highlight && <MostPopularBadge />}

                <h3
                  className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-5 tracking-wide ${
                    plan.highlight
                      ? "text-yellow-100 drop-shadow-lg"
                      : "text-green-700"
                  }`}
                >
                  {plan.displayName}
                </h3>

                <p
                  className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 sm:mb-6 tracking-tight break-words ${
                    plan.highlight
                      ? "text-yellow-200 drop-shadow"
                      : "text-green-800"
                  }`}
                >
                  {plan.displayName === "Enterprise" ||
                  plan.displayName === "Custom"
                    ? "Custom"
                    : formatCurrency(currentPrice)}
                  {plan.displayName !== "Enterprise" &&
                    plan.displayName !== "Custom" &&
                    formatCurrency(currentPrice) !== "Custom" && (
                      <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-300/70">
                       /{selectedBilling.slice(0, -2)}
                      </span>
                    )}
                </p>

            {selectedBilling === "yearly" && savings > 0 && (
                  <p
                    className={`mb-8 font-semibold tracking-wide ${
                      plan.highlight ? "text-yellow-300" : "text-green-600"
                    }`}
                    aria-label={`Save ${formatCurrency(savings)} per year`}
                  >
                    Save {formatCurrency(savings)} per year!
                  </p>
                )}

                {featureGroups.map(({ groupTitle, features }) => (
                  <section key={groupTitle} className="mb-8">
                    <h4
                      className={`text-base sm:text-lg font-semibold mb-3 ${
                        plan.highlight ? "text-yellow-200" : "text-green-700"
                      }`}
                    >
                      {groupTitle}
                    </h4>
                    <ul className="space-y-3">
                      {features.map(({ key, label, tooltip }) => {
                        const value = plan.features?.[key];
                        const available =
                          value !== false &&
                          value !== undefined &&
                          value !== null;
                        const display =
                          typeof value === "string" &&
                          !["true", "false", "custom"].includes(
                            value.toLowerCase(),
                          )
                            ? value
                            : null;

                        return (
                          <li
                            key={key}
                            className={`flex items-start gap-3 text-xs sm:text-sm leading-relaxed ${
                              available
                                ? plan.highlight
                                  ? "text-yellow-100"
                                  : "text-gray-900"
                                : plan.highlight
                                  ? "text-yellow-300 line-through opacity-80"
                                  : "text-gray-400 line-through"
                            }`}
                          >
                            {available ? (
                              <FaCheckCircle
                                className={`flex-shrink-0 ${
                                  plan.highlight
                                    ? "text-yellow-300"
                                    : "text-green-500"
                                }`}
                                size={20}
                                aria-hidden="true"
                              />
                            ) : (
                              <FaTimesCircle
                                className={`flex-shrink-0 ${
                                  plan.highlight
                                    ? "text-yellow-300 opacity-60"
                                    : "text-red-400"
                                }`}
                                size={20}
                                aria-hidden="true"
                              />
                            )}
                            <span className="flex-grow font-normal leading-relaxed break-words">
                              {label}
                              {tooltip && <Tooltip text={tooltip} />}
                            </span>
                            {display && (
                              <span
                                className={`ml-auto font-semibold ${
                                  plan.highlight
                                    ? "text-yellow-200"
                                    : "text-gray-700"
                                }`}
                              >
                                {display}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}

               <button
      disabled={isCurrent || isLower}
      onClick={() => {
        if (shouldContactSales) {
          setShowContactSales(true);
        } else if (isUpgrade || !currentPlan) {
        navigate("/PricingGateway", {
  state: {
    type: "subscription",   // 🔥 MUST
    plan: plan.name,        // your plan
    billing: selectedBilling, // "monthly" or "yearly"
    price: selectedPrice,
    userType: "organization"
  }
});
        }
      }}
      className={`w-full mt-6 sm:mt-8 py-3.5 sm:py-4 rounded-2xl sm:rounded-full font-bold text-sm sm:text-base lg:text-lg shadow-lg transition
        ${
          isCurrent
            ? "bg-gray-400 cursor-not-allowed"
            : isLower
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
    >
      {isCurrent
        ? "Current Plan"
        : isLower
        ? "Downgrade Disabled"
        : isUpgrade
        ? "Upgrade 🚀"
        : "Select Plan"}
    </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-14 sm:mt-20 lg:mt-24 px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold text-green-800 mb-8 tracking-wide drop-shadow-md">
          Certificate & Branding Add-Ons
        </h2>
        <div className="bg-gray-50 rounded-2xl p-5 sm:p-7 lg:p-10 shadow-xl text-gray-700 space-y-6 border border-green-200 hover:shadow-2xl transition-shadow duration-300">
          <p className="text-lg leading-relaxed">
            <strong className="text-green-900">
              Branded Carbon Offset Certificate NFT:
            </strong>{" "}
            {formatCurrency(199)} per certificate — A unique, verifiable digital
            certificate minted on the blockchain.
          </p>
          <p className="text-lg leading-relaxed">
            <strong className="text-green-900">
              Public Offset Profile for Businesses:
            </strong>{" "}
            {formatCurrency(499)}/month — A public profile showcasing your
            sustainability milestones.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-24 px-6 mb-20">
        <h2 className="text-3xl font-extrabold text-green-800 mb-8 tracking-wide drop-shadow-md">
          Custom API & Enterprise Integrations
        </h2>
        <div className="bg-green-50 rounded-2xl p-5 sm:p-7 lg:p-10 shadow-xl text-green-900 space-y-6 border border-green-300 hover:shadow-2xl transition-shadow duration-300">
          <p className="text-lg leading-relaxed">
            Need tailored API endpoints for seamless integration with your
            systems? Our enterprise plans include:
          </p>
          <ul className="list-disc list-inside space-y-3 font-semibold">
            <li>Custom API key generation & management</li>
            <li>Rate limiting & usage analytics</li>
            <li>Dedicated technical support & onboarding</li>
            <li>
              Enterprise dashboard with live carbon credit pricing and ESG
              insights
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Pricing;
