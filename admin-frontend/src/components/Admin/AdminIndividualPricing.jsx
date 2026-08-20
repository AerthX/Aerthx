import React, { useState, useEffect, useRef } from "react";
import { FaDollarSign, FaTags, FaEdit, FaSave, FaTimes, FaPlus, FaCheckCircle, FaMinusCircle, FaStar, FaTrashAlt, FaPen } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AdminIndividualPricing = () => {
    const [plans, setPlans] = useState({});
    const [featureGroups, setFeatureGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(true);
    const [status, setStatus] = useState({ message: "", type: "" });
    const newGroupRef = useRef(null);

    const planKeys = Object.keys(plans);
    const customPlanId = 'plan_3'; 

    const generateUniqueId = () => `id_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const toFeatureKey = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const API_URL = import.meta.env.VITE_API_URL;

   useEffect(() => {
  const fetchConfig = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/pricing/individual`);
      if (!res.ok) throw new Error("No configuration found");

      const data = await res.json();

      // FIX: Convert Map to normal object
      const normalizedPlans = Object.fromEntries(
        Object.entries(data.plans || {})
      );

      setPlans(normalizedPlans);
      setFeatureGroups(data.featureGroups || []);
      setIsEditing(false);

    } catch (err) {
      console.warn("No existing pricing config, initializing empty:", err.message);

      const initialEmptyPlans = {
        plan_1: { id: 'plan_1', name: "Basic", monthly: 0, yearly: 0, highlight: false, features: {} },
        plan_2: { id: 'plan_2', name: "Pro", monthly: 0, yearly: 0, highlight: true, features: {} },
        plan_3: { id: 'plan_3', name: "Custom", monthly: "Custom", yearly: "Custom", highlight: false, features: {} },
      };

      setPlans(initialEmptyPlans);
      setFeatureGroups([]);
      setIsEditing(true);
    } finally {
      setIsLoading(false);
    }
  };

  fetchConfig();
}, []);

    const handlePlanNameChange = (planId, newName) => {
        setPlans(prev => ({
            ...prev,
            [planId]: { ...prev[planId], name: newName },
        }));
    };

    const handleToggleHighlight = (planId) => {
        setPlans(prev => ({
            ...prev,
            [planId]: { ...prev[planId], highlight: !prev[planId].highlight },
        }));
    };

    const handlePriceChange = (planId, period, value) => {
        setPlans(prev => ({
            ...prev,
            [planId]: { ...prev[planId], [period]: value },
        }));
    };

    const handleFeatureChange = (planId, featureKey, value) => {
        const planFeatures = plans[planId]?.features || {};
     const currentValue = planFeatures[featureKey] ?? false;
const isBoolean = true;

        if (isBoolean && value === null) {
            value = !currentValue; 
        } else if (isBoolean) {
            value = !!value;
        }

        setPlans(prev => ({
            ...prev,
            [planId]: {
                ...prev[planId],
                features: { 
                    ...(prev[planId]?.features || {}), 
                    [featureKey]: value 
                },
            },
        }));
    };

    const handleGroupTitleChange = (groupIndex, newTitle) => {
        setFeatureGroups(prev => prev.map((group, i) =>
            i === groupIndex ? { ...group, groupTitle: newTitle } : group
        ));
    };

    const handleAddGroup = () => {
        const newFeatureKey = toFeatureKey("new_feature_") + generateUniqueId();
        
        const newGroup = {
            groupTitle: "NEW SECTION TITLE - CLICK TO RENAME",
            features: [
                { key: newFeatureKey, label: "New Feature Row - CLICK TO RENAME" }
            ]
        };
        
        const updatedPlans = { ...plans };
        Object.keys(updatedPlans).forEach(planId => {
            if (!updatedPlans[planId].features) {
                updatedPlans[planId].features = {};
            }

           if (planId === customPlanId) {
  updatedPlans[planId].features[newFeatureKey] = false;
} else {
  updatedPlans[planId].features[newFeatureKey] = false;
}
        });
        setPlans(updatedPlans);
        
        setFeatureGroups(prev => [...prev, newGroup]);
        
        setStatus({ message: "New feature group section added. Please rename the title and feature label.", type: "success" });
        setTimeout(() => setStatus({ message: "", type: "" }), 4000);
        
        setTimeout(() => {
            newGroupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const input = newGroupRef.current?.querySelector('input[type="text"]');
            if (input) {
                input.focus();
                input.select();
            }
        }, 100);
    };

    const handleRemoveGroup = (groupIndex) => {
        const groupToRemove = featureGroups[groupIndex];
        if (window.confirm(`Are you sure you want to remove the entire section: ${groupToRemove.groupTitle}? This will remove all features under it from all plans.`)) {
            
            const featureKeysToRemove = groupToRemove.features.map(f => f.key);
            
            const updatedPlans = { ...plans };
            Object.keys(updatedPlans).forEach(planId => {
                const newFeatures = { ...updatedPlans[planId].features };
                featureKeysToRemove.forEach(key => delete newFeatures[key]);
                updatedPlans[planId].features = newFeatures;
            });
            setPlans(updatedPlans);

            setFeatureGroups(prev => prev.filter((_, i) => i !== groupIndex));
            setStatus({ message: `Feature group '${groupToRemove.groupTitle}' removed.`, type: "success" });
            setTimeout(() => setStatus({ message: "", type: "" }), 4000);
        }
    };

    const handleAddFeature = (groupIndex) => {
        const newFeatureLabel = `New Feature Row - CLICK TO RENAME`;
        const newFeatureKey = toFeatureKey("new_feature_") + generateUniqueId();
        
        const newFeature = { key: newFeatureKey, label: newFeatureLabel };
        
        setFeatureGroups(prev => prev.map((group, i) =>
            i === groupIndex ? {
                ...group,
                features: [...group.features, newFeature]
            } : group
        ));

        const updatedPlans = { ...plans };
        Object.keys(updatedPlans).forEach(planId => {
            if (!updatedPlans[planId].features) {
                updatedPlans[planId].features = {};
            }
            
            if (planId === customPlanId) {
                 updatedPlans[planId].features[newFeatureKey] = "-";
            } else {
                 updatedPlans[planId].features[newFeatureKey] = false;
            }
        });
        setPlans(updatedPlans);
        setStatus({ message: `New feature row added.`, type: "success" });
        setTimeout(() => setStatus({ message: "", type: "" }), 4000);
    };

    const handleFeatureLabelChange = (groupIndex, featureKey, newLabel) => {
        setFeatureGroups(prev => prev.map((group, i) =>
            i === groupIndex ? {
                ...group,
                features: group.features.map(f =>
                    f.key === featureKey ? { ...f, label: newLabel } : f
                )
            } : group
        ));
    };

    const handleRemoveFeature = (groupIndex, featureKey, featureLabel) => {
        if (window.confirm(`Are you sure you want to remove the feature: ${featureLabel}?`)) {
            
            setFeatureGroups(prev => prev.map((group, i) =>
                i === groupIndex ? {
                    ...group,
                    features: group.features.filter(f => f.key !== featureKey)
                } : group
            ));
            
            const updatedPlans = { ...plans };
            Object.keys(updatedPlans).forEach(planId => {
                const currentFeatures = updatedPlans[planId]?.features || {};
                const { [featureKey]: removed, ...rest } = currentFeatures;
                updatedPlans[planId].features = rest;
            });
            setPlans(updatedPlans);

            setStatus({ message: `Feature '${featureLabel}' row removed.`, type: "success" });
            setTimeout(() => setStatus({ message: "", type: "" }), 4000);
        }
    };

    const handleSave = async () => {
        let hasError = false;
        Object.keys(plans).forEach(planId => {
            const plan = plans[planId];
            if (plan.name.trim() === "") hasError = true;
            const monthlyValid = plan.monthly === "Custom" || (!isNaN(Number(plan.monthly)) && Number(plan.monthly) >= 0);
            const yearlyValid = plan.yearly === "Custom" || (!isNaN(Number(plan.yearly)) && Number(plan.yearly) >= 0);
            if (!monthlyValid || !yearlyValid) hasError = true;
        });

        if (hasError) {
            setStatus({ message: "Error: Check plan names and ensure prices are valid numbers or 'Custom'.", type: "error" });
            return;
        }

        setStatus({ message: "Saving changes...", type: "pending" });
        
        try {
            const response = await fetch(`${API_URL}/admin/pricing/individual`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plans, featureGroups })
            });
            const result = await response.json();

            if (!response.ok) throw new Error(result.message || "Failed to save");

            setStatus({ message: "Pricing configuration successfully updated!", type: "success" });
            setIsEditing(false);
        } catch (error) {
            console.error("Save error:", error);
            setStatus({ message: `Save failed: ${error.message}`, type: "error" });
        }

        setTimeout(() => setStatus({ message: "", type: "" }), 4000);
    };

    
    const renderFeatureInput = (planId, featureKey, value) => {
        const normalizedValue =
  value === "true" ? true :
  value === "false" ? false :
  value ?? false;

const isBoolean = typeof normalizedValue === "boolean";
        const isCustomPlan = planId === customPlanId;

        if (isCustomPlan) {
            return (
                <span className="w-full text-center p-2 font-bold text-gray-500 bg-gray-100 rounded block">
                    {value}
                </span>
            );
        }
        
        if (!isBoolean) {
            return (
                <input
                    type="text"
                    value={value || ''} 
                    onChange={(e) => handleFeatureChange(planId, featureKey, e.target.value)}
                    className="w-full text-xs sm:text-sm text-center p-1 sm:p-2 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white shadow-inner text-sm"
                />
            );
        }
        
        return (
            <button
                onClick={() => handleFeatureChange(planId, featureKey, null)}
                className={`flex items-center justify-center w-full py-2 rounded transition-all duration-200 ${
                normalizedValue
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
               title={normalizedValue ? "Enabled" : "Disabled"}
            >
                {normalizedValue ? <FaCheckCircle size={16} /> : <FaMinusCircle size={16} />}
            </button>
        );
    };

    const renderFeatureDisplay = (planId, featureKey, value) => {
       const normalizedValue =
  value === "true" ? true :
  value === "false" ? false :
  value ?? false;

const isBoolean = typeof normalizedValue === "boolean";
        const isCustomPlan = planId === customPlanId;

        if (isCustomPlan || !isBoolean) {
      const displayValue =
  isCustomPlan && (normalizedValue === undefined || normalizedValue === null || normalizedValue === "")
    ? "-"
    : normalizedValue;
            return <span className="text-gray-700 font-medium">{displayValue}</span>;
        }
        
       if (normalizedValue === true) {
    return <FaCheckCircle className="text-green-500 mx-auto" size={14} />;
} else if (normalizedValue === false) {
    return <FaTimes className="text-gray-400 mx-auto" size={14} />;
}
        return <span className="text-gray-700 font-medium">{value}</span>;
    }
    
    const getStatusColor = () => {
        switch (status.type) {
            case 'success': return 'bg-green-500 text-white';
            case 'error': return 'bg-red-500 text-white';
            case 'pending': return 'bg-blue-500 text-white';
            case 'info': return 'bg-yellow-500 text-gray-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    }
    
    if (isLoading) {
        return (
            <div className="p-8 min-h-screen bg-gray-50 flex justify-center items-center">
                <FaTags className="animate-pulse text-green-600 mr-3" size={30} />
                <span className="text-xl font-semibold text-gray-700">Loading configuration...</span>
            </div>
        );
    }

    return (
       <div className="p-2 sm:p-4 min-h-screen bg-gray-50">
            
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6 border-b pb-4">
                <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <FaTags className="text-green-600" /> AerthX Pricing Management
                </h2>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-4 lg:mt-0 items-start sm:items-center">
                    
                    <AnimatePresence>
                        {status.message && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`py-2 px-4 rounded-lg font-semibold text-sm ${getStatusColor()}`}
                            >
                                {status.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {isEditing ? (
                        <div className="flex gap-2">
                            <motion.button
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-400 text-whitew-full sm:w-auto px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-500 transition"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaTimes /> Cancel
                            </motion.button>
                            <motion.button
                                onClick={handleSave}
                                className="bg-green-600 text-white w-full sm:w-auto px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 transition"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={status.type === 'pending'}
                            >
                                <FaSave /> {status.type === 'pending' ? 'Saving...' : 'Save Changes'}
                            </motion.button>
                        </div>
                    ) : (
                        <motion.button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 text-white w-full sm:w-auto px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaEdit /> Edit Pricing Configuration
                        </motion.button>
                    )}
                </div>
            </div>
            
            <div className="overflow-x-auto w-full bg-white rounded-lg shadow-xl border border-gray-100">
                <table className="min-w-[900px] sm:min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider hidden sm:table-cell sticky left-0 bg-gray-50 z-20 w-1/4">
                                Plan Detail
                            </th>
                            <AnimatePresence>
                                {planKeys.map(planId => {
                                    const plan = plans[planId];
                                    return (
                                        <motion.th
                                            key={planId}
                                            className={`px-6 py-4 text-center text-lg font-extrabold uppercase tracking-wider transition-all duration-300 ${
                                                plan.highlight ? 'text-blue-700 bg-blue-50 border-x-2 border-blue-300' : 'text-gray-800'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={plan.name}
                                                        onChange={(e) => handlePlanNameChange(planId, e.target.value)}
                                                        className="w-full text-center p-1 border-b border-dashed border-gray-400 font-extrabold text-xl bg-transparent"
                                                    />
                                                ) : (
                                                    <span className="text-xl">{plan.name}</span>
                                                )}
                                                
                                                {isEditing && (
                                                    <button 
                                                        onClick={() => handleToggleHighlight(planId)} 
                                                        className={`mt-2 p-1 rounded transition ${plan.highlight ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                                        title={plan.highlight ? "Remove Highlight" : "Set as Highlighted"}
                                                    >
                                                        <FaStar size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </motion.th>
                                    );
                                })}
                            </AnimatePresence>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {['monthly', 'yearly'].map(period => (
                            <tr key={period} className="bg-green-50/70">
                                <td className="px-6 py-4 whitespace-nowrap font-bold text-green-700 hidden sm:table-cell sticky left-0 bg-green-50/70 z-10">
                                    <FaDollarSign className="inline mr-2" /> {period === 'monthly' ? 'Monthly' : 'Yearly'} Price (₹)
                                </td>
                                <AnimatePresence>
                                    {planKeys.map(planId => {
                                        const price = plans[planId]?.[period] ?? 0;
                                        const isCustomPlan = planId === customPlanId;
                                        return (
                                            <motion.td 
                                                key={`${planId}-${period}`} 
                                                className={`px-6 py-3 whitespace-nowrap text-center transition-opacity duration-300`}
                                            >
                                                {isCustomPlan ? (
                                                    <span className="text-lg font-bold text-blue-600">Contact Sales</span>
                                                ) : isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={price}
                                                        onChange={(e) => handlePriceChange(planId, period, e.target.value)}
                                                        className="w-full max-w-[90px] sm:w-24 text-center p-1 sm:p-2 border border-green-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white font-bold"
                                                    />
                                                ) : (
                                                    <span className="text-xl font-extrabold text-gray-900">{`₹${price}`}</span>
                                                )}
                                            </motion.td>
                                        );
                                    })}
                                </AnimatePresence>
                            </tr>
                        ))}
                        
                        {featureGroups.map((group, groupIndex) => (
                            <React.Fragment key={groupIndex}>
                                <tr 
                                    className="bg-gray-100/80 border-t border-gray-300/80"
                                    ref={groupIndex === featureGroups.length - 1 ? newGroupRef : null} 
                                >
                                    <td className="px-6 py-3 font-extrabold text-lg text-gray-800 hidden sm:table-cell sticky left-0 bg-gray-100/80 z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={group.groupTitle}
                                                    onChange={(e) => handleGroupTitleChange(groupIndex, e.target.value)}
                                                    className="font-extrabold text-lg bg-transparent border-b border-gray-500 flex-grow mr-4"
                                                />
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleAddFeature(groupIndex)}
                                                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full bg-white shadow-sm"
                                                        title="Add New Feature Row"
                                                    >
                                                        <FaPlus size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleRemoveGroup(groupIndex)}
                                                        className="text-red-600 hover:text-red-800 p-1 rounded-full bg-white shadow-sm"
                                                        title="Remove Section"
                                                    >
                                                        <FaTrashAlt size={14} />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="flex-grow">{group.groupTitle}</span>
                                        )}
                                    </td>
                                    {planKeys.map(planId => (
                                        <td key={planId} className="px-6 py-3 text-center bg-gray-100/80"></td>
                                    ))}
                                </tr>

                                {group.features.map(feature => (
                                    <motion.tr 
                                        key={feature.key}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell sticky left-0 bg-white z-10 flex items-center justify-between">
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={feature.label}
                                                        onChange={(e) => handleFeatureLabelChange(groupIndex, feature.key, e.target.value)}
                                                      className="bg-transparent border-b border-gray-300 w-full sm:w-3/4 mr-2 text-sm"
                                                        title="Feature Label"
                                                    />
                                                    <button 
                                                        onClick={() => handleRemoveFeature(groupIndex, feature.key, feature.label)}
                                                        className="text-red-400 hover:text-red-600 p-1"
                                                        title="Remove Row"
                                                    >
                                                        <FaTimes size={12} />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="flex items-center">
                                                    <FaPen className="text-gray-400 mr-2" size={10} />
                                                    {feature.label}
                                                </span>
                                            )}
                                        </td>
                                        {planKeys.map(planId => (
                                            <td key={`${planId}-${feature.key}`} className="px-6 py-2 whitespace-nowrap text-center">
                                                {isEditing 
                                                    ? renderFeatureInput(planId, feature.key,plans[planId]?.features?.[feature.key] ?? false)
                                                    : renderFeatureDisplay(planId, feature.key, plans[planId]?.features?.[feature.key] ?? false)
                                                }
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </React.Fragment>
                        ))}

                        {isEditing && (
                            <tr className="bg-gray-100 hover:bg-gray-200 transition">
                                <td colSpan={planKeys.length + 1} className="px-6 py-4 text-center">
                                    <motion.button
                                        onClick={handleAddGroup}
                                        className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-md"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <FaPlus /> Add New Feature Group Section
                                    </motion.button>
                                </td>
                            </tr>
                        )}
                        
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminIndividualPricing;