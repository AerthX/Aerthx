import React, { useEffect, useState } from "react";
import axios from "axios";

const Overview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  // ✅ FIXED USER ID
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          console.log("USER ID MISSING");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${API}/payment/my-certificates/${userId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` } }
        );


        // Only completed transactions
        const completed = res.data.filter(
          (item) => item.status === "completed"
        );

        setData(completed);
      } catch (err) {
        console.error("Error fetching overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API, userId]);

  // ✅ CALCULATIONS
  const totalCredits = data.reduce(
    (sum, item) => sum + (item.tonsBought || 0),
    0
  );

  const totalOffset = totalCredits;

  const totalCertificates = data.filter(
    (item) => item.certificateId
  ).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Your Sustainability Overview
      </h2>

      {/* Loading */}
      {loading ? (
        <p className="text-gray-500">Loading overview...</p>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500">Total Credits Purchased</p>
              <h3 className="text-3xl font-bold mt-1">
                {totalCredits}
              </h3>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500">Total CO₂ Offset</p>
              <h3 className="text-3xl font-bold mt-1">
                {totalOffset} tons
              </h3>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500">Certificates</p>
              <h3 className="text-3xl font-bold mt-1">
                {totalCertificates}
              </h3>
            </div>

          </div>

          {/* Recent Activity */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              Recent Activity
            </h3>

            {data.length === 0 ? (
              <p className="text-gray-500">No activity yet.</p>
            ) : (
              <div className="space-y-3">
                {data.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">
                        {item.projectName}
                      </p>
                      <p className="text-gray-500">
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        {item.tonsBought} tons
                      </p>
                      <p className="text-gray-500">
                        ₹{item.totalAmountPaid}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Overview;