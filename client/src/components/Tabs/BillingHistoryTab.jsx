import React from "react";

const BillingHistoryTab = () => {
  return (
    <div>
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">Billing History</h3>
    <div className="w-full overflow-x-auto">
  <table className="min-w-[600px] w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-left text-xs sm:text-sm text-gray-600">
          <tr>
            <th className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">Date</th>
            <th className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">Amount</th>
            <th className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">Status</th>
            <th className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">Invoice</th>
          </tr>
        </thead>
        <tbody className="text-xs sm:text-sm text-gray-800">
          <tr className="border-t">
            <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">June 10, 2025</td>
            <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">₹499</td>
            <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">Paid</td>
            <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
              <a href="#" className="text-green-600 hover:underline text-xs sm:text-sm">Download</a>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default BillingHistoryTab;
