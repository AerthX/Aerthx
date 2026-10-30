
import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaSpinner,
  FaLeaf,
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
      className={`absolute -top-4 sm:-top-5 right-4 sm:right-6 bg-yellow-400 text-xs sm:text-sm text-green-900 px-5 py-1 rounded-full font-semibold shadow-lg select-none transform transition-transform duration-600 ease-out ${
        animate
          ? "opacity-100 scale-110 animate-pulse"
          : "opacity-0 scale-75"
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
    <section className="min-h-screen bg-[#001f17] py-10 sm:py-16 lg:py-20 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-[#062d22] border border-emerald-900/60 rounded-3xl shadow-2xl p-5 sm:p-8 lg:p-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-5 sm:mb-6 text-center leading-tight">
          Contact Our Enterprise Team 🚀
        </h2>

        <p className="text-gray-300 text-center mb-10 text-lg leading-relaxed">
          Let’s talk about your carbon goals, API integration, or partnership
          plans. Our team will respond within 1-2 business days.
        </p>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-gray-200"
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                placeholder="Your full name"
                required
                className="mt-2 w-full bg-[#031f18] border border-emerald-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-semibold text-gray-200"
              >
                Company Name
              </label>

              <input
                id="companyName"
                type="text"
                placeholder="Company name"
                required
                className="mt-2 w-full bg-[#031f18] border border-emerald-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-200"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                className="mt-2 w-full bg-[#031f18] border border-emerald-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-200"
              >
                Phone (Optional)
              </label>

              <input
                id="phone"
                type="tel"
                placeholder="+91 9876543210"
                className="mt-2 w-full bg-[#031f18] border border-emerald-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-200"
            >
              What are you looking for?
            </label>

            <textarea
              id="message"
              rows="4"
              placeholder="E.g., API access, large volume credits, branding options..."
              required
              className="mt-2 w-full bg-[#031f18] border border-emerald-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              className="flex-grow bg-emerald-500 hover:bg-emerald-400 text-[#001f17] font-bold py-3 rounded-lg shadow-lg transition"
            >
              Submit Request
            </button>

            <button
              type="button"
              onClick={onBack}
              className="flex-grow border-2 border-emerald-500 text-emerald-400 font-bold py-3 rounded-lg hover:bg-emerald-500/10 transition"
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
  if (
    typeof amount === "string" &&
    amount.toLowerCase() === "custom"
  ) {
    return "Custom";
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount) || numericAmount === 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

const calcSavings = (monthly, yearly) => {
  if (
    typeof monthly === "number" &&
    typeof yearly === "number"
  ) {
    const saved = monthly * 12 - yearly;
    return saved > 0 ? saved : 0;
  }

  return 0;
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Pricing = () => {
  const navigate = useNavigate();

  const [selectedUserType, setSelectedUserType] = useState(null);
  const [showContactSales, setShowContactSales] = useState(false);

  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentDuration, setCurrentDuration] = useState(null);

  const [selectedBilling, setSelectedBilling] = useState("monthly");
  const [expandedPlans, setExpandedPlans] = useState({});

  const [pricingData, setPricingData] = useState({
    plans: {},
    featureGroups: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
   * Four organization plans.
   *
   * The real values will later come from the admin/backend.
   * These defaults make sure the frontend has four cards.
   */
  const defaultPlans = {
    plan_1: {
      id: "plan_1",
      name: "Basic",
      monthly: 0,
      yearly: 0,
      highlight: false,
      features: {},
    },

    plan_2: {
      id: "plan_2",
      name: "Pro",
      monthly: 0,
      yearly: 0,
      highlight: true,
      features: {},
    },

    plan_3: {
      id: "plan_3",
      name: "Business",
      monthly: 0,
      yearly: 0,
      highlight: false,
      features: {},
    },

    plan_4: {
      id: "plan_4",
      name: "Enterprise",
      monthly: "Custom",
      yearly: "Custom",
      highlight: false,
      features: {},
    },
  };

  const planOrder = [
    "plan_1",
    "plan_2",
    "plan_3",
    "plan_4",
  ];

  const togglePlanFeatures = (planKey) => {
  setExpandedPlans((prev) => ({
    ...prev,
    [planKey]: !prev[planKey],
  }));
};

  /*
   * Fetch organization pricing.
   */
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const accessToken =
          localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error(
            "No access token found. Please login again."
          );
        }

        const response = await fetch(
          `${API_BASE_URL}/pricing`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({}));

          throw new Error(
            errorData.message ||
              `HTTP error! status: ${response.status}`
          );
        }

        const config = await response.json();

        setSelectedUserType(config.userType);

        const backendPlans = config.plans || {};

        const processedPlans = {
          ...defaultPlans,
        };

        Object.entries(backendPlans).forEach(
          ([planKey, planValue]) => {
            processedPlans[planKey] = {
              ...defaultPlans[planKey],
              ...planValue,
              key: planKey,
              displayName: planValue.name,
            };
          }
        );

        /*
         * Make sure all four plans exist.
         */
        planOrder.forEach((planKey) => {
          if (!processedPlans[planKey]) {
            processedPlans[planKey] =
              defaultPlans[planKey];
          }

          if (!processedPlans[planKey].displayName) {
            processedPlans[planKey].displayName =
              processedPlans[planKey].name;
          }
        });

        setPricingData({
          plans: processedPlans,
          featureGroups: config.featureGroups || [],
        });
      } catch (err) {
        console.error(
          "Failed to fetch pricing config:",
          err
        );

        setError(
          err.message ||
            "Could not load pricing data. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, []);

  /*
   * Get current subscription.
   */
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const user = JSON.parse(
          localStorage.getItem("user")
        );

        if (!user?.id) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/payment/subscription/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem(
                  "accessToken"
                ) || ""
              }`,
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        if (data?.status === "active") {
          setCurrentPlan(data.plan);
          setCurrentDuration(data.duration);
        }
      } catch (err) {
        console.error(
          "Subscription fetch error:",
          err
        );
      }
    };

    fetchSubscription();
  }, []);

  if (showContactSales) {
    return (
      <ContactSales
        onBack={() => setShowContactSales(false)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#001f17]">
        <FaSpinner className="animate-spin text-emerald-400 text-5xl sm:text-6xl" />

        <p className="mt-4 text-emerald-300 text-lg sm:text-xl">
          Loading pricing plans...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#001f17] px-4">
        <div className="max-w-xl w-full bg-[#062d22] p-8 sm:p-10 rounded-3xl shadow-2xl border border-emerald-900/70 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <FaLeaf className="text-emerald-400 text-2xl" />
          </div>

          <h2 className="text-2xl font-bold text-white">
            Pricing information unavailable
          </h2>

          <p className="text-gray-400 mt-3">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const { plans, featureGroups } = pricingData;

  return (
    <main className="min-h-screen bg-[#001f17] text-white">
      {/* HEADER */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-emerald-400 font-bold tracking-[0.25em] text-xs sm:text-sm mb-4">
            ORGANIZATION PRICING
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight">
            Choose Your{" "}
            <span className="text-emerald-400">
              Plan
            </span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed">
            Flexible plans designed to help organizations
            manage and grow their sustainability journey.
          </p>

          {/* BILLING TOGGLE */}
          <div className="inline-flex bg-[#062d22] border border-emerald-900/70 rounded-full mt-8 sm:mt-10 p-1 shadow-lg">
            <button
              onClick={() =>
                setSelectedBilling("monthly")
              }
              className={`px-5 sm:px-8 py-2.5 rounded-full text-sm sm:text-base font-semibold transition ${
                selectedBilling === "monthly"
                  ? "bg-emerald-400 text-[#001f17] shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-pressed={
                selectedBilling === "monthly"
              }
            >
              Monthly
            </button>

            <button
              onClick={() =>
                setSelectedBilling("yearly")
              }
              className={`px-5 sm:px-8 py-2.5 rounded-full text-sm sm:text-base font-semibold transition ${
                selectedBilling === "yearly"
                  ? "bg-emerald-400 text-[#001f17] shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-pressed={
                selectedBilling === "yearly"
              }
            >
              Yearly
            </button>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
          {planOrder.map((planKey) => {
            const plan = plans[planKey];

            if (!plan) return null;

            const currentIndex =
              currentPlan
                ? planOrder.indexOf(currentPlan)
                : -1;

            const planIndex =
              planOrder.indexOf(planKey);

            const monthlyPrice =
              typeof plan.monthly === "number"
                ? plan.monthly
                : Number(plan.monthly);

            const yearlyPrice =
              typeof plan.yearly === "number"
                ? plan.yearly
                : Number(plan.yearly);

            const savings = calcSavings(
              monthlyPrice,
              yearlyPrice
            );

            const selectedPrice =
              selectedBilling === "yearly"
                ? plan.yearly
                : plan.monthly;

            const isSamePlan =
              currentPlan === planKey ||
              currentPlan === plan.id ||
              currentPlan === plan.name;

            const isLower =
              currentPlan &&
              currentIndex !== -1 &&
              planIndex < currentIndex;

            const isCurrent =
              isSamePlan &&
              currentDuration === selectedBilling;

        const isCustomPlan =
  planKey === "plan_4" ||
  plan.name?.toLowerCase() === "custom";

const isEnterprise =
  isCustomPlan ||
  plan.name?.toLowerCase() === "enterprise";

            const isUpgrade =
              currentPlan &&
              currentIndex !== -1 &&
              planIndex > currentIndex;

            return (
              <article
                key={planKey}
               className={`relative flex flex-col rounded-3xl border transition-all duration-300 ${
  plan.highlight
    ? "bg-gradient-to-b from-[#087a5b] to-[#034d3b] border-emerald-400/70 shadow-2xl shadow-emerald-950/50"
    : "bg-[#062d22] border-emerald-900/70 hover:border-emerald-600 shadow-xl"
}`}
              >
                {plan.highlight && (
                  <MostPopularBadge />
                )}

                <div className="p-6 sm:p-7 lg:p-8">
                  {/* PLAN TITLE */}
                  <div className="mb-6">
                    <p
                      className={`text-xs font-bold tracking-[0.2em] mb-3 ${
                        plan.highlight
                          ? "text-emerald-100"
                          : "text-emerald-400"
                      }`}
                    >
                      {planKey === "plan_1"
                        ? "STARTER"
                        : planKey === "plan_2"
                        ? "POPULAR"
                        : planKey === "plan_3"
                        ? "GROWTH"
                        : "ENTERPRISE"}
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-extrabold">
                      {plan.displayName ||
                        plan.name}
                    </h2>
                  </div>

                  {/* PRICE */}
                  <div className="min-h-[100px]">
                    {isCustomPlan ? (
                      <>
                        <div className="text-3xl sm:text-4xl font-extrabold">
                          Custom
                        </div>

                        <p
                          className={`mt-2 text-sm ${
                            plan.highlight
                              ? "text-emerald-100"
                              : "text-gray-400"
                          }`}
                        >
                          Tailored for your organization
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-end gap-1">
                          <span className="text-3xl sm:text-4xl font-extrabold break-words">
                            {formatCurrency(
                              selectedPrice
                            )}
                          </span>

                          <span
                            className={`mb-1 text-sm ${
                              plan.highlight
                                ? "text-emerald-100"
                                : "text-gray-500"
                            }`}
                          >
                            /
                            {selectedBilling ===
                            "monthly"
                              ? "month"
                              : "year"}
                          </span>
                        </div>

                        {selectedBilling ===
                          "yearly" &&
                          savings > 0 && (
                            <p
                              className={`mt-2 text-sm font-semibold ${
                                plan.highlight
                                  ? "text-yellow-300"
                                  : "text-emerald-400"
                              }`}
                            >
                              Save{" "}
                              {formatCurrency(
                                savings
                              )}
                            </p>
                          )}
                      </>
                    )}
                  </div>

                  {/* DIVIDER */}
                  <div
                    className={`border-t my-7 ${
                      plan.highlight
                        ? "border-emerald-300/30"
                        : "border-emerald-900/70"
                    }`}
                  />

           
{/* FEATURES */}
<div className="flex-1">

  {featureGroups.length > 0 ? (
    featureGroups.map(({ groupTitle, features }) => {

      const isExpanded = expandedPlans[planKey];
      const visibleFeatures = isExpanded
        ? features
        : features.slice(0, 2);

      const remainingCount = Math.max(
        features.length - visibleFeatures.length,
        0
      );

      return (
        <section key={groupTitle} className="mb-6">

          <h3
            className={`text-sm font-bold mb-4 ${
              plan.highlight
                ? "text-emerald-100"
                : "text-emerald-400"
            }`}
          >
            {groupTitle}
          </h3>

          <ul className="space-y-3">

            {visibleFeatures.map(({ key, label, tooltip }) => {

              const value = plan.features?.[key];

              const available =
                value !== false &&
                value !== undefined &&
                value !== null;

              const display =
                typeof value === "string" &&
                !["true", "false", "custom"].includes(
                  value.toLowerCase()
                )
                  ? value
                  : null;



              return (
                <li
                  key={key}
                  className={`flex items-start gap-3 text-xs sm:text-sm leading-relaxed ${
                    available || isCustomPlan
                      ? plan.highlight
                        ? "text-gray-100"
                        : "text-gray-300"
                      : "text-gray-500"
                  }`}
                >

                  {available || isCustomPlan ? (
                    <FaCheckCircle
                      className={`flex-shrink-0 mt-0.5 ${
                        plan.highlight
                          ? "text-emerald-200"
                          : "text-emerald-400"
                      }`}
                      size={16}
                    />
                  ) : (
                    <FaTimesCircle
                      className="flex-shrink-0 mt-0.5 text-gray-600"
                      size={16}
                    />
                  )}

                  <span
                    className={
                      !available && !isCustomPlan
                        ? "line-through"
                        : ""
                    }
                  >
                    {label}

                    {tooltip && <Tooltip text={tooltip} />}
                  </span>

                  {display && (
                    <span className="ml-auto font-semibold">
                      {display}
                    </span>
                  )}

                </li>
              );
            })}

          </ul>

          {!isExpanded && remainingCount > 0 && (
            <p className="mt-3 text-xs text-emerald-400">
              + {remainingCount} more features
            </p>
          )}

        </section>
      );
    })
  ) : (
    <ul className="space-y-4 text-sm text-gray-400">
      <li className="flex items-center gap-3">
        <FaCheckCircle className="text-emerald-400 flex-shrink-0" />
        Sustainability dashboard
      </li>

      <li className="flex items-center gap-3">
        <FaCheckCircle className="text-emerald-400 flex-shrink-0" />
        Carbon offset management
      </li>

      <li className="flex items-center gap-3">
        <FaCheckCircle className="text-emerald-400 flex-shrink-0" />
        Impact tracking
      </li>
    </ul>
  )}

  {/* EXPAND / COLLAPSE */}
  {featureGroups.length > 0 && (
    <button
      type="button"
      onClick={() => togglePlanFeatures(planKey)}
      aria-expanded={!!expandedPlans[planKey]}
      className={`mt-3 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
        plan.highlight
          ? "text-emerald-100 hover:text-white"
          : "text-emerald-400 hover:text-emerald-300"
      }`}
    >
      {expandedPlans[planKey]
        ? "Show less"
        : "View all features"}

      <span
        className={`transition-transform duration-300 ${
          expandedPlans[planKey] ? "rotate-180" : ""
        }`}
      >
        ↓
      </span>
    </button>
  )}

</div>

                  {/* BUY BUTTON */}
                  <button
                    disabled={
                      isCurrent || isLower
                    }
                    onClick={() => {
                      if (isCustomPlan) {
  setShowContactSales(true);
  return;
}

                      if (
                        isCurrent ||
                        isLower
                      ) {
                        return;
                      }

                      navigate("/PricingGateway", {
                        state: {
                          type: "subscription",
                          plan:
                            plan.name,
                          billing:
                            selectedBilling,
                          price:
                            selectedPrice,
                          userType:
                            selectedUserType ||
                            "organization",
                        },
                      });
                    }}
                    className={`w-full mt-8 py-3.5 sm:py-4 rounded-2xl sm:rounded-full font-bold text-sm sm:text-base lg:text-lg shadow-lg transition-all duration-300 ${
                      isCurrent
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : isLower
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : plan.highlight
                        ? "bg-white text-[#034d3b] hover:bg-emerald-50 hover:scale-[1.02]"
                        : "bg-emerald-500 text-[#001f17] hover:bg-emerald-400 hover:scale-[1.02]"
                    }`}
                  >
                    {isCurrent
                      ? "Current Plan"
                      : isLower
                      ? "Downgrade Disabled"
                    : isCustomPlan
? "Contact Sales"
                      : isUpgrade
                      ? "Buy Now"
                      : "Buy Now"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ADD-ONS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-[#062d22] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-emerald-900/70">
          <p className="text-emerald-400 text-xs font-bold tracking-[0.2em] mb-3">
            ADD-ONS
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">
            Certificate & Branding Add-Ons
          </h2>

          <div className="space-y-6 text-gray-300">
            <p className="text-base sm:text-lg leading-relaxed">
              <strong className="text-white">
                Branded Carbon Offset Certificate:
              </strong>{" "}
              ₹199 per certificate — A branded certificate
              for your sustainability activities.
            </p>

            <p className="text-base sm:text-lg leading-relaxed">
              <strong className="text-white">
                Public Offset Profile:
              </strong>{" "}
              ₹499/month — A public profile showcasing
              your organization's sustainability
              milestones.
            </p>
          </div>
        </div>
      </section>

      {/* ENTERPRISE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="bg-[#062d22] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-emerald-900/70">
          <p className="text-emerald-400 text-xs font-bold tracking-[0.2em] mb-3">
            ENTERPRISE
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
            Custom API & Enterprise Integrations
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
            Need tailored API endpoints for seamless
            integration with your systems? Our enterprise
            plans include:
          </p>

          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <FaCheckCircle className="text-emerald-400 mt-1 flex-shrink-0" />
              Custom API key generation & management
            </li>

            <li className="flex gap-3">
              <FaCheckCircle className="text-emerald-400 mt-1 flex-shrink-0" />
              Rate limiting & usage analytics
            </li>

            <li className="flex gap-3">
              <FaCheckCircle className="text-emerald-400 mt-1 flex-shrink-0" />
              Dedicated technical support & onboarding
            </li>

            <li className="flex gap-3">
              <FaCheckCircle className="text-emerald-400 mt-1 flex-shrink-0" />
              Enterprise dashboard with ESG insights
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Pricing;