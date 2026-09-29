import React, { useEffect, useState } from "react";
import api from "../utils/api";
import heroBg from "../assets/new_aerthx.jpeg";

import {
  FaLeaf,
  FaBuilding,
  FaUsers,
  FaCheck,
  FaArrowRight,
  FaCloud,
  FaShieldAlt,
  FaFileAlt,
  FaChartLine,
  FaSeedling,
  FaGlobe,
  FaRecycle,
  FaTree,
} from "react-icons/fa";

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const userType = localStorage.getItem("userType") || "individual";

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          "/pricing?userType=" + encodeURIComponent(userType)
        );

        const rawPlans = res.data.plans;

        const plansArray = Array.isArray(rawPlans)
          ? rawPlans
          : Object.values(rawPlans || {});

        const cleanedPlans = plansArray.map((plan) => ({
          name: plan.name,

          price:
            typeof plan.price === "number"
              ? plan.price
              : userType === "organization"
              ? plan.monthly?.organization
              : plan.monthly?.individual,

          features: (
            Array.isArray(plan.features)
              ? plan.features
              : Object.values(plan.features || {})
          ).map((feature) =>
            typeof feature === "string"
              ? feature
              : feature?.name || feature?.label || "Feature"
          ),

          highlight: plan.highlight || false,
        }));

        const planOrder = {
          SME: 1,
          Business: 2,
          Enterprise: 3,
          Custom: 4,
        };

        cleanedPlans.sort(
          (a, b) =>
            (planOrder[a.name] || 99) - (planOrder[b.name] || 99)
        );

        setPlans(cleanedPlans);
      } catch (err) {
        console.error("Pricing fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [userType]);

  const getPlanIcon = (name) => {
    const normalizedName = name?.toLowerCase();

    if (normalizedName?.includes("sme")) {
      return <FaLeaf />;
    }

    if (normalizedName?.includes("business")) {
      return <FaBuilding />;
    }

    if (normalizedName?.includes("enterprise")) {
      return <FaUsers />;
    }

    return <FaGlobe />;
  };

  const getPlanDescription = (name) => {
    const normalizedName = name?.toLowerCase();

    if (normalizedName?.includes("sme")) {
      return "Essential sustainability tools for growing businesses.";
    }

    if (normalizedName?.includes("business")) {
      return "Advanced carbon management for businesses scaling their impact.";
    }

    if (normalizedName?.includes("enterprise")) {
      return "Comprehensive sustainability infrastructure for large organizations.";
    }

    return "A flexible sustainability solution tailored to your organization.";
  };

  return (
    <div className="min-h-screen bg-[#03150d] text-white">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative min-h-[650px] flex items-center justify-center overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(" + heroBg + ")",
          }}
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#02150c]/35 via-transparent to-[#06120c]/95" />

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/25 via-transparent to-emerald-950/25" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-semibold mb-7">
            <FaLeaf className="text-emerald-300" />
            Sustainable Growth Starts Here
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
            Simple Pricing.
            <br />
            <span className="text-emerald-300">
              Meaningful Impact.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto mt-7 text-base sm:text-lg md:text-xl text-white/85 leading-relaxed">
            Choose a plan that gives your organization the tools to measure,
            manage, report, and reduce its environmental impact.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">

            <a
              href="#pricing-plans"
              className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Explore Plans
              <FaArrowRight />
            </a>

            <a
              href="#pricing-details"
              className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md text-white font-bold transition-all duration-300"
            >
              See What's Included
            </a>

          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-12 text-sm text-white/75">

            <span className="flex items-center gap-2">
              <FaCheck className="text-emerald-300" />
              Flexible plans
            </span>

            <span className="flex items-center gap-2">
              <FaCheck className="text-emerald-300" />
              Scalable solutions
            </span>

            <span className="flex items-center gap-2">
              <FaCheck className="text-emerald-300" />
              Carbon credits separate
            </span>

          </div>

        </div>
      </section>

      {/* =========================================================
          PRICING PLANS - DARK THEME
      ========================================================= */}
      <section
        id="pricing-plans"
        className="relative py-20 sm:py-24 px-5 sm:px-8 bg-[#03150d] overflow-hidden"
      >

        <div className="absolute top-20 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto">

          <div className="text-center max-w-3xl mx-auto mb-14">

            <p className="text-sm font-bold tracking-[0.2em] uppercase text-emerald-400 mb-3">
              Pricing Plans
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              Choose the right level of
              <span className="text-emerald-400"> impact</span>
            </h2>

            <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
              Start with the tools you need today and scale your sustainability
              program as your organization grows.
            </p>

          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-20">

              <div className="w-12 h-12 border-4 border-emerald-900 border-t-emerald-400 rounded-full animate-spin" />

            </div>
          )}

          {/* No Plans */}
          {!loading && plans.length === 0 && (
            <div className="max-w-xl mx-auto py-16 text-center rounded-3xl bg-[#082319] border border-emerald-900/50 shadow-xl">

              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-2xl mb-5">
                <FaLeaf />
              </div>

              <h3 className="text-2xl font-bold text-white">
                Pricing information unavailable
              </h3>

              <p className="text-white/50 mt-2">
                Please try again later.
              </p>

            </div>
          )}

          {/* Plans */}
          {!loading && plans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-7">

              {plans.map((plan, index) => {
                const isBusiness =
                  plan.name?.toLowerCase().includes("business");

                return (
                  <div
                    key={index}
                    className={`relative group ${
                      isBusiness ? "xl:-translate-y-3" : ""
                    }`}
                  >

                    {isBusiness && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                        <div className="px-5 py-2 rounded-full bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-emerald-900/40">
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div
                      className={`absolute -inset-1 rounded-[28px] blur-xl transition-opacity duration-500 ${
                        isBusiness
                          ? "bg-emerald-500/20 opacity-100"
                          : "bg-emerald-500/10 opacity-0 group-hover:opacity-100"
                      }`}
                    />

                    <div
                      className={`relative h-full rounded-[26px] p-7 sm:p-8 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl ${
                        isBusiness
                          ? "bg-[#0b2b1d] border border-emerald-400/70 shadow-xl shadow-emerald-950/40"
                          : "bg-[#082319] border border-emerald-900/60"
                      }`}
                    >

                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl mb-6 ${
                          isBusiness
                            ? "bg-emerald-500 text-white"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {getPlanIcon(plan.name)}
                      </div>

                      <h3 className="text-2xl font-black text-white">
                        {plan.name}
                      </h3>

                      <p className="mt-3 text-sm text-white/55 leading-relaxed min-h-[60px]">
                        {getPlanDescription(plan.name)}
                      </p>

                      <div className="mt-7 mb-7">

                        {typeof plan.price === "number" ? (
                          <>
                            <div className="flex items-end gap-1">

                              <span className="text-4xl font-black text-white">
                                ₹{plan.price.toLocaleString("en-IN")}
                              </span>

                              <span className="text-sm text-white/40 mb-1.5">
                                / month
                              </span>

                            </div>

                            <p className="text-xs text-white/35 mt-2">
                              Subscription fee
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="text-3xl font-black text-white">
                              Custom
                            </div>

                            <p className="text-xs text-white/35 mt-2">
                              Contact us for pricing
                            </p>
                          </>
                        )}

                      </div>

                      <div className="h-px bg-emerald-900/50 mb-6" />

                      <div>

                        <p className="text-sm font-bold text-white mb-4">
                          What's included
                        </p>

                        <ul className="space-y-3">

                          {plan.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-start gap-3 text-sm text-white/60"
                            >
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mt-0.5">
                                <FaCheck className="text-[9px]" />
                              </span>

                              <span>{feature}</span>
                            </li>
                          ))}

                        </ul>

                      </div>

                      <button
                        className={`w-full mt-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                          isBusiness
                            ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-950/40"
                            : "bg-white/5 hover:bg-emerald-500 text-white border border-white/10 hover:border-emerald-500"
                        }`}
                      >
                        {plan.name?.toLowerCase().includes("custom")
                          ? "Contact Us"
                          : "Get Started"}

                        <FaArrowRight className="text-sm" />
                      </button>

                    </div>
                  </div>
                );
              })}

            </div>
          )}

          {/* Carbon Credits */}
          <div className="max-w-4xl mx-auto mt-14">

            <div className="rounded-2xl bg-[#082319] border border-emerald-900/60 p-6 sm:p-7 flex flex-col sm:flex-row items-start gap-5 shadow-xl shadow-black/10">

              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
                <FaRecycle />
              </div>

              <div>

                <h3 className="font-extrabold text-white text-lg">
                  Carbon credits are charged separately
                </h3>

                <p className="text-sm text-white/55 leading-relaxed mt-2">
                  Your subscription provides access to AerthX's sustainability
                  tools and platform capabilities. Carbon credits and offset
                  purchases are handled separately based on your organization's
                  requirements.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          EVERYTHING YOU NEED - WHITE SECTION
      ========================================================= */}
      <section
        id="pricing-details"
        className="py-20 sm:py-24 bg-white px-5 sm:px-8 border-t border-gray-100"
      >

        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto mb-14">

            <p className="text-sm font-bold tracking-[0.2em] uppercase text-emerald-600 mb-3">
              What's Included
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900">
              Everything you need to
              <span className="text-emerald-600"> manage your impact</span>
            </h2>

            <p className="mt-5 text-gray-500 text-base sm:text-lg leading-relaxed">
              Powerful sustainability capabilities designed to help your
              organization understand, manage, and communicate its environmental
              performance.
            </p>

          </div>

          {/* Impact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <ImpactCard
              icon={<FaCloud />}
              title="Carbon Management"
              text="Track and manage your organization's carbon footprint through structured sustainability data."
            />

            <ImpactCard
              icon={<FaRecycle />}
              title="Carbon Offsetting"
              text="Access carbon credit solutions to support your environmental goals and offset emissions."
            />

            <ImpactCard
              icon={<FaShieldAlt />}
              title="Verified Impact"
              text="Build confidence through transparent environmental data and credible impact information."
            />

            <ImpactCard
              icon={<FaFileAlt />}
              title="Sustainability Reporting"
              text="Create structured sustainability reports that communicate your organization's progress."
            />

            <ImpactCard
              icon={<FaChartLine />}
              title="Impact Analytics"
              text="Understand sustainability performance through useful data and analytical insights."
            />

            <ImpactCard
              icon={<FaSeedling />}
              title="ESG Support"
              text="Build stronger environmental, social, and governance practices across your organization."
            />

            <ImpactCard
              icon={<FaGlobe />}
              title="Environmental Goals"
              text="Set measurable sustainability objectives and monitor progress toward them."
            />

            <ImpactCard
              icon={<FaTree />}
              title="Positive Impact"
              text="Turn sustainability initiatives into measurable environmental outcomes."
            />

          </div>

        </div>
      </section>

      {/* =========================================================
          HOW AERTHX PRICING WORKS - DARK
      ========================================================= */}
      <section className="py-20 sm:py-24 bg-[#03150d] px-5 sm:px-8 border-t border-emerald-900/30">

        <div className="max-w-6xl mx-auto">

          <div className="text-center max-w-3xl mx-auto mb-14">

            <p className="text-sm font-bold tracking-[0.2em] uppercase text-emerald-400 mb-3">
              Simple Structure
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              How AerthX pricing works
            </h2>

            <p className="mt-5 text-white/55 text-base sm:text-lg">
              A straightforward commercial structure designed to keep your
              sustainability program flexible as it grows.
            </p>

          </div>

          {/* Structure Cards - NO NUMBERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

            <StructureCard
              icon={<FaBuilding />}
              title="Choose your platform plan"
              text="Select the subscription level that matches your organization's sustainability requirements."
            />

            <StructureCard
              icon={<FaRecycle />}
              title="Manage your carbon credits"
              text="Purchase carbon credits separately based on your actual offsetting and environmental requirements."
            />

            <StructureCard
              icon={<FaChartLine />}
              title="Scale with your organization"
              text="Upgrade your platform capabilities as your sustainability program and reporting needs grow."
            />

          </div>

        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#020e09] py-20 sm:py-24 px-5 sm:px-8 border-t border-emerald-900/30">

        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center text-white">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-2xl mb-7">
            <FaLeaf />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
            Ready to build a more
            <span className="text-emerald-400"> sustainable future?</span>
          </h2>

          <p className="mt-5 text-white/55 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Start with the AerthX platform and build a sustainability program
            that grows with your organization.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-9">

            <a
              href="#pricing-plans"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-all duration-300 hover:-translate-y-1"
            >
              Explore Plans
              <FaArrowRight />
            </a>

            <a
              href="#pricing-details"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/15 hover:bg-white/5 text-white font-bold transition-all duration-300"
            >
              Explore Features
            </a>

          </div>

        </div>

      </section>

    </div>
  );
};

/* =============================================================
   IMPACT CARD - WHITE THEME
============================================================= */

const ImpactCard = ({ icon, title, text }) => {
  return (
    <div className="group relative">

      {/* Hover Glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-emerald-200 to-green-100 rounded-[25px] opacity-0 group-hover:opacity-70 blur transition-all duration-500" />

      {/* Card */}
      <div className="relative h-full bg-white border border-gray-100 rounded-[22px] p-7 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 overflow-hidden">

        {/* Icon */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 text-emerald-600 flex items-center justify-center text-xl mb-7 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
          {icon}
        </div>

        {/* Title */}
        <h3 className="relative text-xl font-extrabold mb-3 text-gray-900">
          {title}
        </h3>

        {/* Description */}
        <p className="relative text-sm text-gray-500 leading-relaxed">
          {text}
        </p>

        {/* Bottom Accent */}
        <div className="mt-7 h-1 w-10 rounded-full bg-emerald-500 group-hover:w-full transition-all duration-500" />

      </div>

    </div>
  );
};

/* =============================================================
   STRUCTURE CARD - DARK THEME
============================================================= */

const StructureCard = ({ icon, title, text }) => {
  return (
    <div className="group relative bg-[#082319] rounded-[24px] border border-emerald-900/50 p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-950/30 transition-all duration-500 hover:-translate-y-2">

      {/* Icon */}
      <div className="relative w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mb-7 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-extrabold text-white">
        {title}
      </h3>

      {/* Text */}
      <p className="mt-3 text-sm text-white/50 leading-relaxed">
        {text}
      </p>

      {/* Accent */}
      <div className="mt-7 h-1 w-10 rounded-full bg-emerald-500 group-hover:w-full transition-all duration-500" />

    </div>
  );
};

export default Pricing;