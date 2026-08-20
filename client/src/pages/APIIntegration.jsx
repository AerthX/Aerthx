import React from "react";
import { Link } from "react-router-dom";

const APIIntegration = () => {
  return (
    <div className="px-6 md:px-12 py-10 max-w-6xl mx-auto text-gray-800 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-green-700">API & Integrations</h1>
        <p className="mt-2 text-base text-gray-600 max-w-2xl mx-auto">
          Seamlessly integrate carbon tracking and ESG functionality into your platform or ERP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-semibold text-green-700 mb-3">Built for Developers</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Clean and well-documented endpoints</li>
            <li>API key with rate limits and scopes</li>
            <li>JSON-based request/response</li>
          </ul>
        </div>
        {/* <img src={APIImage} alt="API Console" className="rounded-lg shadow-lg" /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* <img src={APIImage} alt="Enterprise Dashboard" className="rounded-lg shadow-lg" /> */}
        <div>
          <h2 className="text-2xl font-semibold text-green-700 mb-3">Enterprise Ready</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>White-label dashboards</li>
            <li>Custom branding support</li>
            <li>Webhook support & real-time sync</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-semibold text-green-700 mb-3">Flexible & Scalable</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Free tier for testing</li>
            <li>Custom plans for large-scale platforms</li>
            <li>24/7 dev support & API onboarding</li>
          </ul>
        </div>
        {/* <img src={APIImage} alt="Scalable API" className="rounded-lg shadow-lg" /> */}
      </div>

      <div className="text-center pt-8">
        <h3 className="text-2xl font-semibold text-green-700">Ready to Integrate?</h3>
        <Link
          to="/pricing"
          className="mt-4 inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Contact for API Access
        </Link>
      </div>
    </div>
  );
};

export default APIIntegration;