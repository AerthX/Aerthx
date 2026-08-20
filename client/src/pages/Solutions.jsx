import React from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaBuilding,
  FaUser,
  FaChartLine,
  FaCog,
  FaShieldAlt,
  FaCertificate,
  FaWalking,
  FaGlobe,
  FaLock,
} from "react-icons/fa";
// ✅ Use the SAME background image used on Home page
import heroBg from "../assets/new_aerthx.jpeg"; // <-- replace with your actual background image

const Solutions = () => {
  return (
    <div className="relative overflow-hidden bg-[#04120A]">

      {/* Background */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#031108]/70 to-[#04120A]" />

      {/* Green Glow */}

    <div className="absolute left-1/2 top-[-180px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[180px]" />
      {/* Fog */}

      <div className="absolute top-32 left-0 h-96 w-72 rounded-full bg-gradient-to-br from-white/8 via-white/5 to-emerald-900/20 blur-[120px] border border-emerald-500/20
shadow-[0_20px_80px_rgba(16,185,129,0.08)]" />

      <div className="border border-emerald-500/20
shadow-[0_20px_80px_rgba(16,185,129,0.08)] absolute bottom-0 right-0 h-96 w-80 rounded-fullbg-gradient-to-br from-white/8 via-white/5 to-emerald-900/20blur-[120px]" />

      {/* Content */}

      <div className="relative z-10">
{/* HERO */}

<section className="relative max-w-7xl mx-auto px-6 pt-6 md:pt-10 lg:pt-14 pb-4">
  {/* Badge */}

  <div className="flex justify-center">

   <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 md:px-5 md:py-2">

      <FaLeaf className="text-emerald-400 text-xs md:text-xs md:text-sm" />

      <span className="text-[9px] md:text-xs uppercase tracking-[0.2em] font-medium text-emerald-300">
        Powering Climate Action
      </span>

    </div>

  </div>

  {/* Heading */}

<div className="mt-1 md:mt-8 text-center">

    <h1 className="text-[20px] md:text-3xl md:text-6xl lg:text-7xl font-black leading-none">

      <span className="text-white">
        Our
      </span>{" "}

      <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-green-300 bg-clip-text text-transparent">
        Solutions
      </span>

    </h1>

    <p className="mt-3 mb-3 text-[13px] leading-6 text-gray-300">
      Explore our curated suite of carbon offset services,
      designed to empower everyone from individuals
      to global enterprises.
    </p>

  </div>

</section>

{/* =======================
      CARDS START HERE
======================= */}
        {/* =======================
              CARDS START HERE
        ======================= */}
<section className="max-w-7xl mx-auto px-5 -mt-6 md:-mt-2 pb-12">

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 items-start">
           
            {/* BUSINESS CARD */}
<div className="group relative overflow-hidden rounded-[28px] border border-emerald-500/20 bg-gradient-to-br from-white/[0.05] via-white/[0.03] to-emerald-900/20 backdrop-blur-3xl px-4 pt-3 pb-4 md:px-5 md:py-5 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/40 hover:shadow-[0_25px_60px_rgba(16,185,129,.15)]">

  {/* Glow */}
  <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-[70px]" />

  <div className="relative z-10">

    {/* Header */}

<div className="flex items-center gap-5">

  {/* Icon */}

  <div className="flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10">
    <FaBuilding className="text-emerald-400 text-xl md:text-2xl" />
  </div>

  {/* Title */}

  <div>

    <h2 className="text-2xl md:text-3xl font-bold text-white">
      For Businesses
    </h2>

    <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />

  </div>

</div>

    {/* Description */}

<p className="mt-2 mb-1 text-[11px] md:text-sm leading-5 md:leading-6 text-gray-300">
      Deliver on your sustainability goals with scalable carbon
      credit solutions, real time dashboards,and API access integration.

    </p>

    {/* Features */}

   <div className="mt-2 grid grid-cols-3 gap-2">

      {[
        {
          title: "ESG Dahboard",
        
          icon: <FaChartLine className="text-emerald-400 text-base" />,
        },
        {
          title: "API Integration",
          
          icon: <FaCog className="text-emerald-400 text-base" />,
        },
        {
          title: "Scable Solution",
         
          icon: <FaShieldAlt className="text-emerald-400 text-base" />,
        },
      ].map((item) => (

        <div
          key={item.title}
         className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2">
          <div className="flex items-start gap-3">

            {item.icon}

            <div>

              <h4 className="text-xs md:text-sm font-semibold text-white">
                {item.title}
              </h4>

              <p className="text-xs text-gray-400">
                {item.sub}
              </p>

            </div>

          </div>

        </div>

      ))}

    </div>

    <Link
      to="/solutions/business"
     className="mt-4 inline-flex w-full justify-center items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
    >
      Discover More →
    </Link>

  </div>

</div>
{/* INDIVIDUAL CARD */}

<div className="group relative overflow-hidden rounded-[28px] border border-emerald-500/20 bg-gradient-to-br from-white/[0.05] via-white/[0.03] to-emerald-900/20 backdrop-blur-3xl px-4 pt-3 pb-4 md:px-5 md:py-5 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/40 hover:shadow-[0_25px_60px_rgba(16,185,129,.15)]">
  {/* Glow */}

  <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-[70px]" />

  <div className="relative z-10">

    {/* Header */}

   {/* Header */}

<div className="flex items-center gap-5">

  <div className="flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10">
    <FaUser className="text-emerald-400 text-xl md:text-2xl" />
  </div>

  <div>

    <h2 className="text-2xl md:text-3xl font-bold text-white">
      For Individuals
    </h2>

    <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />

  </div>

</div>

    {/* Description */}

  <p className="mt-2 mb-1 text-[11px] md:text-sm leading-5 md:leading-6 text-gray-300">
  Offset your footprint with verified carbon credits,
  monitor your impact, and earn certificates for
  your climate journey.

</p>

    {/* Features */}

       <div className="mt-2 grid grid-cols-3 gap-2">

      {[
        {
          title: "Track Impact",
          
          icon: <FaWalking className="text-emerald-400 text-base" />,
        },
        {
          title: "Certificates",
          
          icon: <FaCertificate className="text-emerald-400 text-base" />,
        },
        {
          title: "Easy Offset",
          
          icon: <FaLeaf className="text-emerald-400 text-base" />,
        },
      ].map((item) => (

        <div
          key={item.title}
         className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2">
          <div className="flex items-start gap-3">

            <div className="mt-1">
              {item.icon}
            </div>

            <div>

              <h4 className="text-xs md:text-sm font-semibold text-white leading-tight">
                {item.title}
              </h4>

              <p className="mt-1 text-xs text-gray-400">
                {item.sub}
              </p>

            </div>

          </div>

        </div>

      ))}

    </div>

    {/* Button */}

    <Link
      to="/solutions/individuals"
     className="mt-4 inline-flex w-full justify-center items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
    >
      Discover More
      <span>→</span>
    </Link>

  </div>

</div>
{/* END GRID */}
</div>

</section>

{/* TRUST SECTION */}

{/* =========================
      TRUST SECTION
========================= */}

<section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 md:pb-20">

  <div className="border-t border-white/10 pt-8 md:pt-10">

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">

      {[
        {
          icon: "🌍",
          title: "100% Verified",
          desc: "Trusted global registries",
        },
        {
          icon: "✔️",
          title: "Global Impact",
          desc: "Projects in 6+ countries",
        },
        {
          icon: "🔒",
          title: "Transparent",
          desc: "On-chain & verifiable",
        },
        {
          icon: "🌱",
          title: "Climate Positive",
          desc: "Real impact, real change",
        },
      ].map((item) => (

        <div
          key={item.title}
          className="flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/10"
        >

          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xl">
            {item.icon}
          </div>

          <h4 className="mt-3 text-xs sm:text-sm md:text-base font-semibold text-white">
            {item.title}
          </h4>

          <p className="mt-1 text-[11px] sm:text-xs md:text-sm text-gray-400 leading-5">
            {item.desc}
          </p>

        </div>

      ))}

    </div>

  </div>

</section>
</div>

</div>
);
};

export default Solutions;
