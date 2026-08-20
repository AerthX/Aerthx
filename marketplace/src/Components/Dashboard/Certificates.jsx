import React, { useEffect, useState } from "react";
import axios from "axios";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;
const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.id;


  useEffect(() => {
    const fetchCertificates = async () => {
      try {
const res = await axios.get(`${API}/payment/my-certificates/${userId}`, {
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` },
});

const validCertificates = res.data.filter(
  (cert) => cert.status === "completed"
);

setCertificates(validCertificates); 
      } catch (err) {
        console.error("Error fetching certificates:", err.message);
      } finally {
        setLoading(false);
      }
    };

   if (userId) {
  fetchCertificates();
} else {
  console.log("USER ID MISSING");
  setLoading(false);
}
  }, [API, userId]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          🌱 Your Certificates
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Verified proof of your carbon offset contributions
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-gray-500">Loading certificates...</p>
      ) : !certificates || certificates.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <p className="text-gray-500">
            No certificates available yet.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Purchase carbon credits to generate your certificate.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {certificates.map((cert) => {

const fullUrl = cert.certificateUrl || null;

            return (
              <div
                key={cert._id}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 flex flex-col justify-between"
              >
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  Completed
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {cert.projectName}
                  </h3>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">🌿 Offset:</span>{" "}
                      {cert.tonsBought} Tonnes CO₂
                    </p>

                    <p>
                      <span className="font-medium">💰 Paid:</span>{" "}
                      ₹{cert.totalAmountPaid}
                    </p>

                    <p>
                      <span className="font-medium">📅 Date:</span>{" "}
                      {new Date(cert.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-xs text-gray-400 break-all">
                    ID: {cert.certificateId}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-3">

                  {fullUrl ? (
                    <>
                      {/* View */}
                      <button
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                       onClick={() => window.open(fullUrl, "_blank")}
                      >
                        View
                      </button>

                      {/* Download */}
                      <button
                        className="flex-1 border border-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                        onClick={() => {
                          const link = document.createElement("a");
                         link.href = fullUrl + "?tr=dl";
                          link.setAttribute(
                            "download",
                            `${cert.certificateId}.pdf`
                          );
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                        }}
                      >
                        Download
                      </button>
                    </>
                  ) : (
                    <div className="text-xs text-yellow-600">
                      Certificate not generated yet
                    </div>
                  )}

                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default Certificates;