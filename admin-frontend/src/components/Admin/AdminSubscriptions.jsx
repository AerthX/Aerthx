import React, { useEffect, useState } from "react";
import { FaEllipsisV, FaSearch } from "react-icons/fa";

const AdminSubscriptions = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/subscriptions`
    );
    const json = await res.json();
    setData(json);
  };

  // 🔥 TOGGLE SUSPEND / RESUME
  const toggleStatus = async (user) => {
    try {
      setLoadingAction(user.id);

      const endpoint =
        user.status === "active"
          ? "suspend"
          : "resume";

      await fetch(
        `${import.meta.env.VITE_API_URL}/admin/subscription/${endpoint}/${user.id}`,
        { method: "PUT" }
      );

      // 🔥 instant UI update (no reload feel)
      setData((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                status: u.status === "active" ? "suspended" : "active",
              }
            : u
        )
      );

      setActionMenu(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  // 🔍 FILTER + SEARCH
  const filtered = data.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all" ? true : u.status === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Subscriptions</h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative w-full sm:w-auto">
          {/* SEARCH */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm w-full">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              placeholder="Search users..."
             className="outline-none w-full text-sm sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* FILTER */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="p-2 border rounded-lg bg-white shadow"
            >
              <FaEllipsisV />
            </button>

            {filterOpen && (
              <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 bg-white shadow-lg rounded w-full sm:w-40 z-10">
                {["all", "active", "suspended", "expired"].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f);
                      setFilterOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 capitalize"
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-[700px] sm:min-w-full">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4 text-left">User</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Status</th>
              <th>End Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-2 sm:p-4 text-sm sm:text-base font-medium">{u.name}</td>
                <td>{u.email}</td>
                <td className="font-semibold text-green-600">{u.plan}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.status === "active"
                        ? "bg-green-100 text-green-700"
                        : u.status === "suspended"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td>
                  {new Date(u.endDate).toLocaleDateString()}
                </td>

                {/* ACTION */}
                <td>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActionMenu(actionMenu === u.id ? null : u.id)
                      }
                      className="p-2 hover:bg-gray-200 rounded"
                    >
                      <FaEllipsisV />
                    </button>

                    {actionMenu === u.id && (
                      <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 bg-white shadow-lg rounded w-full sm:w-44 z-10">
                        <button
                          onClick={() => toggleStatus(u)}
                          disabled={loadingAction === u.id}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                            u.status === "active"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {loadingAction === u.id
                            ? "Processing..."
                            : u.status === "active"
                            ? "Suspend"
                            : "Resume"}
                        </button>

                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setActionMenu(null);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Details
                        </button>

                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                          Message
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-4 sm:p-6">
            <h3 className="text-xl font-bold mb-4">User Details</h3>

            <div className="space-y-2 text-sm">
              <p><b>Name:</b> {selectedUser.name}</p>
              <p><b>Email:</b> {selectedUser.email}</p>
              <p><b>Plan:</b> {selectedUser.plan}</p>
              <p><b>Status:</b> {selectedUser.status}</p>
              <p>
                <b>End Date:</b>{" "}
                {new Date(selectedUser.endDate).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptions;