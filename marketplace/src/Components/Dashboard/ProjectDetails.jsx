import React from "react";

const ProjectDetails = () => {
  return (
    <div className="space-y-6">
      <div className="h-60 bg-gray-200 rounded-xl"></div>

      <h2 className="text-2xl font-semibold">Project Name</h2>
      <p className="text-gray-600 leading-relaxed">Full project description will appear here.</p>

      <div className="bg-white p-5 rounded-xl shadow">
        <p className="text-gray-500">Vintage</p>
        <p className="font-semibold">2023</p>

        <p className="text-gray-500 mt-4">Price Per Credit</p>
        <p className="font-semibold text-green-600">₹ —</p>

        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg w-full">Buy Credits</button>
      </div>
    </div>
  );
};

export default ProjectDetails;
