import React, { useState } from "react";

export const Tabs = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const tabs = React.Children.map(children, (child) => {
    if (child.type === TabsList) {
      return React.cloneElement(child, { activeTab, setActiveTab });
    }
    if (child.type === TabsContent && child.props.value === activeTab) {
      return child;
    }
    return null;
  });

  return <div>{tabs}</div>;
};

export const TabsList = ({ children, activeTab, setActiveTab }) => (
  <div className="flex gap-2 border-b pb-2 mb-4">
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

export const TabsTrigger = ({ children, value, activeTab, setActiveTab }) => {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 rounded-t-md ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children }) => {
  return <div>{children}</div>;
};
