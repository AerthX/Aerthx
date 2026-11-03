import React, { useEffect, useState } from "react";
import graph from "../assets/graph.jpg";
import goldstandard from "../assets/gold-standard.png";
import verra from "../assets/Verra-Logo.png";
import heroBg from "../assets/new_aerthx.jpeg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const IconWrapper = ({ children, className }) => (
    <div className={`w-14 h-14 mb-4 flex items-center justify-center rounded-full bg-emerald-500/10 ${className}`}>
        {children}
    </div>
);

const CertifiedIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.275a1.125 1.125 0 011.264-.076l1.248.8a1.125 1.125 0 010 1.954l-1.248.8a1.125 1.125 0 01-1.264-.076l-1.632-1.088a1.125 1.125 0 01-.52-1.558l.64-1.28A1.125 1.125 0 0115.618 7.725z" />
    </svg>
);

const BriefcaseIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

const LeafIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a4 4 0 01-5.657 0" />
    </svg>
);


const testimonials = [
    {
        quote: "AerthX made our goal of becoming a carbon-neutral enterprise incredibly straightforward. The verified projects gave us full confidence in our investment.",
        name: "Alex Johnson",
        title: "Chief Sustainability Officer, TechCorp",
        avatar: "https://i.pravatar.cc/150?img=6"
    },
    {
        quote: "The seamless integration into our e-commerce platform allowed us to offer carbon offsets to every customer. It’s been a massive win for our brand image.",
        name: "Sarah Chen",
        title: "Founder, Eco-Goods Inc.",
        avatar: "https://i.pravatar.cc/150?img=3"
    },
    {
        quote: "I love the ability to track my personal emissions and offset them instantly. AerthX is the most user-friendly platform I've found for climate action.",
        name: "Michael Davis",
        title: "Freelance Designer & Climate Advocate",
        avatar: "https://i.pravatar.cc/150?img=1"
    },
];

const AnimatedStat = ({ start, end, label, unit }) => {
    const [displayNumber, setDisplayNumber] = useState(start);

    useEffect(() => {
        let current = start;
        const increment = (end - start) / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                setDisplayNumber(end);
                clearInterval(timer);
            } else {
                setDisplayNumber(Math.floor(current));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [start, end]);

  return (
  <div className="flex min-w-0 flex-col items-center p-1 text-center sm:p-4">
    <h3 className="mb-2 flex max-w-full flex-wrap items-baseline justify-center gap-x-1 text-[clamp(1.25rem,6vw,2.75rem)] font-extrabold bg-clip-text text-transparent bg-linear-to-r from-emerald-300 to-lime-500 drop-shadow-md sm:text-4xl lg:text-6xl">
      <span className="whitespace-nowrap">
        {displayNumber.toLocaleString()}
      </span>
      <span className="whitespace-nowrap text-sm font-light text-gray-200 sm:text-2xl lg:text-3xl">
        {unit}
      </span>
    </h3>

    <p className="max-w-full text-center text-[10px] font-medium uppercase leading-4 tracking-wider text-gray-400 sm:text-sm lg:text-lg">
      {label}
    </p>
  </div>
);
};


export default function Home() {
    const [remainingTons, setRemainingTons] = useState(0);
    const [totalTons, setTotalTons] = useState(0); 
    const userType = useSelector((state) => state.auth.userType);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchRemainingTons = async () => {
            try {
                const initialTons = 1000000; 
                setRemainingTons(initialTons);

                const res = await axios.get(`${import.meta.env.VITE_API_URL}/carbon-credits/total-tons`);
                const actualTons = res.data.remainingTons || 0;
                
                const duration = 2000;
                const steps = 50;
                const stepTime = duration / steps;
                const increment = (actualTons - initialTons) / steps;
                let current = initialTons;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= actualTons) {
                        setRemainingTons(actualTons);
                        clearInterval(timer);
                    } else {
                        setRemainingTons(Math.floor(current));
                    }
                }, stepTime);

                return () => clearInterval(timer);
            } catch (error) {
                console.error("Error fetching remaining tons:", error.message);
                setRemainingTons(12345678); 
            }
        };
        fetchRemainingTons();
    }, []);

    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 8000); 
        return () => clearInterval(interval);
    }, []);


    const trustItems = [
        { label: "Verra Certified Credits" },
        { label: "Gold Standard" },
        { label: "UN SDGs" },
        { label: "ISO 14064" },
    ];

    const handleCalculatorClick = (event) => {
        event.preventDefault();
        const howItWorksSection = document.getElementById("how-it-works");
        if (howItWorksSection) {
            howItWorksSection.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }
        navigate("/MarketplaceHero");
    };

    const handleWaitlistClick = (event) => {
        const waitlistSection = document.getElementById("waitlist");
        if (waitlistSection) {
            event.preventDefault();
            waitlistSection.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }
    };

    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col items-center overflow-x-clip bg-gray-50 font-sans antialiased">
            <section
                className="relative min-h-[auto] sm:min-h-[700px] lg:min-h-[calc(100vh-6rem)] w-full overflow-hidden"
                style={{
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
<div className="absolute inset-0 bg-gradient-to-r from-[#08130D]/95 via-[#08130D]/80 to-transparent z-0"></div>
                <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400 }}>
                    <div className="grid min-w-0 grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="max-w-2xl"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="inline-flex max-w-full items-center gap-2 rounded-full bg-slate-900/85 px-3 py-2 text-xs font-semibold text-slate-200 shadow-xl shadow-black/30 sm:px-4 sm:text-sm"
                            >
                                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2E8B57]" />
                                Verified. Transparent. Impactful.
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.16 }}
                                className="mt-6 sm:mt-8 text-[clamp(2.35rem,8.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white lg:text-[72px]"
                            >
                               <span className="block">Carbon Credits for</span>
<span className="block">
  <span className="bg-linear-to-r from-[#1A5C38] to-[#2E8B57] bg-clip-text text-transparent">
    Modern
  </span>{" "}
  Businesses
</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.24 }}
                                className="mt-5 sm:mt-8 w-full max-w-[560px] text-sm leading-6 text-slate-200 sm:text-lg sm:leading-8"
                            >
                                Purchase verified carbon credits from trusted global registries. Transparent pricing. Instant documentation.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.32 }}
                                className="mt-7 sm:mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
                            >
                                <Link
                                    to="/MarketplaceHero"
                                    className="group inline-flex w-full items-center justify-center rounded-xl bg-[#22C55E] px-5 py-3.5 text-sm sm:px-7 sm:py-4 sm:text-base text-base font-semibold text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-[#4ADE80] focus:outline-none sm:w-auto"
                                >
                                    Buy Carbon Credits
                                    <span className="ml-3 inline-flex transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                                    className="inline-flex w-full items-center justify-center rounded-xl bg-transparent border border-[rgba(255,255,255,0.2)] px-5 py-3.5 text-sm sm:px-7 sm:py-4 sm:text-base font-semibold text-white transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)] focus:outline-none sm:w-auto"
                                >
                                    <span className="mr-3 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white/40 bg-white/10 text-sm text-white">
                                        ▶
                                    </span>
                                    How It Works
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 22 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.38 }}
                                className="mt-8 sm:mt-10 w-full max-w-[680px] min-w-0"
                            >
                                <p className="text-[10px] leading-5 font-semibold uppercase tracking-[0.14em] text-slate-300/80 sm:text-sm sm:tracking-[0.25em]">Trusted by forward-thinking companies</p>
                                <div className="mt-4 flex flex-wrap items-center gap-4 sm:gap-6">
                                    <img src={verra} alt="Verra" className="h-8 w-auto grayscale opacity-80" />
                                    <img src={goldstandard} alt="Gold Standard" className="h-8 w-auto grayscale opacity-80" />
                                    <div className="flex h-8 items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 text-sm font-semibold tracking-wide text-slate-200/90">
                                        UN SDGs
                                    </div>
                                    <div className="flex h-8 items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 text-sm font-semibold tracking-wide text-slate-200/90">
                                        ISO 14064
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.75, delay: 0.26 }}
                            className="relative"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="rounded-lg border border-[rgba(46,139,87,0.12)] bg-[rgba(16,185,129,0.06)] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
                            >
                                <div className="min-w-0 rounded-lg border border-[rgba(46,139,87,0.10)] bg-[rgba(16,185,129,0.04)] p-2.5 sm:p-4 shadow-[0_8px_24px_rgba(0,0,0,0.14)]">
                                    <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
                            
                                    
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-3">
                                        <div className="group min-w-0 rounded-xl sm:rounded-2xl border border-white/8 bg-[#182622]/90 backdrop-blur-xl p-3 sm:p-5 shadow-[0_20px_45px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#21352F] hover:border-white/15">
                                            <div className="flex min-w-0 flex-col items-start gap-2">
                                               <div className="inline-flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-2xl border border-[rgba(46,139,87,0.12)] bg-[rgba(16,185,129,0.14)] text-emerald-200">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                              <p className="w-full min-w-0 text-[9px] font-semibold uppercase leading-4 tracking-[0.08em] text-emerald-200 sm:text-xs sm:tracking-[0.18em]">
  Verified Credits
</p>
                                            </div>
                                            <p className="mt-3 text-xl font-bold leading-tight text-white sm:mt-4 sm:text-2xl">22,001</p>
                                            <p className="mt-2 text-xs leading-5 text-emerald-200 sm:text-sm">tCO₂e • Verified</p>
                                        </div>

                                        <div className="group min-w-0 rounded-xl sm:rounded-2xl border border-white/8 bg-[#182622]/90 backdrop-blur-xl p-3 sm:p-5 shadow-[0_20px_45px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#21352F] hover:border-white/15">
                                            <div className="flex min-w-0 flex-col items-start gap-2">
                                                <div className="inline-flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-2xl border border-[rgba(46,139,87,0.12)] bg-[rgba(16,185,129,0.14)] text-emerald-200">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                                                    </svg>
                                                </div>
                                                <p className="w-full min-w-0 text-[9px] font-semibold uppercase leading-4 tracking-[0.08em] text-emerald-200 sm:text-xs sm:tracking-[0.18em]">
  Carbon Projects
</p>
                                            </div>
                                            <p className="mt-3 text-xl font-bold leading-tight text-white sm:mt-4 sm:text-2xl">18</p>
                                            <p className="mt-2 text-xs leading-5 text-emerald-200 sm:text-sm">Across 6 countries</p>
                                        </div>

                                        <div className="group min-w-0 rounded-xl sm:rounded-2xl border border-white/8 bg-[#182622]/90 backdrop-blur-xl p-3 sm:p-5 shadow-[0_20px_45px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#21352F] hover:border-white/15">
                                            <div className="flex min-w-0 flex-col items-start gap-2">
                                                <div className="inline-flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-2xl border border-[rgba(46,139,87,0.12)] bg-[rgba(16,185,129,0.14)] text-emerald-200">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <p className="w-full min-w-0 text-[9px] font-semibold uppercase leading-4 tracking-[0.08em] text-emerald-200 sm:text-xs sm:tracking-[0.18em]">
  Businesses Served
</p>
                                            </div>
                                            <p className="mt-3 text-xl font-bold leading-tight text-white sm:mt-4 sm:text-2xl">150+</p>
                                            <p className="mt-2 text-xs leading-5 text-emerald-200 sm:text-sm">From 12+ industries</p>
                                        </div>

                                        <div className="group min-w-0 rounded-xl sm:rounded-2xl border border-white/8 bg-[#182622]/90 backdrop-blur-xl p-3 sm:p-5 shadow-[0_20px_45px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#21352F] hover:border-white/15">
                                            <div className="flex min-w-0 flex-col items-start gap-2">
                                                <div className="inline-flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-2xl border border-[rgba(46,139,87,0.12)] bg-[rgba(16,185,129,0.14)] text-emerald-200">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m4-4H8" />
                                                    </svg>
                                                </div>
                                                <p className="w-full min-w-0 text-[9px] font-semibold uppercase leading-4 tracking-[0.08em] text-emerald-200 sm:text-xs sm:tracking-[0.18em]">
  Transparency
</p>
                                            </div>
                                            <p className="mt-3 text-xl font-bold leading-tight text-white sm:mt-4 sm:text-2xl">100%</p>
                                            <p className="mt-2 text-xs leading-5 text-emerald-200 sm:text-sm">On-chain & Verifiable</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-24">
                <div className="max-w-7xl mx-auto">
                    <h2 className="mb-4 text-2xl font-extrabold leading-tight text-gray-900 text-center sm:text-3xl md:text-4xl lg:text-5xl">
                        Why Invest in <span className="text-emerald-600">Carbon Credits</span>?
                    </h2>
                   <p className="mx-auto mb-10 max-w-3xl px-2 text-center text-sm font-light leading-6 text-gray-600 sm:mb-14 sm:text-base sm:leading-7 md:mb-20 md:text-xl">
                        Offset your footprint, support sustainable projects, and contribute to a greener, more resilient future.
                    </p>

                    <div className="grid grid-cols-1 gap-5 text-center sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-10">
                        {[
                            { title: "Tangible Climate Action", desc: "Fund verified projects that actively reduce CO₂ emissions, support reforestation, and protect vital ecosystems.", icon: <LeafIcon /> },
                            { title: "Boost Your Brand & ESG", desc: "Demonstrate leadership in sustainability, improve your ESG rating, and appeal to a conscious market.", icon: <BriefcaseIcon /> },
                            { title: "Community & Biodiversity", desc: "Invest in projects that provide co-benefits like poverty reduction, clean water access, and biodiversity preservation.", icon: <CertifiedIcon /> },
                        ].map((card, i) => (
                            <div key={i} className="group min-w-0 rounded-xl border border-gray-100 border-t-4 border-t-transparent bg-white p-6 shadow-lg transition duration-300 ease-in-out hover:border-t-emerald-500 hover:shadow-xl sm:p-8 lg:p-10">
                                <IconWrapper className="mx-auto bg-linear-to-r from-emerald-500/10 to-green-500/10">
                                    {card.icon}
                                </IconWrapper>
                                <h3 className="mb-3 text-lg font-bold leading-snug text-gray-900 transition duration-300 group-hover:text-emerald-600 sm:text-xl lg:text-2xl">
                                    {card.title}
                                </h3>
                                <p className="text-sm leading-6 text-gray-600 sm:text-base sm:leading-7 lg:text-lg">
  {card.desc}
</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative w-full overflow-hidden bg-gray-900 py-12 sm:py-16 lg:py-24">
                <div className="absolute top-0 left-0 w-1/3 h-full bg-emerald-500 opacity-[0.05] blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-1/3 h-full bg-lime-500 opacity-[0.05] blur-3xl"></div>

                <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-white sm:px-6 lg:px-8">
                    <h2 className="mb-10 text-center text-2xl font-extrabold sm:mb-12 sm:text-3xl md:text-4xl lg:mb-16 lg:text-5xl">
                        Our Verified <span className="text-green-400">Impact</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-8">
                        <div className="min-w-0 p-3 sm:p-5 lg:p-6 bg-white/5 rounded-xl backdrop-blur-md border border-transparent transition hover:scale-[1.02] duration-500 relative overflow-hidden group hover:border-emerald-500/50 shadow-xl">
                            <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
                            <AnimatedStat start={0} end={35000} label="Tons CO₂ Offset" unit="k" />
                        </div>
                        <div className="min-w-0 p-3 sm:p-5 lg:p-6 bg-white/5 rounded-xl backdrop-blur-md border border-transparent transition hover:scale-[1.02] duration-500 relative overflow-hidden group hover:border-emerald-500/50 shadow-xl">
                            <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
                            <AnimatedStat start={0} end={120} label="Projects Supported" unit="+" />
                        </div>
                        <div className="min-w-0 p-3 sm:p-5 lg:p-6 bg-white/5 rounded-xl backdrop-blur-md border border-transparent transition hover:scale-[1.02] duration-500 relative overflow-hidden group hover:border-emerald-500/50 shadow-xl">
                            <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
                            <AnimatedStat start={0} end={150000} label="Trees Planted" unit="k" />
                        </div>
                        <div className="min-w-0 p-3 sm:p-5 lg:p-6 bg-white/5 rounded-xl backdrop-blur-md border border-transparent transition hover:scale-[1.02] duration-500 relative overflow-hidden group hover:border-emerald-500/50 shadow-xl">
                            <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
                            <AnimatedStat start={0} end={45} label="Global Partners" unit="+" />
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
                <h2 className="mb-10 text-center text-2xl font-extrabold text-gray-900 sm:mb-14 sm:text-3xl md:text-4xl lg:mb-20 lg:text-5xl">
                    The <span className="text-emerald-600">AerthX</span> Difference
                </h2>
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                    
                    <div className="group flex min-w-0 flex-col items-center rounded-xl border border-gray-100 bg-white p-6 text-center shadow-lg transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-2xl sm:p-8 lg:p-10"className="flex flex-col items-center bg-white p-10 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-emerald-300 transition duration-300 transform hover:-translate-y-2 group">
                        <IconWrapper className="bg-emerald-500/20 group-hover:bg-emerald-500/30 transition duration-300">
                            <CertifiedIcon className="group-hover:text-emerald-700 transition duration-300" />
                        </IconWrapper>
                        <h3 className="mb-3 text-lg font-bold leading-snug text-gray-900 sm:text-xl">Verified & Certified</h3>
                        <p className="text-center text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">All credits come from rigorously verified and certified projects, ensuring real, measurable climate impact you can trust.</p>
                    </div>

                    <div className="group flex min-w-0 flex-col items-center rounded-xl border border-gray-100 bg-white p-6 text-center shadow-lg transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-2xl sm:p-8 lg:p-10">
                        <IconWrapper className="bg-emerald-500/20 group-hover:bg-emerald-500/30 transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-4-4h.01M9 21h6a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
                            </svg>
                        </IconWrapper>
                        <h3 className="mb-3 text-lg font-bold leading-snug text-gray-900 sm:text-xl">Instant Transparency</h3>
                        <p className="text-center text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">Get real-time reports to track your offsets and environmental progress instantly, perfect for audits and ESG goals.</p>
                    </div>

                    <div className="group flex min-w-0 flex-col items-center rounded-xl border border-gray-100 bg-white p-6 text-center shadow-lg transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-2xl sm:p-8 lg:p-10">
                        <IconWrapper className="bg-emerald-500/20 group-hover:bg-emerald-500/30 transition duration-300">
                             <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5m2 7h2.5a2.5 2.5 0 002.5-2.5V11" />
                            </svg>
                        </IconWrapper>
                        <h3 className="mb-3 text-lg font-bold leading-snug text-gray-900 sm:text-xl">Global Portfolio</h3>
                        <p className="text-center text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">Access a diverse portfolio of global projects, allowing you to invest in a broad range of verified climate solutions.</p>
                    </div>
                    
                </div>
            </section>

            <section className="relative w-full bg-gray-900 py-12 text-white sm:py-16 lg:py-24">
                <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col items-center gap-10 px-4 sm:px-6 lg:flex-row lg:justify-between lg:gap-12 lg:px-8">
                    
                    <div className="flex w-full min-w-0 max-w-lg flex-col items-center text-center lg:items-start lg:text-left">
                        <h2 className="mb-6 text-2xl font-extrabold leading-tight tracking-tight drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">
                            Live Carbon Credits <span className="text-emerald-400">Inventory</span>
                        </h2>
                        <p className="mb-6 flex max-w-full flex-wrap items-baseline justify-center gap-x-2 text-4xl font-black text-emerald-400 drop-shadow-2xl sm:text-6xl lg:mb-8 lg:justify-start lg:text-7xl xl:text-8xl">
                            {remainingTons.toLocaleString()} 
                            <span className="text-xl font-light text-white sm:text-2xl lg:text-4xl">Tons CO₂</span>
                        </p>
                        <p className="mb-8 max-w-md text-sm font-light leading-6 text-gray-300 sm:text-base sm:leading-7 lg:mb-10 lg:text-xl">
                            Real-time inventory of verified credits ready for immediate offset. Secure your climate commitment today.
                        </p>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
                            <Link to='/MarketplaceHero' 
                                className="bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-10 rounded-full shadow-xl shadow-emerald-500/30 transition duration-300 transform hover:scale-105"
                            >
                                Buy Credits
                            </Link>
                            <Link
                                to='/MarketplaceHero'
                                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-4 px-10 rounded-full shadow-xl shadow-black/30 transition duration-300 transform hover:scale-105 border-2 border-gray-700 hover:border-emerald-500 text-center"
                            >
                                Track Usage
                            </Link>
                        </div>
                    </div>
                    
                    <div className="relative w-full min-w-0 max-w-xl rounded-2xl border border-emerald-600/50 bg-white/5 p-3 shadow-2xl shadow-emerald-900/50 backdrop-blur-md group sm:p-5 lg:p-6">
                        <div className="absolute inset-0 bg-emerald-500 opacity-10 blur-3xl rounded-xl"></div>
                        <img src={graph} alt="Carbon credit historical graph" className="w-full h-auto rounded-xl relative transition duration-500 group-hover:scale-[1.01]" />
                    </div>

                </div>
            </section>

            <section id="how-it-works" className="py-12 sm:py-16 md:py-24 bg-gray-50 w-full">
                <div className="text-center">
   <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

  {/* Heading */}
  <div className="mb-10 text-center sm:mb-12 lg:mb-16">
    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#22C55E] sm:text-sm sm:tracking-[0.2em]">
      HOW AERTHX WORKS
    </p>

    <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
      Simple. Transparent. Impactful.
    </h2>
  </div>

  <div className="relative">

    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-8">

      {[
        {
          icon: "🍃",
          title: "Choose Credits",
          desc: "Explore verified carbon credits from global climate projects.",
        },
        {
          icon: "🛒",
          title: "Make Payment",
          desc: "Secure payment with transparent pricing and instant confirmation.",
        },
        {
          icon: "📄",
          title: "Get Documentation",
          desc: "Instantly receive retirement certificate and ownership records.",
        },
        {
          icon: "🌿",
          title: "Create Impact",
          desc: "Track your environmental impact and achieve your net zero goals.",
        },
      ].map((step, i) => (
        <div
          key={i}
          className="relative flex flex-col items-center text-center group"
        >

          {/* Arrow */}
          {i !== 3 && (
            <div className="hidden lg:flex absolute top-10 -right-7 text-slate-300 text-3xl group-hover:text-[#22C55E] transition-colors">
              →
            </div>
          )}

          {/* Icon Circle */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#22C55E]/10 bg-[#22C55E]/10 text-3xl shadow-sm transition-all duration-300 group-hover:bg-[#22C55E] group-hover:text-white group-hover:scale-110 sm:h-20 sm:w-20 sm:text-4xl">
            {step.icon}
          </div>

          {/* Number */}
          <p className="mt-5 text-lg font-bold leading-snug text-slate-900 sm:mt-8 sm:text-xl">
            {i + 1}. {step.title}
          </p>

          {/* Description */}
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
            {step.desc}
          </p>

        </div>
      ))}
    </div>
  </div>

</div> </div>
            </section>
            
            <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
                <h2 className="mb-10 text-center text-2xl font-extrabold text-gray-900 sm:mb-12 sm:text-3xl md:text-4xl lg:mb-16 lg:text-5xl">
                    Who <span className="text-emerald-600">We Empower</span>
                </h2>
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
                    
                    {[
                        { title: "Corporates & Enterprises", desc: "Meet regulatory and ESG goals with verifiable carbon offsets and comprehensive reporting.", icon: '🏢' },
                        { title: "E-Commerce & Startups", desc: "Integrate offsetting directly into your product delivery for a transparent, climate-positive customer experience.", icon: '🛒' },
                        { title: "Individuals & Freelancers", desc: "Track and offset personal emissions from travel, energy, and consumption easily and reliably.", icon: '👤' },
                        { title: "Educational Institutions", desc: "Promote sustainability by supporting real environmental projects and educating your community on climate action.", icon: '📚' },
                    ].map((card, i) => (
                        <div key={i} className="group relative min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-7 lg:p-8">
                            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="mb-3 text-2xl text-emerald-600 sm:text-3xl">{card.icon}</div>
                            <h3 className="mb-2 text-base font-extrabold leading-snug text-gray-900 sm:text-lg">{card.title}</h3>
                            <p className="text-sm leading-6 text-gray-600 sm:leading-7">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="w-full bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
                <h2 className="mb-10 text-center text-2xl font-extrabold text-gray-900 sm:mb-14 sm:text-3xl md:text-4xl lg:mb-20 lg:text-5xl">
                    Client <span className="text-emerald-600">Testimonials</span>
                </h2>
                <div className="mx-auto w-full max-w-4xl min-w-0">
                    <div className="relative flex min-h-[380px] flex-col justify-center overflow-hidden rounded-xl border border-gray-100 bg-white p-4 pb-12 shadow-xl sm:min-h-[340px] sm:p-8 sm:pb-14 lg:p-12">
                        
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                               className={`absolute inset-0 overflow-y-auto p-5 pb-14 transition-opacity duration-700 ease-in-out sm:p-8 sm:pb-16 lg:p-12 lg:pb-16
${index === currentTestimonialIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl opacity-50 z-0"></div>

                                <p className="relative z-10 mb-6 text-base italic leading-7 text-gray-700 sm:mb-8 sm:text-lg sm:leading-8 lg:text-xl">
                                    "{testimonial.quote}"
                                </p>
                                <div className="relative z-10 mt-5 flex min-w-0 items-center gap-3 sm:mt-6 sm:gap-4">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-emerald-400 shadow-md sm:h-14 sm:w-14" />
                                    <div>
                                        <p className="break-words text-base font-bold text-emerald-700 sm:text-lg">{testimonial.name}</p>
                                        <p className="break-words text-xs leading-5 text-gray-500 sm:text-sm">{testimonial.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonialIndex(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${index === currentTestimonialIndex ? 'bg-emerald-600 scale-110 shadow-md' : 'bg-gray-300 hover:bg-gray-400'}`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                    </div>
                </div>
            </section>
            
            <section className="w-full bg-white px-4 py-12 text-center sm:px-6 sm:py-16 lg:py-20">
                <h2 className="mb-8 text-2xl font-extrabold text-gray-900 sm:mb-10 sm:text-3xl md:text-4xl lg:mb-12 lg:text-5xl">
                    Certified <span className="text-emerald-600">Integrity</span>
                </h2>
                <p className="mx-auto mb-10 max-w-3xl px-2 text-sm font-light leading-6 text-gray-600 sm:mb-12 sm:text-base sm:leading-7 lg:mb-16 lg:px-4 lg:text-xl">
                    We source certified carbon credits from globally recognized registries, ensuring environmental integrity and transparency.
                </p>
                <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-16">
                    
                    <div className="flex h-28 w-full max-w-[220px] items-center justify-center rounded-xl bg-white p-5 shadow-lg grayscale transition duration-500 ease-in-out hover:scale-[1.02] hover:shadow-emerald-200 hover:grayscale-0 sm:h-36 sm:max-w-[240px] sm:p-6">
                        <img src={verra} alt="Verra" className="max-h-full max-w-full object-contain" />
                    </div>

                    <div className="flex h-28 w-full max-w-[220px] items-center justify-center rounded-xl bg-white p-5 shadow-lg grayscale transition duration-500 ease-in-out hover:scale-[1.02] hover:shadow-emerald-200 hover:grayscale-0 sm:h-36 sm:max-w-[240px] sm:p-6">
                        <img src={goldstandard} alt="Gold Standard" className="max-h-full max-w-full object-contain" />
                    </div>
                </div>
            </section>

            <section 
              className="relative z-10 w-full px-4 py-12 text-center text-white sm:px-6 sm:py-16 lg:py-24"
                style={{ 
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
                    boxShadow: '0 -5px 20px rgba(0,0,0,0.1)'
                }}
            >
                <div className="mx-auto w-full max-w-4xl min-w-0">
                    <h2 className="mb-5 text-2xl font-extrabold leading-tight tracking-tight drop-shadow-md sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
                        Ready to Begin Your <span className="text-white drop-shadow-lg">Net-Zero Journey</span>?
                    </h2>
                    <p className="mx-auto mb-8 max-w-3xl text-sm font-light leading-6 text-green-100 sm:mb-10 sm:text-lg sm:leading-7 md:mb-12 md:text-2xl">
                        Join thousands of businesses making a tangible difference. Start your climate-positive journey with AerthX today.
                    </p>
                    <div className="flex w-full flex-col justify-center gap-3 sm:flex-row sm:gap-5">
                        
                        <Link
                            to="/pricing"
                            className="group inline-flex items-center justify-center border-2 w-full sm:w-auto border-white bg-white text-emerald-700 font-bold py-4 px-10 rounded-full transition-all duration-300 ease-in-out hover:bg-transparent hover:text-white hover:border-white shadow-xl shadow-black/30 text-lg transform hover:scale-105"
                        >
                            View Pricing Plans
                        </Link>

                        <Link
                            to="/contactus"
                            className="group inline-flex items-center justify-center border-2 w-full sm:w-auto border-white text-white font-bold py-4 px-10 rounded-full transition-all duration-300 ease-in-out 
                                        hover:bg-white hover:text-emerald-700 shadow-xl shadow-black/30 text-lg transform hover:scale-105"
                        >
                            Contact Our Team
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}