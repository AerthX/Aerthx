import React from "react";

const PaymentMethodsTab = () => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Payment Methods</h3>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <p className="text-sm text-gray-700">•••• •••• •••• 1234</p>
        <p className="text-xs text-gray-500">Expires: 09/26</p>
        <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
          Remove Card
        </button>
      </div>
      <button className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
        Add New Payment Method
      </button>
    </div>
  );
};

export default PaymentMethodsTab;
