
import React from "react";
import { Link, useParams } from "react-router-dom";

const plans = {
  sme: {
    name: "SME",
    monthlyPrice: "₹4,999",
    annualPrice: "₹49,990 / year",
    idealFor:
      "For small companies beginning structured sustainability and carbon management.",
    carbonCredits:
      "Purchased separately according to the selected projects and volume.",
    features: [
      "Carbon footprint assessment",
      "Company sustainability profile",
      "Access to verified carbon-credit projects",
      "Monthly carbon impact summary",
      "Carbon offset recommendations",
      "Carbon retirement certificates",
      "Basic sustainability report",
      "Company impact dashboard",
      "Sustainability progress tracking",
      "Email support",
      "Employee awareness resources",
    ],
  },

  business: {
    name: "BUSINESS",
    monthlyPrice: "₹14,999",
    annualPrice: "₹1,49,990 / year",
    idealFor:
      "For growing companies with recurring carbon and ESG requirements.",
    carbonCredits:
      "Purchased separately according to the selected projects and volume.",
    features: [
      "Everything in SME",
      "Detailed carbon footprint assessment",
      "Advanced sustainability dashboard",
      "Monthly + annual impact reports",
      "Advanced ESG reporting",
      "Custom offset recommendations",
      "Priority access to carbon projects",
      "Carbon portfolio management",
      "Multiple team members",
      "Company sustainability certificate",
      "Priority support",
      "Sustainability communication material",
    ],
  },

  enterprise: {
    name: "ENTERPRISE",
    monthlyPrice: "₹39,999+",
    annualPrice: "Custom annual contract",
    idealFor:
      "For large companies requiring scale, reporting and ongoing sustainability support.",
    carbonCredits:
      "Purchased separately according to the selected projects and volume.",
    features: [
      "Everything in Business",
      "Multi-location carbon tracking",
      "Multiple business-unit management",
      "Custom carbon reduction strategy",
      "Dedicated sustainability dashboard",
      "Advanced ESG & impact reports",
      "Custom carbon-credit portfolio",
      "Large-volume carbon-credit procurement",
      "Dedicated account manager",
      "Priority project sourcing",
      "Custom sustainability documentation",
      "Business-specific reporting support",
      "Priority service & support",
    ],
  },

  custom: {
    name: "CUSTOM",
    monthlyPrice: "Custom",
    annualPrice: "Custom commercial agreement",
    idealFor:
      "For organisations with unique requirements, large volumes or strategic partnerships.",
    carbonCredits:
      "Purchased separately according to the selected projects and volume.",
    features: [
      "Enterprise-level access",
      "Custom pricing based on requirements",
      "Custom carbon-credit procurement",
      "Custom reporting requirements",
      "Bespoke sustainability programs",
      "Large-scale offset programs",
      "Dedicated AerthX relationship manager",
      "Strategic sustainability support",
      "Custom employee / customer engagement",
      "Long-term carbon management programs",
    ],
  },
};

const planOrder = ["sme", "business", "enterprise", "custom"];

export default function PlanDetails() {
  const { planId } = useParams();

  const plan = plans[planId];

  if (!plan) {
    return (
      <main className="min-h-screen bg-[#03150d] text-white flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Plan not found</h1>
          <p className="mt-4 text-white/60">
            The pricing plan you are looking for does not exist.
          </p>
          <Link
            to="/pricing"
            className="inline-block mt-7 text-emerald-400 hover:text-emerald-300"
          >
            ← Back to pricing
          </Link>
        </div>
      </main>
    );
  }

  const currentIndex = planOrder.indexOf(planId);

  return (
    <main className="relative min-h-screen bg-[#03150d] text-white overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-20 left-[-150px] w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute bottom-20 right-[-150px] w-[450px] h-[450px] bg-green-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">

        {/* Breadcrumb */}
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-emerald-400 transition-colors"
        >
          <span>←</span>
          Back to all plans
        </Link>

        {/* Page Heading */}
        <div className="mt-12 mb-10">

          <div className="flex items-center gap-3 mb-5">
            <span className="w-9 h-[2px] bg-emerald-400" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-emerald-400">
              Recommended Pricing
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
            {plan.name}
            <span className="text-emerald-400">.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-white/55 text-base sm:text-lg leading-relaxed">
            Explore everything included in the {plan.name} sustainability
            plan and discover how AerthX supports your organization's
            sustainability journey.
          </p>

        </div>

        {/* Main Pricing Panel */}
        <section className="rounded-3xl overflow-hidden border border-emerald-400/20 bg-[#0a1b12]/90 shadow-2xl shadow-black/20">

          {/* Price Header */}
          <div className="p-7 sm:p-10 md:p-12 border-b border-white/10">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

              <div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-400">
                  Plan {currentIndex + 1} of 4
                </span>

                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold">
                  {plan.name}
                </h2>

                <p className="mt-3 text-sm text-white/45">
                  A sustainability solution designed for your organization.
                </p>
              </div>

              <div className="md:text-right">

                <p className="text-4xl sm:text-5xl font-black text-white">
                  {plan.monthlyPrice}
                </p>

                <p className="mt-2 text-sm text-white/45">
                  {planId === "custom" ? "Flexible pricing" : "per month"}
                </p>

                <p className="mt-2 text-sm text-emerald-400 font-medium">
                  Annual: {plan.annualPrice}
                </p>

              </div>

            </div>

          </div>

          {/* Plan Information */}
          <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.5fr]">

            {/* Left Information */}
            <div className="p-7 sm:p-10 md:p-12 border-b md:border-b-0 md:border-r border-white/10 space-y-10">

              {/* Ideal For */}
              <div>
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-emerald-400">
                  Ideal For
                </p>

                <p className="mt-4 text-white/75 leading-7">
                  {plan.idealFor}
                </p>
              </div>

              {/* Carbon Credits */}
              <div>
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-emerald-400">
                  Carbon Credits
                </p>

                <p className="mt-4 text-white/75 leading-7">
                  {plan.carbonCredits}
                </p>
              </div>

              {/* Plan Position */}
              <div className="pt-6 border-t border-white/10">
                <p className="text-sm text-white/40">
                  Your selected plan
                </p>

                <p className="mt-2 text-lg font-bold text-white">
                  {plan.name}
                </p>
              </div>

            </div>

            {/* Right Features */}
            <div className="p-7 sm:p-10 md:p-12">

              <div className="flex items-center justify-between gap-4 mb-8">
                <h3 className="text-sm font-bold tracking-[0.18em] uppercase text-emerald-400">
                  What's Included
                </h3>

                <span className="text-xs text-white/35">
                  {plan.features.length} Features
                </span>
              </div>

              <div className="space-y-5">

                {plan.features.map((feature, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-4 group"
                  >

                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 text-xs">
                      ✓
                    </span>

                    <p className="text-sm sm:text-base text-white/75 leading-relaxed group-hover:text-white transition-colors">
                      {feature}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="px-7 sm:px-10 md:px-12 py-6 border-t border-white/10 bg-white/[0.02]">

            <p className="text-xs sm:text-sm text-white/40 leading-relaxed">
              Carbon credits are purchased separately based on selected
              projects and required volume. Plan features are as listed
              in the AerthX pricing proposal.
            </p>

          </div>

        </section>

        {/* Other Plans Navigation */}
        <section className="mt-16">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-bold">
                Explore More
              </p>

              <h2 className="mt-3 text-2xl sm:text-3xl font-bold">
                Other pricing plans
              </h2>
            </div>

            <Link
              to="/pricing"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              View all plans →
            </Link>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {planOrder
              .filter((id) => id !== planId)
              .map((id) => (

                <Link
                  key={id}
                  to={`/pricing/${id}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-emerald-400/50 hover:bg-emerald-500/[0.06] transition-all duration-300"
                >

                  <p className="text-xs uppercase tracking-[0.15em] text-white/35">
                    AerthX Plan
                  </p>

                  <div className="flex items-center justify-between mt-4">

                    <h3 className="text-lg font-bold text-white">
                      {plans[id].name}
                    </h3>

                    <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>

                  </div>

                  <p className="mt-3 text-sm text-white/45">
                    {plans[id].monthlyPrice}
                    {id !== "custom" && " / month"}
                  </p>

                </Link>

              ))}

          </div>

        </section>

        {/* Bottom Navigation */}
        <div className="mt-12 text-center">
          <Link
            to="/pricing"
            className="text-sm text-white/50 hover:text-emerald-400 transition-colors"
          >
            ← Return to AerthX Pricing
          </Link>
        </div>

      </div>
    </main>
  );
}
