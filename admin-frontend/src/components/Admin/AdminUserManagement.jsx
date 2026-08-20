import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEllipsisV } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [individuals, organizations] = await Promise.all([
        axios.get(`${API}/admin/individuals`),
        axios.get(`${API}/admin/organizations`),
      ]);

      const combined = [
        ...individuals.data.map(u => ({ ...u, type: "individual" })),
        ...organizations.data.map(u => ({ ...u, type: "organization" })),
      ];

      setUsers(combined);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔍 SEARCH FILTER
  const filtered = users.filter((u) =>
    (u.fullName || u.orgName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 🗑 DELETE
  const handleDelete = async (id, type) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const url =
        type === "individual"
          ? `${API}/admin/individuals/${id}`
          : `${API}/admin/organizations/${id}`;

      await axios.delete(url);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // 📧 SEND EMAIL
  const handleEmail = async (id) => {
    const message = prompt("Enter message:");
    if (!message) return;

    await axios.post(`${API}/admin/send-general-email/${id}`, {
      message,
    });

    alert("Email sent");
  };

  // 🔔 NOTIFICATION
  const handleNotify = async (user) => {
    const message = prompt("Enter notification:");
    if (!message) return;

    await axios.post(`${API}/admin/send-notification/${user._id}`, {
      title: "Admin Message",
      description: message,
      userType: user.type === "individual" ? "Individual" : "Organization",
    });

    alert("Notification sent");
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">User Management</h2>

        <input
          type="text"
          placeholder="Search users..."
          className="border px-3 sm:px-4 py-2 rounded-lg w-full sm:w-64 text-sm sm:text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
       <table className="min-w-[600px] sm:min-w-full text-sm"> 
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="p-2 sm:p-3 text-xs sm:text-sm">
                  {user.fullName || user.orgName}
                </td>

                <td>{user.email}</td>

                <td className="capitalize">{user.type}</td>

                <td className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === user._id ? null : user._id)
                    }
                  >
                    <FaEllipsisV />
                  </button>

                  {/* 3 DOT MENU */}
                  {openMenu === user._id && (
                    <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 bg-white border rounded shadow w-full sm:w-40 z-50">
                      
                      <button
                        onClick={() => alert("View purchases later")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        View Purchases
                      </button>

                      <button
                        onClick={() => handleNotify(user)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Send Notification
                      </button>

                      <button
                        onClick={() => handleEmail(user._id)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Send Email
                      </button>

                      <button
                        onClick={() => handleDelete(user._id, user.type)}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                      >
                        Delete User
                      </button>

                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;