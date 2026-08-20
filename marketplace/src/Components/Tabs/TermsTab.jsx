import React from "react";

const TermsTab = () => {
  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Terms & Conditions</h3>
      <div className="bg-white p-8 rounded-lg shadow-md w-full text-sm leading-relaxed text-gray-700 space-y-5">
        <p>
          Welcome to <strong>AerthX</strong>. By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions.
        </p>
        <p>
          <strong>1. Use of Platform:</strong> AerthX provides services related to climate impact through carbon credit purchases and subscriptions. All actions must align with our mission of sustainability and transparency.
        </p>
        <p>
          <strong>2. Account & Security:</strong> You are responsible for maintaining the confidentiality of your account credentials. Report any unauthorized activity immediately.
        </p>
        <p>
          <strong>3. Payment & Subscriptions:</strong> Plans are billed monthly or annually. Auto-renewal is enabled unless canceled. Invoices and payment logs are in the Billing tab.
        </p>
        <p>
          <strong>4. Data Protection:</strong> Your data is secure and used only for operational and regulatory purposes.
        </p>
        <p>
          <strong>5. Intellectual Property:</strong> All content and code belong to Aearthex or our licensors.
        </p>
        <p>
          <strong>6. Platform Changes:</strong> We may change features or pricing with or without notice.
        </p>
        <p>
          <strong>7. Limitation of Liability:</strong> Aearthex is not liable for misuse, network issues, or third-party downtimes.
        </p>
        <p>
          Contact us at {" "}
          <a
            href="mailto:legal@aearthex.com"
            className="text-green-600 hover:underline"
          >
            legal@aerthx.com
          </a>{" "}
          for any legal queries.
        </p>
      </div>
    </div>
  );
};

export default TermsTab;
