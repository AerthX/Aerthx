import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

const API_URL = import.meta.env.VITE_API_URL;

const AdminUserData = () => {
  const [activeTab, setActiveTab] = useState("individual");
  const [individuals, setIndividuals] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showMailForm, setShowMailForm] = useState(false);
  const [mailRecipient, setMailRecipient] = useState(null);
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [mailStatus, setMailStatus] = useState(null);
  const [mainActionsDropdown, setMainActionsDropdown] = useState(false);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [notificationRecipient, setNotificationRecipient] = useState(null);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(null);

  useEffect(() => {
    activeTab === "individual" ? fetchIndividuals() : fetchOrganizations();
    setSelectedUsers(new Set());
  }, [activeTab]);

  const fetchIndividuals = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/individuals`);
      setIndividuals(res.data);
    } catch (err) {
      console.error("Failed to load individual users", err);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/organizations`);
      setOrganizations(res.data);
    } catch (err) {
      console.error("Failed to load organization users", err);
    }
  };

  const filterData = (data) => {
    return data.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item._id.toLowerCase().includes(searchLower) ||
        (item.fullName && item.fullName.toLowerCase().includes(searchLower)) ||
        (item.orgName && item.orgName.toLowerCase().includes(searchLower))
      );
    });
  };

  const handleDelete = async (id, type) => {
    try {
      const endpoint =
        type === "individual"
          ? `${API_URL}/admin/individuals/${id}`
          : `${API_URL}/admin/organizations/${id}`;

      await axios.delete(endpoint);

      if (type === "individual") {
        setIndividuals((prev) => prev.filter((user) => user._id !== id));
      } else {
        setOrganizations((prev) => prev.filter((org) => org._id !== id));
      }

      setDropdownVisible(null);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownVisible((prev) => (prev === id ? null : id));
  };

  const handleView = (user) => {
    setViewUser(user);
    setDropdownVisible(null);
  };

  const handleMail = (user) => {
    setMailRecipient(user);
    setMailSubject("");
    setMailBody("");
    setMailStatus(null);
    setShowMailForm(true);
    setDropdownVisible(null);
  };

  const handleNotification = (user) => {
    const recipients = user ? [user] : Array.from(selectedUsers).map((id) =>
      activeTab === "individual"
        ? individuals.find((u) => u._id === id)
        : organizations.find((o) => o._id === id)
    );
    if (recipients.length > 0) {
      setNotificationRecipient(recipients);
      setNotificationTitle("");
      setNotificationMessage("");
      setNotificationStatus(null);
      setShowNotificationForm(true);
    } else {
      alert("Please select at least one user to send a notification.");
    }
    setDropdownVisible(null);
    setMainActionsDropdown(false);
  };

  const handleSelect = (userId) => {
    setSelectedUsers((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(userId)) {
        newSelected.delete(userId);
      } else {
        newSelected.add(userId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    const allUserIds = new Set(filteredData.map((user) => user._id));
    if (selectedUsers.size === allUserIds.size && allUserIds.size > 0) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(allUserIds);
    }
    setMainActionsDropdown(false);
  };

  const handleMailToSelected = () => {
    const selectedUsersData = Array.from(selectedUsers).map((id) =>
      activeTab === "individual"
        ? individuals.find((u) => u._id === id)
        : organizations.find((o) => o._id === id)
    );
    if (selectedUsersData.length > 0) {
      setMailRecipient(selectedUsersData);
      setMailSubject("");
      setMailBody("");
      setMailStatus(null);
      setShowMailForm(true);
    } else {
      alert("Please select at least one user to email.");
    }
    setMainActionsDropdown(false);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMailStatus(null);
    try {
      const recipients = Array.isArray(mailRecipient) ? mailRecipient : [mailRecipient];
      await Promise.all(
        recipients.map((user) =>
          axios.post(`${API_URL}/admin/send-general-email/${user._id}`, {
            subject: mailSubject,
            message: mailBody,
            problem: "Admin Communication",
          })
        )
      );
      setMailStatus("success");
      setTimeout(() => {
        setShowMailForm(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to send email", error);
      setMailStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    setIsSendingNotification(true);
    setNotificationStatus(null);

    try {
      await Promise.all(
        notificationRecipient.map((user) =>
          axios.post(`${API_URL}/admin/send-notification/${user._id}`, {
            title: notificationTitle,
            description: notificationMessage,
            userType: activeTab === "individual" ? "Individual" : "Organization",
          })
        )
      );
      setNotificationStatus("success");
      setTimeout(() => {
        setShowNotificationForm(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to send notification", error);
      setNotificationStatus("error");
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleExportCSV = () => {
    const currentData = activeTab === "individual" ? individuals : organizations;
    const filteredData = filterData(currentData);
    const headers = ["ID"].concat(
      Object.keys(filteredData[0] || {}).filter(key => key !== 'password' && key !== '__v' && key !== '_id')
    );
    const rows = filteredData.map(item => [item._id, ...headers.slice(1).map(header => item[header])]);

    let csvContent = headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${activeTab}_users.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMainActionsDropdown(false);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const currentData = activeTab === "individual" ? individuals : organizations;
    const filteredData = filterData(currentData);
    doc.text(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Users Data`, 14, 20);

    const headers = ["ID"].concat(
      Object.keys(filteredData[0] || {}).filter(key => key !== 'password' && key !== '__v' && key !== '_id')
    );
    const data = filteredData.map(item => [item._id, ...headers.slice(1).map(header => item[header])]);

    doc.autoTable({
      startY: 25,
      head: [headers],
      body: data,
    });

    doc.save(`${activeTab}_users.pdf`);
    setMainActionsDropdown(false);
  };

  const renderRow = (item, type) => (
    <div
      key={item._id}
      className="grid grid-cols-1 sm:grid-cols-[30px_1fr_1.5fr_1.5fr_0.5fr] gap-2 sm:gap-0 items-start sm:items-center bg-white shadow-sm rounded-lg px-4 py-3 mb-2 hover:shadow-md relative cursor-pointer"
      onClick={() => handleView(item)}
    >
      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selectedUsers.has(item._id)}
          onChange={() => handleSelect(item._id)}
          className="form-checkbox h-4 w-4 text-green-600 rounded-lg focus:ring-green-500"
        />
      </div>
      <div className="text-sm text-gray-500 break-all">{item._id}</div>
      <div className="truncate text-gray-800 font-medium">
        {type === "individual" ? item.fullName : item.orgName}
      </div>
      <div className="truncate text-gray-600">{item.email}</div>
      <div className="relative flex justify-end" onClick={(e) => e.stopPropagation()}>
        <FiMoreVertical
          className="text-xl cursor-pointer hover:text-gray-800"
          onClick={() => toggleDropdown(item._id)}
        />
        {dropdownVisible === item._id && (
          <div className="absolute right-0 sm:right-0 left-0 sm:left-auto top-6 w-full sm:w-36 z-10 bg-white border shadow rounded w-36">
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => handleView(item)}
            >
              View
            </button>
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => handleMail(item)}
            >
              Mail
            </button>
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => handleNotification(item)}
            >
              Notification
            </button>
            <button
              className="w-full px-4 py-2 text-left hover:bg-red-100 text-red-600"
              onClick={() => handleDelete(item._id, activeTab)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const currentData = activeTab === "individual" ? individuals : organizations;
  const filteredData = useMemo(() => filterData(currentData), [currentData, searchQuery]);
  const isAllSelected = selectedUsers.size === filteredData.length && filteredData.length > 0;

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            className={`w-full sm:w-auto px-4 py-2 text-sm sm:text-base rounded ${
              activeTab === "individual"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setActiveTab("individual")}
          >
            Individual ({filterData(individuals).length})
          </button>
          <button
            className={`w-full sm:w-auto px-4 py-2 text-sm sm:text-base rounded ${
              activeTab === "organization"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setActiveTab("organization")}
          >
            Organization ({filterData(organizations).length})
          </button>
        </div>
        <div className="flex items-center gap-2">
         <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by ID, Name, or Org"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <div className="relative">
            <FiMoreVertical
              className="text-xl cursor-pointer hover:text-gray-800"
              onClick={() => setMainActionsDropdown(!mainActionsDropdown)}
            />
            {mainActionsDropdown && (
              <div className="absolute right-0 sm:right-0 left-0 sm:left-auto top-6 w-full sm:w-48 z-10 bg-white border shadow rounded w-48">
                <button
                  className=" w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-left hover:bg-gray-100"
                  onClick={handleSelectAll}
                >
                  {isAllSelected ? "Cancel Selection" : "Select All"}
                </button>
                <button
                  className={` w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-left hover:bg-gray-100 ${
                    selectedUsers.size === 0 ? "text-gray-400 cursor-not-allowed" : ""
                  }`}
                  onClick={handleMailToSelected}
                  disabled={selectedUsers.size === 0}
                >
                  Mail to Selected ({selectedUsers.size})
                </button>
                <button
                  className={`w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-left hover:bg-gray-100 ${
                    selectedUsers.size === 0 ? "text-gray-400 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleNotification(null)}
                  disabled={selectedUsers.size === 0}
                >
                  Notification ({selectedUsers.size})
                </button>
                <button
                  className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-left hover:bg-gray-100 flex items-center gap-2"
                  onClick={handleExportCSV}
                >
                  <FaDownload /> Export CSV
                </button>
                <button
                  className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-left hover:bg-gray-100 flex items-center gap-2"
                  onClick={handleExportPDF}
                >
                  <FaDownload /> Export PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[30px_1fr_1.5fr_1.5fr_0.5fr] font-semibold text-gray-700 mb-2 px-4">
        <span></span>
        <span>ID</span>
        <span>Name</span>
        <span>Email</span>
        <span className="text-right pr-4">Actions</span>
      </div>
      <div className="space-y-2">
        {filteredData.length > 0 ? (
          filteredData.map((item) => renderRow(item, activeTab))
        ) : (
          <p className="text-center text-gray-500 py-6">No matching users found.</p>
        )}
      </div>
      {viewUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 relative mt-10 mb-10">
            <h2 className="text-2xl font-bold text-green-700 mb-4">User Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {Object.entries(viewUser).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-gray-500 font-semibold capitalize">
                    {key.replace(/([A-Z])/g, " $1")}:
                  </span>
                  <span className="text-gray-700 break-all">{String(value)}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setViewUser(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-black text-2xl"
              title="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {showMailForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Send Email
            </h2>
            <p className="text-gray-600 mb-4">
              {Array.isArray(mailRecipient)
                ? `Sending to ${mailRecipient.length} users`
                : `Sending to: ${mailRecipient?.email}`}
            </p>
            <form onSubmit={sendEmail}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Message</label>
                <textarea
                  value={mailBody}
                  onChange={(e) => setMailBody(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setShowMailForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg text-white ${
                    isSending ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
              </div>
              {mailStatus === "success" && (
                <p className="mt-4 text-center text-green-600">Email sent successfully!</p>
              )}
              {mailStatus === "error" && (
                <p className="mt-4 text-center text-red-600">Failed to send email. Please try again.</p>
              )}
            </form>
            <button
              onClick={() => setShowMailForm(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-black text-2xl"
              title="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {showNotificationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Send Notification</h2>
            <p className="text-gray-600 mb-4">
              Sending to: {notificationRecipient.length} users
            </p>
            <form onSubmit={sendNotification}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Message</label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg h-28 sm:h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowNotificationForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg text-white ${
                    isSendingNotification ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={isSendingNotification}
                >
                  {isSendingNotification ? "Sending..." : "Send"}
                </button>
              </div>
              {notificationStatus === "success" && (
                <p className="mt-4 text-center text-green-600">Notification sent successfully!</p>
              )}
              {notificationStatus === "error" && (
                <p className="mt-4 text-center text-red-600">Failed to send notification. Please try again.</p>
              )}
            </form>
            <button
              onClick={() => setShowNotificationForm(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-black text-2xl"
              title="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserData;