import React, { useEffect, useState } from "react";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          console.log("USER ID missing");
          setLoading(false);
          return;
        }

        // 🔹 Fetch transactions
        const txRes = await axios.get(
          `${API}/payment/my-certificates/${userId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` } }
        );

        // 🔹 Fetch subscription
        const subRes = await axios.get(
          `${API}/payment/subscription/${userId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` } }
        );


        setTransactions(txRes.data || []);
        setSubscription(subRes.data || null);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API, userId]);

  // ✅ Check subscription active
  const isSubscribed = subscription?.status === "active";

  // ✅ CSV Export
  const downloadCSV = () => {
    if (!transactions.length) return;

    const headers = [
      "Transaction ID",
      "Project",
      "Credits (tons)",
      "Amount Paid",
      "Payment Method",
      "Status",
      "Date",
      "Platform Fee",
      "GST",
      "Gateway Fee"
    ];

    const rows = transactions.map((t) => [
      t._id,
      t.projectName,
      t.tonsBought,
      t.totalAmountPaid,
      t.paymentMethod,
      t.status,
      new Date(t.createdAt).toLocaleDateString(),
      t.platformFee || 0,
      t.gst || 0,
      t.gatewayFee || 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "transactions.csv";
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Transactions</h2>

        <button
          onClick={downloadCSV}
          disabled={!isSubscribed}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            isSubscribed
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Download CSV
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">No transactions yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 text-left">
              <tr>
                <th className="p-3">Project</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-t">
                  <td className="p-3 font-medium">
                    {t.projectName}
                  </td>

                  <td className="p-3">
                    {t.tonsBought} tons
                  </td>

                  <td className="p-3">
                    ₹{t.totalAmountPaid}
                  </td>

                  <td className="p-3 capitalize">
                    {t.paymentMethod}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        t.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : t.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Subscription Hint */}
      {!isSubscribed && (
        <p className="text-sm text-gray-500">
          Upgrade to an active subscription to export your transaction data.
        </p>
      )}
    </div>
  );
};

export default Transactions;