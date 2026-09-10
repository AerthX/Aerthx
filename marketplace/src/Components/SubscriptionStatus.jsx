import React, { useEffect, useState } from "react";
import axios from "axios";

const SubscriptionStatus = ({ userId, onSubscribe  }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/payment/subscription/${userId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` } }
        );
        setSubscription(res.data);
      } catch (err) {
        console.error(err);
        setSubscription({ status: "none" });
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchSubscription();
  }, [userId]);

  if (loading) {
    return (
      <div className="px-4 py-2 text-sm text-gray-500">
        Checking subscription...
      </div>
    );
  }

  // ✅ ACTIVE PLAN
 if (subscription?.status === "active") {
  const planMap = {
    plan_1: { name: "Basic", color: "bg-blue-500" },
    plan_2: { name: "Pro", color: "bg-green-600" },
    plan_3: { name: "Enterprise", color: "bg-yellow-500 text-black" },
  };

  const planInfo = planMap[subscription.plan] || {
    name: "Plan",
    color: "bg-gray-500",
  };

  return (
    <div
      onClick={onSubscribe}
      className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold shadow-md hover:scale-105 transition ${planInfo.color}`}
    >
      {planInfo.name}
      <span className="text-xs opacity-80">• Active</span>
    </div>
  );
}

  // ⚠️ EXPIRED PLAN
  if (subscription?.status === "expired") {
 return (
  <button
    onClick={onSubscribe}
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full font-semibold shadow transition"
  >
    Renew Plan
  </button>
);
  }

  // ❌ NO PLAN
return (
  <button
    onClick={onSubscribe}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-semibold shadow transition"
  >
    Get Started
  </button>
);
}
export default SubscriptionStatus;