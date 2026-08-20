import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCreditCard,
  FaPaypal,
  FaGooglePlay,
  FaCheckCircle,
  FaLock,
  FaShieldAlt,
  FaLeaf,
  FaPlus,
  FaMinus,
  FaRegSave,
  FaUniversity,
  FaGoogle,
  FaArrowLeft,
  FaTags,
  FaCalculator,
  FaChartLine,
  FaInfoCircle,
  FaDollarSign,
  FaCalendarAlt,
  FaMoneyBillAlt
} from "react-icons/fa";
import PaymentCore from "../shared/payment/PaymentCore";
import { SiPhonepe } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";


const StyledCard = ({ children, className = "", title, icon: Icon, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className={`relative p-6 lg:p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 ${className}`}
  >
    {title && (
      <div className="mb-4 pb-4 border-b border-gray-100">
        <h3 className="text-2xl font-extrabold text-gray-800 flex items-center">
          {Icon && <Icon className="text-green-600 mr-3" size={24} />}
          {title}
        </h3>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
    )}
    {children}
  </motion.div>
);

const formatRupees = (amount) => {
  const raw = typeof amount === "number" && !Number.isNaN(amount) ? amount : 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(raw);
};


const PaymentFormForGateway = ({
  subtotal,
  onSuccessNavigate = null,
  defaultName = "",
  defaultEmail = "",
  allowSaveCard = true,
}) => {
  const [selectedMethod, setSelectedMethod] = useState("credit_card");
  const [formData, setFormData] = useState({
    fullName: defaultName,
    email: defaultEmail,
    companyName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    netBankingBank: "",
  });
  const [saveCard, setSaveCard] = useState(false);

  const GST_PERCENTAGE = 0.18;

  const paymentFees = useMemo(
    () => ({
      credit_card: {
        platformFeePercentage: 0.05,
        gatewayFeePercentage: 0.02,
        gatewayFeeFixed: 25,
        label: "Card",
        icon: FaCreditCard,
      },
      paypal: {
        platformFeePercentage: 0.04,
        gatewayFeePercentage: 0.03,
        gatewayFeeFixed: 30,
        label: "PayPal",
        icon: FaPaypal,
      },
      google_pay: {
        platformFeePercentage: 0.03,
        gatewayFeePercentage: 0.01,
        gatewayFeeFixed: 20,
        label: "GPay",
        icon: FaGoogle,
      },
      phonepe: {
        platformFeePercentage: 0.035,
        gatewayFeePercentage: 0.015,
        gatewayFeeFixed: 15,
        label: "PhonePe",
        icon: SiPhonepe,
      },
      net_banking: {
        platformFeePercentage: 0.02,
        gatewayFeePercentage: 0.005,
        gatewayFeeFixed: 10,
        label: "Net Banking",
        icon: FaUniversity,
      },
    }),
    []
  );

  const paymentDetails = useMemo(() => {
    const methodFees = paymentFees[selectedMethod] || {};
    const {
      platformFeePercentage = 0,
      gatewayFeePercentage = 0,
      gatewayFeeFixed = 0,
    } = methodFees;

    const platformFee = subtotal * platformFeePercentage;
    const paymentGatewayFee = subtotal * gatewayFeePercentage + gatewayFeeFixed;
    const baseForTax = subtotal + platformFee + paymentGatewayFee;
    const gst = baseForTax * GST_PERCENTAGE;
    const grandTotal = subtotal + platformFee + paymentGatewayFee + gst;

    return {
      platformFee,
      paymentGatewayFee,
      gst,
      grandTotal,
    };
  }, [selectedMethod, subtotal, paymentFees]);

  const { platformFee, paymentGatewayFee, gst, grandTotal } = paymentDetails;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email) {
      alert("Please provide name and email.");
      return;
    }

    if (
      selectedMethod === "credit_card" &&
      (!formData.cardNumber || !formData.expiryDate || !formData.cvc)
    ) {
      alert("Please fill in all card details.");
      return;
    }

    if (selectedMethod === "net_banking" && !formData.netBankingBank) {
      alert("Please select a bank for Net Banking.");
      return;
    }

    const payload = {
      paymentMethod: paymentFees[selectedMethod].label,
      amount: grandTotal,
      customer: {
        name: formData.fullName,
        email: formData.email,
        company: formData.companyName,
      },
      saveCard,
    };

    
    alert(`Processing payment of ${formatRupees(grandTotal)} via ${paymentFees[selectedMethod].label}.`);

    if (onSuccessNavigate) {
      onSuccessNavigate();
    }
  };

  const renderInput = (name, label, type = "text", required = false, pattern = null, inputMode = null) => (
    <div className="relative z-0 w-full mb-4 group">
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleInputChange}
        required={required}
        pattern={pattern}
        inputMode={inputMode}
        placeholder=" "
        aria-label={label}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-green-500 peer"
      />
      <label
        htmlFor={name}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {label}
      </label>
    </div>
  );

  return (
    <StyledCard 
        title="Payment Information" 
        icon={FaMoneyBillAlt} 
        description="Select your method and enter required payment and contact details."
    >
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-3 mb-6">
        {Object.keys(paymentFees).map((id) => {
          const method = paymentFees[id];
          const Icon = method.icon;
          return (
            <motion.button
              key={id}
              onClick={() => setSelectedMethod(id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 transition-all duration-300 relative focus:outline-none
              ${selectedMethod === id ? "bg-green-600 text-white shadow-lg border-green-700" : "border-gray-200 text-gray-600 hover:border-green-400 bg-gray-50 hover:bg-white"}`}
              aria-pressed={selectedMethod === id}
            >
              <Icon size={26} className="mb-2" />
              <span className="text-xs font-semibold">{method.label}</span>
              <AnimatePresence>
                {selectedMethod === id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 bg-white rounded-full p-0.5"
                  >
                    <FaCheckCircle className="text-green-600" size={14} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <form onSubmit={handlePaymentSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {renderInput("fullName", "Full Name", "text", true)}
          {renderInput("email", "Email Address", "email", true)}
        </div>
        {renderInput("companyName", "Company (optional)")}

        <AnimatePresence mode="wait">
          {selectedMethod === "credit_card" && (
            <motion.div
              key="card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden p-4 mt-4 border border-green-100 rounded-lg bg-green-50 shadow-inner"
            >
              <h4 className="text-md font-semibold text-green-700 mb-3 border-b border-green-200 pb-2">Card Details</h4>
              {renderInput("cardNumber", "Card Number", "text", true, "[0-9]{13,19}", "numeric")}
              <div className="grid grid-cols-2 gap-4">
                {renderInput("expiryDate", "Expiry (MM/YY)", "text", true, "(0[1-9]|1[0-2])\\/[0-9]{2}", "numeric")}
                {renderInput("cvc", "CVC", "text", true, "[0-9]{3,4}", "numeric")}
              </div>

              {allowSaveCard && (
                <div className="flex items-center mt-3 mb-4">
                  <input
                    id="saveCard"
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                    <FaRegSave className="inline mr-1 text-gray-500" /> Save card for future purchases
                  </label>
                </div>
              )}
            </motion.div>
          )}

          {selectedMethod === "net_banking" && (
            <motion.div
              key="net"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50"
            >
              <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Net Banking Details</h4>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select your bank</label>
              <select
                name="netBankingBank"
                value={formData.netBankingBank}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">Choose a bank...</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="SBI">State Bank of India</option>
                <option value="AXIS">Axis Bank</option>
                <option value="KOTAK">Kotak Mahindra Bank</option>
                <option value="OTHER">Other</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="bg-gray-50 p-5 rounded-xl mt-8 space-y-3 shadow-md border border-gray-100"
        >
          <h4 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
            <FaCalculator className="text-gray-500 mr-2" size={18} /> Payment Breakdown
          </h4>
          <div className="flex justify-between text-base">
            <span className="text-gray-700">Subtotal</span>
            <span className="font-bold text-gray-900">{formatRupees(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Platform Fee</span>
            <span className="font-medium text-gray-800">{formatRupees(platformFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Gateway Processing Fee</span>
            <span className="font-medium text-gray-800">{formatRupees(paymentGatewayFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">GST ({GST_PERCENTAGE * 100}%)</span>
            <span className="font-medium text-gray-800">{formatRupees(gst)}</span>
          </div>

          <div className="pt-4 border-t-2 border-green-200 mt-4">
            <div className="flex flex-col items-center justify-center">
              <div className="text-md text-green-800 font-medium mb-1">Total Amount Due</div>
              <div className="text-4xl font-extrabold text-green-700 mb-6">{formatRupees(grandTotal)}</div>
              
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-700 text-white text-xl font-extrabold rounded-xl shadow-xl hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ring-4 ring-green-200 ring-opacity-50"
              >
                <FaDollarSign className="inline mr-2" size={20} /> Pay Now
              </button>
            </div>
          </div>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5"><FaLock size={14} className="text-green-400" /><span>Secure Payment</span></div>
          <div className="flex items-center gap-1.5"><FaShieldAlt size={14} className="text-green-400" /><span>PCI Compliant</span></div>
          <div className="flex items-center gap-1.5"><FaTags size={14} className="text-green-400" /><span>Transparent Fees</span></div>
        </div>
      </form>
    </StyledCard>
  );
};


const PricingGateway = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const [loadingPlans, setLoadingPlans] = useState(false);
  const [availablePlans, setAvailablePlans] = useState(null);
  const [fetchedProject, setFetchedProject] = useState(null);
  const [tons, setTons] = useState(1);
  const [perks, setPerks] = useState({});
  const [subtotalFromState, setSubtotalFromState] = useState(null);

  const source = state.source || "pricing"; 
  const incomingPlanName = state.planName || state.plan || (state.planNameFromPricing || "Basic");
  const incomingPrice = state.price || state.totalPrice || state.planPrice || null;
  const incomingTons = state.tons || state.creditsTons || null;
  const incomingPerks = state.selectedPerks || state.perks || {};
  const isCustomPlan = incomingPlanName === "Enterprise" && source === "pricing";

  useEffect(() => {
    if (incomingTons) setTons(incomingTons);
    if (incomingPerks && Object.keys(incomingPerks).length) setPerks(incomingPerks);
    if (incomingPrice) setSubtotalFromState(Number(incomingPrice));
  }, [incomingTons, incomingPerks, incomingPrice]);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoadingPlans(true);
        const mockPlans = {
          Basic: {
            id: "basic", monthly: 499, yearly: 499 * 12 * 0.9, credits: 100,
            description: "Starter plan for small teams, focusing on core reporting and essential tools.",
            features: ["100 Monthly Credits", "Basic Analytics Dashboard", "Email Support", "Monthly Impact Reports"],
            includedPerks: ["digital_badge"] 
          },
          Pro: {
            id: "pro", monthly: 1999, yearly: 1999 * 12 * 0.9, credits: 1000,
            description: "Growth plan for scaling teams, offering comprehensive analytics, advanced features, and priority support.",
            features: ["1000 Monthly Credits", "Advanced Analytics Dashboard", "Priority Email & Chat Support", "Quarterly Strategy Session", "Customizable Reports", "API Access"],
            includedPerks: ["annual_cert", "csr_report"]
          },
          Enterprise: {
            id: "enterprise", monthly: "Custom", yearly: "Custom", credits: "Unlimited",
            description: "Custom solutions for large organizations with dedicated account management, full compliance, and bespoke integrations. Price listed is for display and will be customized.",
            features: ["Unlimited Credits", "Dedicated Account Manager", "Full ESG & SDG Reporting", "BRSR Compliance", "On-demand Training", "Custom Integrations", "24/7 Phone Support"],
            includedPerks: ["esg_reports", "sdg_reports", "brsr", "advanced_analytics"]
          },
        };
        await new Promise((r) => setTimeout(r, 250)); 
        setAvailablePlans(mockPlans);
      } finally {
        setLoadingPlans(false);
      }
    };

    loadPlans();
  }, []);

  const API = import.meta.env?.VITE_API_URL || "/api";

  useEffect(() => {
    if (state?.projectId) {
      const mockProject = {
          _id: state.projectId,
          name: "Amazon Reforestation Project",
          location: "Brazil",
          pricePerTonUSD: 10,
          verifiedStandard: "Verra",
          focus: "Biodiversity & Climate",
      };
      
      const CONVERSION_RATE_USD_TO_INR = 83.5;
      const projectPricePerTon = mockProject.pricePerTonUSD * CONVERSION_RATE_USD_TO_INR;

      setFetchedProject({ ...mockProject, pricePerTon: projectPricePerTon });
      
      if (!subtotalFromState) {
          setSubtotalFromState(Number(projectPricePerTon * (incomingTons || 1)));
      }
    }
  }, [state?.projectId, API, incomingTons, subtotalFromState]);

  const allPerksList = useMemo(() => [
    { id: "annual_cert", price: 500, label: "Annual Certification" },
    { id: "csr_report", price: 800, label: "CSR Report Generation" },
    { id: "dashboard", price: 300, label: "Advanced Dashboard Access" },
    { id: "notifications", price: 100, label: "Priority Notifications" },
    { id: "advanced_analytics", price: 1500, label: "Advanced Analytics" },
    { id: "esg_reports", price: 2500, label: "Full ESG Reports" },
    { id: "digital_badge", price: 150, label: "Digital Badge" },
    { id: "sdg_reports", price: 1800, label: "SDG Reports" },
    { id: "brsr", price: 3000, label: "BRSR Compliance" },
    { id: "limited_credits", price: 2000, label: "Limited Extra Credits" },
    { id: "download_cert", price: 200, label: "Downloadable Certificates" },
  ], []);

  const getPerkDetails = (perkId) => allPerksList.find(p => p.id === perkId);

  const planDetails = availablePlans?.[incomingPlanName];

  const basePlanPrice = useMemo(() => {
      if (source === "pricing" && planDetails) {
          if (state?.billing === "Yearly") return Number(planDetails.yearly || 0);
          return Number(planDetails.monthly || 0);
      }
      return Number(state?.base || 0); 
  }, [source, planDetails, state?.base, state?.billing]);


  const creditsPrice = useMemo(() => {
    if (source === "individual" && fetchedProject) {
        return Number(fetchedProject.pricePerTon) * Number(tons);
    }
    return 0;
  }, [source, fetchedProject, tons]);


  const perksTotal = useMemo(() => {
    if (isCustomPlan) return 0; 

    let total = 0;
    Object.keys(perks).forEach(perkId => {
        const isCurrentlyIncluded = planDetails?.includedPerks?.includes(perkId);
        if (perks[perkId] && !isCurrentlyIncluded) {
            total += (getPerkDetails(perkId)?.price || 0);
        }
    });
    return total;
  }, [perks, planDetails, isCustomPlan, getPerkDetails]);


  const computedSubtotal = useMemo(() => {
   
    if (subtotalFromState !== null) return Number(subtotalFromState);

    let total = 0;
    if (source === "individual") {
        total += Number(state?.base || 0);
    } else {
        total += basePlanPrice;
    }
    
    total += creditsPrice;
    
    total += perksTotal;

    return total;
  }, [subtotalFromState, source, state, creditsPrice, perksTotal, basePlanPrice]);


  const handleTonsChange = (newTons) => {
    const v = Math.max(1, Number(newTons) || 1);
    setTons(v);

    if (source === "individual" && fetchedProject) {
        setSubtotalFromState(Number(fetchedProject.pricePerTon * v));
    }
  };

  const goBack = () => navigate(-1);


  const renderPerks = (isIncluded) => {
    const filteredPerks = allPerksList.filter(p => {
        const selected = perks[p.id]; 
        const isCurrentlyIncluded = planDetails?.includedPerks?.includes(p.id); 
        
        if (isIncluded) {
            return isCurrentlyIncluded || (isCustomPlan && selected);
        } else {
            return selected && !isCurrentlyIncluded && !isCustomPlan;
        }
    });

    if (filteredPerks.length === 0) {
        if (isCustomPlan && isIncluded) {
            return <li className="text-sm text-gray-500 italic">All features and compliance tools are included in the custom Enterprise package.</li>
        }
        if (!isIncluded) {
            return <li className="text-sm text-gray-400 italic">No additional paid perks selected.</li>;
        }
        return <li className="text-sm text-gray-400 italic">No included perks in this plan tier.</li>;
    }

    return filteredPerks.map((p) => (
      <li key={p.id} className="flex justify-between items-center">
        <span className="flex items-center">
          <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" size={14} />
          {p.label}
        </span>
        {!isIncluded && !isCustomPlan && <span className="text-sm font-semibold text-gray-700">{formatRupees(p.price)}</span>}
        {isIncluded && <span className="text-sm font-medium text-green-600">Included</span>}
        {isCustomPlan && <span className="text-sm font-medium text-green-600">Custom</span>}
      </li>
    ));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-100 p-4 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white rounded-full shadow-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors transform hover:scale-[1.02]"
          >
            <FaArrowLeft size={14} /> Back to Selection
          </button>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-green-800 tracking-tight">
            Confirm Your Order
          </h1>
          <div className="w-48 hidden md:block" /> 
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">
            <StyledCard
              title={`${incomingPlanName} Order Summary`}
              icon={FaChartLine}
              description="Review your plan details, credits, and pricing breakdown before proceeding to payment."
            >
              <div className="mb-6 pb-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-gray-800 flex items-center">
                      <FaLeaf className="text-green-500 mr-2" size={18} />
                      {source === "individual" ? "Project Purchase" : "Subscription Plan"}
                  </span>
                  <span className="text-xl font-extrabold text-green-700">{incomingPlanName}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="flex items-center"><FaCalendarAlt className="mr-2" size={14} />Billing Cycle</span>
                    <span className="font-semibold">{state?.billing || (source === "pricing" ? "Monthly" : "One-Time")}</span>
                </div>
                {planDetails?.description && (
                  <p className="text-sm text-gray-500 mt-2 p-2 bg-gray-50 rounded-md border border-gray-100 flex items-center">
                    <FaInfoCircle className="text-blue-400 mr-2 flex-shrink-0" size={16} />
                    {planDetails.description}
                  </p>
                )}
              </div>

              <div className="mb-6 pb-4 border-b border-gray-100">
                  <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <FaCalculator className="text-blue-500 mr-2" size={18} /> Detailed Cost Calculation
                  </h4>
                  <div className="space-y-2">
                      <div className="flex justify-between items-center">
                          <span className="text-gray-700">{source === "individual" ? "Base Service Fee" : `${incomingPlanName} Plan Fee`}</span>
                          <span className="font-semibold text-gray-900">
                              {basePlanPrice > 0 ? formatRupees(basePlanPrice) : (isCustomPlan ? "Negotiated" : "Included")}
                          </span>
                      </div>

                      {source === "individual" && fetchedProject && (
                          <>
                            <div className="flex justify-between items-center text-sm text-gray-600 pl-4">
                                <span className="flex items-center"><FaLeaf className="mr-2" size={14} /> Project Price per Ton</span>
                                <span className="font-medium">{formatRupees(fetchedProject.pricePerTon)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">{tons} Tons of Carbon Credits</span>
                                <span className="font-semibold text-gray-900">{formatRupees(creditsPrice)}</span>
                            </div>
                            <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Adjust Quantity (Tons)</label>
                            <div className="flex items-center gap-3 w-48">
                                <button
                                    onClick={() => handleTonsChange(tons - 1)}
                                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="decrease tons"
                                    disabled={tons <= 1}
                                >
                                    <FaMinus size={12} />
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={tons}
                                    onChange={(e) => handleTonsChange(e.target.value)}
                                    className="w-full text-center rounded-lg border border-gray-300 p-2 text-md font-semibold focus:ring-green-500 focus:border-green-500"
                                />
                                <button
                                    onClick={() => handleTonsChange(tons + 1)}
                                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
                                    aria-label="increase tons"
                                >
                                    <FaPlus size={12} />
                                </button>
                            </div>
                          </>
                      )}

                      <div className="flex justify-between items-center">
                          <span className="text-gray-700">Additional Perks Cost</span>
                          <span className="font-semibold text-gray-900">{formatRupees(perksTotal)}</span>
                      </div>
                      
                      <div className="pt-3 border-t border-dashed border-gray-300 flex justify-between items-center mt-3">
                          <span className="text-lg font-bold text-gray-800">Calculated Subtotal</span>
                          <span className="text-2xl font-extrabold text-green-700">{formatRupees(computedSubtotal)}</span>
                      </div>
                  </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <FaCheckCircle className="text-green-500 mr-2" size={18} /> Included Features & Perks
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 ml-0 pl-0">
                      {(planDetails?.features || []).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <FaCheckCircle className="text-green-400 mr-2 flex-shrink-0" size={12} /> {feature}
                        </li>
                      ))}
                      {renderPerks(true)}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <FaPlus className="text-yellow-500 mr-2" size={18} /> Additional (Paid) Perks
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 ml-0 pl-0">
                      {renderPerks(false)}
                    </ul>
                  </div>
              </div>

            </StyledCard>
          </div>

          <div className="lg:col-span-1">
           <PaymentCore subtotal={computedSubtotal} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default PricingGateway;