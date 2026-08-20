import React, { useEffect, useState } from "react";

const FeatureGate = ({ feature, children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) return setLoading(false);

        // 1. Subscription
        const subRes = await fetch(
          `${import.meta.env.VITE_API_URL}/payment/subscription/${user.id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` } }
        );
        const subData = await subRes.json();

        if (subData?.status !== "active") {
          setAllowed(false);
          return setLoading(false);
        }

        // 2. Pricing
        const pricingRes = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/pricing`
        );
        const pricingData = await pricingRes.json();

        const currentPlan = pricingData.plans[subData.plan];
        const planFeatures = currentPlan?.features || {};

        // 🔥 BUILD MAP
        const featureMap = {};
        pricingData.featureGroups.forEach((group) => {
          group.features.forEach((f) => {
            featureMap[f.label.toLowerCase().replace(/\s/g, "")] = f.key;
          });
        });

        // 🔥 MATCH LABEL → KEY
        const lookupKey = feature.toLowerCase().replace(/\s/g, "");
        const realKey = featureMap[lookupKey];

        setAllowed(planFeatures[realKey] === true);

      } catch (err) {
        console.error("FeatureGate error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [feature]);

  if (loading) return <div>Loading...</div>;

  if (!allowed) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div className="bg-white p-10 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🚧 Coming Soon
          </h2>
          <p className="text-gray-500 mb-4">
            This feature is not available in your plan.
          </p>
          <button
            onClick={() => (window.location.href = "/pricing")}
            className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700"
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default FeatureGate;