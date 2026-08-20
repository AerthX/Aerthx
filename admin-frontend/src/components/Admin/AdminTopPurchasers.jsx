import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEllipsisV, FaSearch } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

const AdminTopPurchasers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
const [selectedUser, setSelectedUser] = useState(null);
const [purchases, setPurchases] = useState([]);
const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewPurchases = async (userId) => {
  try {
    const res = await axios.get(`${API}/admin/user-purchases/${userId}`);
    setPurchases(res.data);
    setShowModal(true);
  } catch (err) {
    console.error(err);
  }
};

const handleEmail = async (userId) => {
  const message = prompt("Enter email message:");
  if (!message) return;

  await axios.post(`${API}/admin/send-general-email/${userId}`, {
    message,
  });

  alert("Email sent");
};

const handleNotify = async (user) => {
  const message = prompt("Enter notification:");
  if (!message) return;

  await axios.post(`${API}/admin/send-notification/${user.userId}`, {
    title: "Admin Message",
    description: message,
    userType: user.userType === "individual" ? "Individual" : "Organization",
  });

  alert("Notification sent");
};

const handleSuspend = async (userId) => {
  if (!window.confirm("Suspend this user?")) return;

  await axios.put(`${API}/admin/suspend-user/${userId}`);

  alert("User suspended");
};

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/admin/top-purchasers`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (userId) => {
  try {
    const res = await axios.put(
      `${API}/admin/toggle-user-status/${userId}`
    );

    alert(res.data.message);

    fetchData(); // refresh table
  } catch (err) {
    console.error(err);
  }
};

  // 🔍 FILTER
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🧠 INSIGHTS
  const totalRevenue = users.reduce((a, b) => a + b.totalSpent, 0);
  const topUser = users[0];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

        <h2 className="text-2xl font-bold">Top Purchasers</h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">

          {/* SEARCH */}
          <div className="flex items-center border px-3 py-2 rounded-lg w-full">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              placeholder="Search..."
              className="outline-none w-full text-sm sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* FILTER MENU */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(menuOpen === "filter" ? null : "filter")}
              className="p-2 border rounded-lg"
            >
              <FaEllipsisV />
            </button>

            {menuOpen === "filter" && (
              <div className="absolute right-0 sm:right-0 left-0 sm:left-auto bg-white shadow rounded w-full sm:w-48 mt-2 z-50">

                <button
                  onClick={() => setUsers([...users].sort((a, b) => b.totalSpent - a.totalSpent))}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Rank by Spending
                </button>

                <button
                  onClick={() => setUsers([...users].sort((a, b) => b.totalTons - a.totalTons))}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Rank by CO₂ Offset
                </button>

                <button
                  onClick={() => setUsers([...users].sort((a, b) => b.purchases - a.purchases))}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Most Purchases
                </button>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Revenue</p>
          <h3 className="text-xl font-bold">₹{totalRevenue.toFixed(2)}</h3>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Top Customer</p>
          <h3 className="text-xl font-bold">{topUser?.name || "-"}</h3>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Active Buyers</p>
          <h3 className="text-xl font-bold">{users.length}</h3>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-[800px] sm:min-w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Rank</th>
              <th>Name</th>
              <th>Email</th>
              <th>Total Spent</th>
              <th>CO₂ Offset</th>
              <th>Purchases</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.userId} className="border-t hover:bg-gray-50">

               <td className="p-2 sm:p-3 text-xs sm:text-sm font-bold text-green-600">
                  #{u.rank}
                </td>

                <td>{u.name}</td>
                <td>{u.email}</td>

                <td className="font-medium">₹{u.totalSpent}</td>
                <td>{u.totalTons} tons</td>
                <td>{u.purchases}</td>
<td>
  <span
    className={`px-2 py-1 rounded text-xs font-medium ${
      u.isSuspended
        ? "bg-red-100 text-red-600"
        : "bg-green-100 text-green-600"
    }`}
  >
    {u.isSuspended ? "Suspended" : "Active"}
  </span>
</td>
                <td className="relative">

                 <button
  onClick={() => setMenuOpen(u.userId)}
  className="p-2 rounded hover:bg-gray-200"
>
                    <FaEllipsisV />
                  </button>

                  {menuOpen === u.userId && (
                  <div className="absolute right-0 sm:right-0 left-0 sm:left-auto bg-white border shadow rounded w-full sm:w-40 z-50">

                   <button onClick={() => handleViewPurchases(u.userId)}>
  View Purchases
</button>

<button onClick={() => handleEmail(u.userId)}>
  Send Email
</button>

<button onClick={() => handleNotify(u)}>
  Send Notification
</button>

<button
  onClick={() => handleToggleStatus(u.userId)}
  className={`block w-full px-4 py-2 text-left ${
    u.isSuspended
      ? "text-green-600 hover:bg-green-50"
      : "text-red-500 hover:bg-red-50"
  }`}
>
  {u.isSuspended ? "Unsuspend User" : "Suspend User"}
</button>

                    </div>
                  )}

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">

          <h3 className="text-xl font-bold mb-4">User Purchases</h3>

          {purchases.length === 0 ? (
            <p>No purchases found</p>
          ) : (
            purchases.map((p) => (
              <div key={p._id} className="border-b py-3 text-sm sm:text-base">
                <p><b>Project:</b> {p.projectName}</p>
                <p><b>Tons:</b> {p.tonsBought}</p>
                <p><b>Amount:</b> ₹{p.totalAmountPaid}</p>
                <p><b>Date:</b> {new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}

          <button
            onClick={() => setShowModal(false)}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
          >
            Close
          </button>

        </div>
      </div>
    )}


    </div>
  );
};

export default AdminTopPurchasers;