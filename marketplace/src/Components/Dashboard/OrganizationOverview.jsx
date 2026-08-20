import React from "react";

const OrganizationOverview = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Organization Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Credits Purchased</p>
          <h3 className="text-3xl font-bold mt-1">0</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">CO₂ Offset</p>
          <h3 className="text-3xl font-bold mt-1">0 tons</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Employees Added</p>
          <h3 className="text-3xl font-bold mt-1">0</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Reports Generated</p>
          <h3 className="text-3xl font-bold mt-1">0</h3>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-3">Recent Company Activity</h3>
        <p className="text-gray-500">No activity recorded.</p>
      </div>
    </div>
  );
};

export default OrganizationOverview;
