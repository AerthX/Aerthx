import React, { useState, useEffect, useMemo } from "react";
import {
  FaEye,
  FaCircle,
  FaEllipsisV,
  FaEnvelope,
  FaTrash,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaBell,
  FaStar,
} from "react-icons/fa";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const API_URL = import.meta.env.VITE_API_URL;

const AdminUserReports = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailUserId, setEmailUserId] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailProblem, setEmailProblem] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reportToDeleteId, setReportToDeleteId] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationUserId, setNotificationUserId] = useState(null);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [showReportDetailsModal, setShowReportDetailsModal] = useState(false);
  const [reportDetails, setReportDetails] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    fetchUsers();
    fetchAdmins();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/users-reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      showNotification("Failed to fetch users.", "error");
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const viewReports = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/user-reports/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
      setSelectedUser(userId);
    } catch (err) {
      console.error(err);
      showNotification("Failed to fetch reports.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openReportDetailsModal = (report) => {
    setReportDetails(report);
    setShowReportDetailsModal(true);
    handleMarkAsSeen(report._id);
  };

  const openEmailModal = (userId, problem) => {
    setEmailUserId(userId);
    setEmailProblem(problem || "");
    setEmailMessage("");
    setEmailSubject("");
    setShowEmailModal(true);
    setMenuOpenId(null);
    setShowReportDetailsModal(false);
  };

  const handleSendEmail = async () => {
    setEmailLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/admin/send-email/${emailUserId}`,
        {
          subject: emailSubject,
          problem: emailProblem,
          message: emailMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Email sent successfully!", "success");
      setShowEmailModal(false);
      setEmailSubject("");
      setEmailProblem("");
      setEmailMessage("");
      setEmailUserId(null);
    } catch (err) {
      console.error(err);
      showNotification("Failed to send email. Please try again.", "error");
    } finally {
      setEmailLoading(false);
    }
  };

  const openConfirmDeleteModal = (reportId) => {
    setReportToDeleteId(reportId);
    setShowConfirmModal(true);
    setMenuOpenId(null);
    setShowReportDetailsModal(false);
  };

  const handleDeleteReport = async () => {
    if (!reportToDeleteId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/admin/delete-report/${reportToDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("Report deleted successfully!", "success");
      setReports((prev) => prev.filter((r) => r._id !== reportToDeleteId));
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete report.", "error");
    } finally {
      setShowConfirmModal(false);
      setReportToDeleteId(null);
    }
  };

  const handleToggleStar = async (reportId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/admin/toggle-star/${reportId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports((prevReports) =>
        prevReports.map((r) => (r._id === reportId ? res.data : r))
      );
      showNotification("Star updated!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to update star.", "error");
    }
  };

  const openNotificationModal = (userId) => {
    setNotificationUserId(userId);
    setNotificationTitle("");
    setNotificationMessage("");
    setShowNotificationModal(true);
    setMenuOpenId(null);
    setShowReportDetailsModal(false);
  };

 const handleSendNotification = async () => {
  const token = localStorage.getItem("token"); 
  try {
    await axios.post(
      `${API_URL}/admin/send-notification/${notificationUserId}`,
      {
        userType: activeTab === "individual" ? "Individual" : "Organization",
        title: notificationTitle,
        description: notificationMessage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Notification sent successfully");
    setShowNotificationModal(false);
    setNotificationTitle("");
    setNotificationMessage("");
  } catch (error) {
    console.error("Error sending notification:", error);
    alert("Failed to send notification");
  }
};


  const handlePrioritizeReport = async (reportId, priority) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/admin/update-report-priority/${reportId}`,
        { priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports((prevReports) =>
        prevReports.map((r) => (r._id === reportId ? res.data : r))
      );
      showNotification("Report priority updated!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to update priority.", "error");
    }
    setMenuOpenId(null);
  };

  const handleAssignReport = async (reportId, adminId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/admin/assign-report/${reportId}`,
        { adminId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports((prevReports) =>
        prevReports.map((r) => (r._id === reportId ? res.data : r))
      );
      showNotification("Report assigned!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to assign report.", "error");
    }
    setMenuOpenId(null);
  };

  const handleMarkAsSeen = async (reportId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/admin/update-report-seen/${reportId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports((prevReports) =>
        prevReports.map((r) => (r._id === reportId ? res.data : r))
      );
    } catch (err) {
      console.error(err);
      showNotification("Failed to mark as seen.", "error");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Title", "Description", "User ID", "Priority", "Assigned Admin", "Created At"];
    const rows = reports.map((r) => [
      r.title,
      r.description,
      r.userId,
      r.priority || "None",
      r.assignedAdminName || "Unassigned",
      new Date(r.createdAt).toLocaleString(),
    ]);
    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("User Reports", 14, 20);
    if (reports.length === 0) {
      doc.text("No data to export.", 14, 30);
      doc.save("reports.pdf");
      return;
    }
    const headers = ["Title", "Description", "User ID", "Priority", "Assigned Admin", "Created At"];
    const rows = reports.map((r) => [
      r.title || "",
      r.description || "",
      r.userId || "",
      r.priority || "None",
      r.assignedAdminName || "Unassigned",
      new Date(r.createdAt).toLocaleString(),
    ]);
    doc.autoTable({
      startY: 25,
      head: [headers],
      body: rows,
    });
    doc.save("reports.pdf");
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const goBack = () => {
    setSelectedUser(null);
    setReports([]);
  };

  const getNotificationIcon = (type) => {
    if (type === "success") return <FaCheckCircle className="inline mr-2 text-green-700" />;
    return <FaExclamationCircle className="inline mr-2 text-red-700" />;
  };

  const sortedReports = useMemo(() => {
    const priorityOrder = { high: 1, medium: 2, low: 3, None: 4 };
    return [...reports].sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 4;
      const priorityB = priorityOrder[b.priority] || 4;

      if (a.star && !b.star) return -1;
      if (!a.star && b.star) return 1;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [reports]);

  const renderReportsTable = () => {
    if (loading) return <p>Loading...</p>;
    if (reports.length === 0) return <p>No reports found for this user.</p>;
    return (
      <div>
        <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Export PDF
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedReports.map((report) => {
            const assignedAdmin = admins.find(admin => admin.id === report.assignedAdminId);
            return (
              <div
                key={report._id}
                className={`relative p-4 bg-white rounded-xl shadow border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-300 ${
                  report.priority ? "ring-2 ring-yellow-500" : ""
                }`}
              >
                <div
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2"
                  onDoubleClick={() => openReportDetailsModal(report)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 break-words sm:truncate">{report.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {report.description.length > 50
                        ? `${report.description.substring(0, 50)}...`
                        : report.description}
                    </p>
                    <p className="text-xs mt-1">
                      Priority:{" "}
                      <span className={`font-semibold ${report.priority === "high" ? "text-red-600" : report.priority === "medium" ? "text-yellow-600" : "text-green-600"}`}>
                        {report.priority || "None"}
                      </span>
                    </p>
                    <p className="text-xs mt-1">Assigned: {assignedAdmin ? assignedAdmin.name : "Unassigned"}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStar(report._id);
                      }}
                      className="p-1"
                      title={report.star ? "Unstar" : "Star"}
                    >
                      <FaStar className={`text-lg ${report.star ? "text-yellow-500" : "text-gray-300"}`} />
                    </button>
                    {!report.seen && <FaCircle className="text-green-500 text-xs" title="New" />}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(menuOpenId === report._id ? null : report._id);
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                      >
                        <FaEllipsisV />
                      </button>
                      {menuOpenId === report._id && (
                        <div className="absolute right-0 sm:right-0 left-0 sm:left-auto top-full mt-2 w-full sm:w-56 bg-white shadow-lg rounded-lg border z-10 py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStar(report._id);
                            }}
                            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100 transition"
                          >
                            <FaStar className={`${report.star ? 'text-yellow-500' : 'text-gray-400'}`} /> {report.star ? 'Unstar' : 'Star'}
                          </button>
                          <select
                            className="w-full text-sm px-4 py-2 border-b border-gray-100"
                            value={report.priority || ""}
                            onChange={(e) => handlePrioritizeReport(report._id, e.target.value)}
                          >
                            <option value="">None</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                          <select
                            className="w-full text-sm px-4 py-2 border-b border-gray-100"
                            value={report.assignedAdminId || ""}
                            onChange={(e) => handleAssignReport(report._id, e.target.value)}
                          >
                            <option value="">Unassigned</option>
                            {admins.map((admin) => (
                              <option key={admin.id} value={admin.id}>
                                {admin.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEmailModal(report.userId, report.description);
                            }}
                            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100 transition"
                          >
                            <FaEnvelope className="text-blue-500" /> Send Email
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openNotificationModal(report.userId);
                            }}
                            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100 transition"
                          >
                            <FaBell className="text-indigo-500" /> Send Notification
                          </button>
                          <div className="my-1 border-t border-gray-100"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openConfirmDeleteModal(report._id);
                            }}
                            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-red-600 hover:bg-red-50 transition"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Submitted: {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderUsersTable = () => {
    const usersWithReports = users.filter((user) => user.reportsCount > 0);
    return (
      <div className="overflow-x-auto">
        <table className="min-w-[700px] sm:min-w-full bg-white rounded-xl shadow border border-gray-200"></table><table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">User ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Reports</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersWithReports.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No users with reports.
                </td>
              </tr>
            ) : (
              usersWithReports.map((user) => (
                <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">{user.id}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">{user.name}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">{user.isOrganization ? "Organization" : "Individual"}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm flex items-center gap-2">
                    {user.reportsCount}
                    {user.newReports > 0 && <FaCircle className="text-green-500 text-xs" />}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">
                    <button
                      onClick={() => viewReports(user.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                    >
                      <FaEye className="inline mr-1" /> View Reports
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderReportDetailsModal = () =>
    reportDetails && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-lg mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Report Details</h3>
            <button onClick={() => setShowReportDetailsModal(false)}>
              <FaTimes className="text-gray-600 hover:text-black" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-700">Title:</p>
              <p className="text-gray-900">{reportDetails.title}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Description:</p>
              <p className="text-gray-900">{reportDetails.description}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Priority:</p>
              <p className="text-gray-900">{reportDetails.priority || "None"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Assigned Admin:</p>
              <p className="text-gray-900">{reportDetails.assignedAdminName || "Unassigned"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">User ID:</p>
              <p className="text-gray-900">{reportDetails.userId}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Submitted On:</p>
              <p className="text-gray-900">{new Date(reportDetails.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => openEmailModal(reportDetails.userId, reportDetails.description)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                <FaEnvelope className="inline mr-2" /> Send Email
              </button>
              <button
                onClick={() => openConfirmDeleteModal(reportDetails._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                <FaTrash className="inline mr-2" /> Delete Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  const renderEmailModal = () =>
    showEmailModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
          <h3 className="text-lg font-bold mb-4">Send Email to User</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
            <textarea
              rows="5"
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowEmailModal(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSendEmail}
              disabled={emailLoading}
              className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ${
                emailLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {emailLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    );

  const renderConfirmModal = () =>
    showConfirmModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm mx-4">
          <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
          <p className="mb-4">Are you sure you want to delete this report? This action cannot be undone.</p>
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteReport}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );

  const renderNotificationModal = () =>
    showNotificationModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
          <h3 className="text-lg font-bold mb-4">Send Push Notification</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
            <textarea
              rows="5"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowNotificationModal(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSendNotification}
              disabled={notificationLoading}
              className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition ${
                notificationLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {notificationLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div>
      {notification && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center ${
            notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {getNotificationIcon(notification.type)}
          {notification.message}
        </div>
      )}
      {selectedUser ? (
        <>
          <button
            onClick={goBack}
        className="mb-4 w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-full text-sm sm:text-base"
          >
            Back
          </button>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Reports from User ID: {selectedUser}</h2>
          {renderReportsTable()}
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">Users and Reports</h2>
          {renderUsersTable()}
        </>
      )}
      {showReportDetailsModal && renderReportDetailsModal()}
      {showEmailModal && renderEmailModal()}
      {showConfirmModal && renderConfirmModal()}
      {showNotificationModal && renderNotificationModal()}
    </div>
  );
};

export default AdminUserReports;