import React, { useState } from "react";
import { FaBug } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const BugReport = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: [], description: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const bugTypes = [
    "UI Issue", "Navigation/Link Issue", "Performance/Slow", "Mobile/Responsive Issue", "Accessibility Issue",
    "Payment Failure", "Refund Issue", "Transaction History Incorrect", "Invoice/Receipt Error",
    "Certificate Error", "Certificate Download Issue", "Carbon Credit Not Reflected", "NFT/Token Metadata Issue",
    "Feature Not Working", "Subscription Issue", "MarketplaceHero Listing Problem", "Wallet/MetaMask Connection Issue", "API/Enterprise Dashboard Error",
    "Profile Update Issue", "Email Verification Problem", "Password Reset Issue",
    "Security/Hacking Concern",
    "Other",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (type) => {
    setFormData((prev) => {
      if (prev.title.includes(type)) {
        return { ...prev, title: prev.title.filter((t) => t !== type) };
      } else {
        return { ...prev, title: [...prev.title, type] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/bugs`,
        {
          ...formData,
          name: user?.name || "Anonymous",
          userType: user?.userType || "Guest",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setSuccess("Bug report submitted successfully!");
      setFormData({ title: [], description: "" });
      
      setTimeout(() => {
        navigate("/"); 
      }, 2000);

    } catch (err) {
      console.error(err);
      setSuccess("Error submitting bug report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-10 sm:py-14 animate-fade-in">
      <div className="w-full max-w-6xl mx-auto bg-white bg-opacity-95 backdrop-blur-md rounded-3xl shadow-2xl p-12 animate-fade-in-up border border-green-200 overflow-hidden mt-20">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-700 mb-4 flex justify-center items-center gap-3">
          <FaBug className="text-red-600 text-3xl sm:text-4xl md:text-5xl animate-bounce" /> Bug Report Form
        </h3>
        <p className="text-gray-700 text-center mb-10 max-w-4xl mx-auto text-sm sm:text-base md:text-lg">
          Facing an issue on AerthX? Select the category and type of problem below. Provide details to help us fix it faster.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
          {[
            {
              category: "UI / UX",
              types: ["UI Issue", "Navigation/Link Issue", "Mobile/Responsive Issue", "Accessibility Issue", "Performance/Slow"]
            },
            {
              category: "Payments & Transactions",
              types: ["Payment Failure", "Refund Issue", "Transaction History Incorrect", "Invoice/Receipt Error", "Order pending/ not executed"]
            },
            {
              category: "Certificates & Carbon Credits",
              types: ["Certificate Error", "Certificate Download Issue", "Carbon Credit Not Reflected"]
            },
            {
              category: "Features & Subscriptions",
              types: ["Feature Not Working", "Subscription Issue", "MarketplaceHero Listing Problem", "API/Enterprise Dashboard Error"]
            },
            {
              category: "Account & Profile",
              types: ["Profile Update Issue", "Email Verification Problem", "Password Reset Issue"]
            },
            {
              category: "Other",
              types: ["Other"]
            }
          ].map((group) => (
            <div key={group.category}>
              <p className="font-semibold text-gray-800 mb-3 text-sm sm:text-base md:text-lg">{group.category}:</p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {group.types.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleCheckboxChange(type)}
                    className={`px-3 sm:px-5 py-2 text-xs sm:text-sm rounded-full border transition-all duration-300 font-medium shadow-sm ${
                      formData.title.includes(type)
                        ? "bg-red-600 text-white border-red-600 shadow-lg scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:scale-105"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div>
            <label className="font-semibold text-gray-800 mb-2 block text-lg">Describe the issue in detail:</label>
            <textarea
              name="description"
              placeholder="Provide a detailed description of the bug, steps to reproduce."
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-5 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-green-300 focus:outline-none h-44 resize-none text-gray-700 placeholder-gray-400 shadow-inner"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base bg-red-600 text-white rounded-full font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-105"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          {success && (
            <p
              className={`text-center mt-4 font-medium text-sm sm:text-lg ${
                success.includes("Error") ? "text-red-600" : "text-green-600"
              }`}
            >
              {success}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default BugReport;