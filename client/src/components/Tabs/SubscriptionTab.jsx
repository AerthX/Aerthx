import React from "react";

const SubscriptionTab = () => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Plan</h3>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <p className="text-lg font-medium">Pro Plan</p>
        <p className="text-sm text-gray-500">Renews: 30 July 2025</p>
        <p className="text-sm text-gray-500">Price: ₹499/month</p>
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Manage Plan
        </button>
      </div>
    </div>
  );
};

export default SubscriptionTab;
