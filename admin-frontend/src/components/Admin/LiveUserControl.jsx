import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../Ui/card";
import { Button } from "../Ui/button";

const API = import.meta.env.VITE_API_URL;

const LiveUserControl = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 FETCH USERS (ONLY BUYERS)
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/admin/top-purchasers`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SEARCH FILTER
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 TOGGLE SUSPEND
  const handleToggle = async (userId) => {
    try {
      const res = await axios.put(
        `${API}/admin/toggle-user-status/${userId}`
      );

      alert(res.data.message);

      fetchUsers(); // refresh data
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  return (
    <Card>
     <CardContent className="py-4 px-3 sm:px-4">

        {/* HEADER */}
        <h2 className="text-base sm:text-lg font-bold text-white mb-4">
          Live User Control
        </h2>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded text-black outline-none text-sm sm:text-base"
        />

        {/* LOADING */}
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-white">No users found</p>
        ) : (
          filteredUsers.map((user, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-white mb-3 border-b border-gray-700 pb-2"
            >

              {/* USER INFO */}
              <div>
                <p className="font-medium text-sm sm:text-base break-all">{user.email}</p>
               <p className="text-xs sm:text-sm">{user.userType}</p>

                {/* STATUS */}
                <p className="text-xs mt-1">
                  Status:{" "}
                  <span
                    className={
                      user.isSuspended
                        ? "text-red-400"
                        : "text-green-400"
                    }
                  >
                    {user.isSuspended ? "Suspended" : "Active"}
                  </span>
                </p>
              </div>

              {/* ACTION */}
              <div>
                <Button
                  size="sm"
  className="w-full sm:w-auto"
                  onClick={() => handleToggle(user.userId)}
                  variant={
                    user.isSuspended ? "outline" : "destructive"
                  }
                >
                  {user.isSuspended ? "Unblock" : "Suspend"}
                </Button>
              </div>

            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default LiveUserControl;