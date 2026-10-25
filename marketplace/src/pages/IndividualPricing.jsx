
import React, { useEffect, useState } from "react";
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

const MostPopularBadge = () => (
  <div
    className="absolute -top-4 right-6 bg-yellow-400 text-green-950 px-5 py-1.5 rounded-full font-bold shadow-lg select-none"
    aria-label="Most Popular Plan"
  >
    Most Popular
  </div>
);

const ContactSales = ({ onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Your request has been sent! Redirecting back to plans.");
    onBack();
  };

  return (
    <section className="min-h-screen bg-[#001f17] py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-[#062d22] border border-emerald-900/60 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 text-center">
          Contact Our Enterprise Team
        </h2>

        <p className="text-gray-300 text-center mb-10 text-base sm:text-lg leading-relaxed">
          Let’s talk about your carbon goals, API integration, or partnership
          plans. Our team will respond within 1–2 business days.
        </p>

        <form className="space-y-7" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                className="mt-2 w-full bg-[#031f18] border border-emerald-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="mt-2 w-full bg-[#031f18] border border-emerald-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                className="mt-2 w-full bg-[#031f18] border border-emerald-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="mt-2 w-full bg-[#031f18] border border-emerald-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              placeholder="Tell us what you need..."
              required
              className="mt-2 w-full bg-[#031f18] border border-emerald-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-grow bg-emerald-500 hover:bg-emerald-400 text-[#001f17] font-bold py-3 rounded-lg shadow-lg transition"
            >
              Submit Request
            </button>

            <button
              type="button"
              onClick={onBack}
              className="flex-grow border border-emerald-500 text-emerald-400 font-bold py-3 rounded-lg hover:bg-emerald-500/10 transition"
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
    typeof yearly === "number" &&
    monthly > 0 &&
    yearly > 0
  ) {
    const saved = monthly * 12 - yearly;
    return saved > 0 ? saved : 0;
  }

  return 0;
};

const IndividualPricing = () => {
  const navigate = useNavigate();

  const [selectedBilling, setSelectedBilling] = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentDuration, setCurrentDuration] = useState(null);

  const [showContactSales, setShowContactSales] = useState(false);

  const [pricingData, setPricingData] = useState({
    plans: {},
    featureGroups: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
   * Four frontend plans.
   *
   * The backend/admin will later provide the actual values for all
   * four plans. For now, these keys allow us to display the complete
   * four-plan frontend.
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

  const planOrder = ["plan_1", "plan_2", "plan_3", "plan_4"];

  /*
   * Load pricing from the existing Individual Pricing API.
   */
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/pricing/individual`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const config = await response.json();

        const backendPlans = config?.plans || {};

        const processedPlans = {
          ...defaultPlans,
        };

        Object.entries(backendPlans).forEach(([planKey, planValue]) => {
          processedPlans[planKey] = {
            ...defaultPlans[planKey],
            ...planValue,
            key: planKey,
            displayName: planValue.name,
          };
        });

        /*
         * Make sure all four cards exist.
         */
        planOrder.forEach((planKey) => {
          if (!processedPlans[planKey]) {
            processedPlans[planKey] = defaultPlans[planKey];
          }

          if (!processedPlans[planKey].displayName) {
            processedPlans[planKey].displayName =
              processedPlans[planKey].name;
          }
        });

        setPricingData({
          plans: processedPlans,
          featureGroups: config?.featureGroups || [],
        });
      } catch (err) {
        console.error("Failed to fetch pricing config:", err);

        /*
         * Keep the four-card frontend visible even when the API
         * is unavailable.
         */
        setPricingData({
          plans: defaultPlans,
          featureGroups: [],
        });

        setError(null);
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
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.id) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/payment/subscription/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("accessToken") || ""
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
        console.error("Subscription fetch error:", err);
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
      <div className="min-h-screen bg-[#001f17] flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-emerald-400 text-5xl" />

        <p className="mt-5 text-emerald-300 text-lg">
          Loading pricing plans...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#001f17] flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-[#062d22] border border-emerald-900 rounded-3xl p-10 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <FaLeaf className="text-emerald-400 text-2xl" />
          </div>

          <h2 className="text-2xl font-bold text-white">
            Pricing information unavailable
          </h2>

          <p className="mt-3 text-gray-400">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const { plans, featureGroups } = pricingData;

  return (
    <main className="min-h-screen bg-[#001f17] text-white">
      {/* HERO */}
      <section className="pt-20 pb-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-emerald-400 font-bold tracking-[0.25em] text-sm mb-5">
            PRICING PLANS
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Choose the right level of{" "}
            <span className="text-emerald-400">
              impact
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed">
            Start with the tools you need today and scale your
            sustainability program as your organization grows.
          </p>

          {/* BILLING TOGGLE */}
          <div className="inline-flex mt-10 bg-[#062d22] border border-emerald-900/70 rounded-full p-1">
            <button
              onClick={() => setSelectedBilling("monthly")}
              className={`px-6 sm:px-8 py-2.5 rounded-full font-semibold transition ${
                selectedBilling === "monthly"
                  ? "bg-emerald-400 text-[#001f17] shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setSelectedBilling("yearly")}
              className={`px-6 sm:px-8 py-2.5 rounded-full font-semibold transition ${
                selectedBilling === "yearly"
                  ? "bg-emerald-400 text-[#001f17] shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
          {planOrder.map((planKey) => {
            const plan = plans[planKey];

            if (!plan) return null;

            const planIndex = planOrder.indexOf(planKey);
            const currentIndex = currentPlan
              ? planOrder.indexOf(currentPlan)
              : -1;

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

            const isEnterprise =
              planKey === "plan_4" ||
              plan.name?.toLowerCase() === "enterprise" ||
              plan.name?.toLowerCase() === "custom";

            const buttonDisabled =
              isCurrent ||
              isLower ||
              (isSamePlan && currentDuration === "yearly");

            return (
              <article
                key={planKey}
                className={`relative rounded-3xl border transition-all duration-300 overflow-visible
                  ${
                    plan.highlight
                      ? "bg-gradient-to-b from-[#087a5b] to-[#034d3b] border-emerald-400/70 shadow-2xl shadow-emerald-950/50 lg:scale-[1.03]"
                      : "bg-[#062d22] border-emerald-900/70 hover:border-emerald-600 hover:-translate-y-2 shadow-xl"
                  }`}
              >
                {plan.highlight && <MostPopularBadge />}

                <div className="p-6 sm:p-7 lg:p-8">
                  {/* PLAN NAME */}
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
                      {plan.displayName || plan.name}
                    </h2>
                  </div>

                  {/* PRICE */}
                  <div className="min-h-[100px]">
                    {isEnterprise ? (
                      <>
                        <div className="text-3xl font-extrabold">
                          Custom
                        </div>

                        <p
                          className={`mt-2 text-sm ${
                            plan.highlight
                              ? "text-emerald-100"
                              : "text-gray-400"
                          }`}
                        >
                          Tailored for your needs
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-end gap-1">
                          <span className="text-3xl sm:text-4xl font-extrabold">
                            {formatCurrency(selectedPrice)}
                          </span>

                          <span
                            className={`mb-1 text-sm ${
                              plan.highlight
                                ? "text-emerald-100"
                                : "text-gray-500"
                            }`}
                          >
                            /{selectedBilling === "monthly"
                              ? "month"
                              : "year"}
                          </span>
                        </div>

                        {selectedBilling === "yearly" &&
                          savings > 0 && (
                            <p
                              className={`mt-2 text-sm font-semibold ${
                                plan.highlight
                                  ? "text-yellow-300"
                                  : "text-emerald-400"
                              }`}
                            >
                              Save {formatCurrency(savings)}
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
                  <div className="min-h-[280px]">
                    {featureGroups.length > 0 ? (
                      featureGroups.map(
                        ({ groupTitle, features }) => (
                          <section
                            key={groupTitle}
                            className="mb-7"
                          >
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
                              {features.map(
                                ({
                                  key,
                                  label,
                                  tooltip,
                                }) => {
                                  const value =
                                    plan.features?.[key];

                                  const available =
                                    value !== false &&
                                    value !== undefined &&
                                    value !== null;

                                  const display =
                                    typeof value === "string" &&
                                    ![
                                      "true",
                                      "false",
                                      "custom",
                                    ].includes(
                                      value.toLowerCase()
                                    )
                                      ? value
                                      : null;

                                  return (
                                    <li
                                      key={key}
                                      className={`flex items-start gap-3 text-sm ${
                                        available
                                          ? plan.highlight
                                            ? "text-gray-100"
                                            : "text-gray-300"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {available ? (
                                        <FaCheckCircle
                                          className={`flex-shrink-0 mt-0.5 ${
                                            plan.highlight
                                              ? "text-emerald-200"
                                              : "text-emerald-400"
                                          }`}
                                        />
                                      ) : (
                                        <FaTimesCircle
                                          className="flex-shrink-0 mt-0.5 text-gray-600"
                                        />
                                      )}

                                      <span
                                        className={
                                          !available
                                            ? "line-through"
                                            : ""
                                        }
                                      >
                                        {label}

                                        {tooltip && (
                                          <Tooltip
                                            text={tooltip}
                                          />
                                        )}
                                      </span>

                                      {display && (
                                        <span className="ml-auto font-semibold">
                                          {display}
                                        </span>
                                      )}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </section>
                        )
                      )
                    ) : (
                      <ul className="space-y-4 text-sm text-gray-400">
                        <li className="flex items-center gap-3">
                          <FaCheckCircle className="text-emerald-400" />
                          Sustainability dashboard
                        </li>

                        <li className="flex items-center gap-3">
                          <FaCheckCircle className="text-emerald-400" />
                          Carbon offset management
                        </li>

                        <li className="flex items-center gap-3">
                          <FaCheckCircle className="text-emerald-400" />
                          Impact tracking
                        </li>
                      </ul>
                    )}
                  </div>

                  {/* BUY BUTTON */}
                  <button
                    disabled={buttonDisabled}
                    onClick={() => {
                      if (isEnterprise) {
                        setShowContactSales(true);
                        return;
                      }

                      if (buttonDisabled) return;

                      navigate("/PricingGateway", {
                        state: {
                          type: "subscription",
                          plan: plan.name,
                          billing: selectedBilling,
                          price: selectedPrice,
                          userType: "individual",
                        },
                      });
                    }}
                    className={`w-full mt-8 py-3.5 rounded-xl font-bold text-base transition-all duration-300 ${
                      buttonDisabled
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : plan.highlight
                        ? "bg-white text-[#034d3b] hover:bg-emerald-50 hover:scale-[1.02] shadow-lg"
                        : "bg-emerald-500 text-[#001f17] hover:bg-emerald-400 hover:scale-[1.02] shadow-lg"
                    }`}
                  >
                    {isCurrent
                      ? "Current Plan"
                      : isLower
                      ? "Downgrade Disabled"
                      : isEnterprise
                      ? "Contact Sales"
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
        <div className="bg-[#062d22] border border-emerald-900/70 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl">
          <p className="text-emerald-400 text-xs font-bold tracking-[0.2em] mb-3">
            ADD-ONS
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
            Certificate & Branding Add-Ons
          </h2>

          <div className="space-y-5 text-gray-300">
            <p className="leading-relaxed">
              <strong className="text-white">
                Branded Carbon Offset Certificate NFT:
              </strong>{" "}
              ₹199 per certificate — A unique, verifiable digital
              certificate.
            </p>

            <p className="leading-relaxed">
              <strong className="text-white">
                Public Offset Profile:
              </strong>{" "}
              ₹499/month — A public profile showcasing
              sustainability milestones.
            </p>
          </div>
        </div>
      </section>

      {/* ENTERPRISE INTEGRATIONS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="bg-[#062d22] border border-emerald-900/70 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl">
          <p className="text-emerald-400 text-xs font-bold tracking-[0.2em] mb-3">
            ENTERPRISE
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
            Custom API & Enterprise Integrations
          </h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            Need tailored API endpoints for seamless integration
            with your systems?
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

export default IndividualPricing;
