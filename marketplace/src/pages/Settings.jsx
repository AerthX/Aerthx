import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SecurityTab from "../Components/Tabs/SecurityTab";
import SubscriptionTab from "../Components/Tabs/SubscriptionTab";
import BillingHistoryTab from "../Components/Tabs/BillingHistoryTab";
import PaymentMethodsTab from "../Components/Tabs/PaymentMethodsTab";
import TermsTab from "../Components/Tabs/TermsTab";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Security");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">

      {/* SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* CONTENT AREA */}
      <main className="flex-1 w-full">

        {/* INNER CONTAINER (IMPORTANT) */}
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8">

          {activeTab === "Security" && <SecurityTab />}
          {activeTab === "Subscription" && <SubscriptionTab />}
          {activeTab === "Billing History" && <BillingHistoryTab />}
          {activeTab === "Payment Methods" && <PaymentMethodsTab />}
          {activeTab === "Terms & Conditions" && <TermsTab />}

        </div>
      </main>
    </div>
  );
};

export default Settings;