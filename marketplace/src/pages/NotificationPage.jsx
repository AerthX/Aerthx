import React, { useEffect, useState } from "react";
import api from "../utils/api"; // adjust path
import { FaBell, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaEnvelopeOpenText } from "react-icons/fa";
import { MdNotificationsActive, MdOutlineNotificationsNone } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
const token = localStorage.getItem("accessToken");
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const endpoint =
          userType?.toLowerCase() === "organization"
            ? "organization"
            : "individual";

      const res = await api.get(`/user/notifications/${endpoint}`);

        setNotifications(res.data.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token, userType]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-emerald-500" />;
      case "error":
        return <FaTimesCircle className="text-red-500" />;
      case "info":
        return <FaInfoCircle className="text-blue-500" />;
      case "message":
        return <FaEnvelopeOpenText className="text-lime-500" />;
      default:
        return <MdNotificationsActive className="text-gray-500" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 14 } },
    hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)", transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white text-gray-900 p-4 sm:p-6 md:p-10 font-sans overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-lime-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center py-12 md:py-16">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 10 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 sm:p-5 md:p-6 rounded-full shadow-2xl inline-block transform -rotate-6 hover:rotate-0 transition-transform duration-500 mb-4">
              <FaBell className="text-4xl sm:text-5xl text-white animate-ring" />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-900 drop-shadow-md leading-tight">
              Message Hub
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-600 max-w-lg mx-auto font-light leading-relaxed">
              Your personal command center for all updates. Stay connected and informed with ease.
            </p>
          </motion.div>
        </header>

        <main className="mt-8 md:mt-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
              <div className="animate-spin-slow rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500"></div>
              <p className="mt-6 text-gray-600 font-medium text-lg">Loading your messages...</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.length === 0 ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100 text-gray-400"
                >
                  <MdOutlineNotificationsNone className="text-6xl sm:text-8xl mb-4" />
                  <p className="text-lg sm:text-xl font-medium text-center">
                    You're all caught up! No new messages. 🎉
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-6 md:space-y-8"
                >
                  {notifications.map((n, idx) => (
                    <motion.div
                      key={n.id || idx}
                      variants={itemVariants}
                      whileHover="hover"
                      className={`relative p-4 sm:p-6 rounded-3xl transition-all duration-300 transform border shadow-lg ${
                        n.read
                          ? "bg-white/70 border-gray-200"
                          : "bg-green-100/90 border-2 border-green-400 shadow-xl"
                      } backdrop-filter backdrop-blur-md`}
                    >
                      {!n.read && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_12px_6px_rgba(34,197,94,0.6)] animate-pulse"
                        />
                      )}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                        <div className={`p-3 sm:p-4 rounded-full flex-shrink-0 ${n.read ? 'bg-gray-100' : 'bg-green-300'}`}>
                          <div className="text-xl sm:text-2xl text-white">
                            {getNotificationIcon(n.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                            {n.title || "Untitled Notification"}
                          </h2>
                          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-1">
                            {n.description || n.message || "No message provided."}
                          </p>
                        </div>
                        <time className="shrink-0 text-xs sm:text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full font-medium self-end sm:self-center mt-2 sm:mt-0 whitespace-nowrap">
                          {new Date(n.timestamp).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </time>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes ring {
          0% { transform: rotate(0deg) scale(1); }
          5% { transform: rotate(15deg) scale(1.1); }
          10% { transform: rotate(-15deg) scale(1.1); }
          15% { transform: rotate(10deg) scale(1.1); }
          20% { transform: rotate(-10deg) scale(1.1); }
          25% { transform: rotate(5deg) scale(1.1); }
          30% { transform: rotate(-5deg) scale(1.1); }
          35% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .animate-ring {
          animation: ring 4s infinite 2s;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NotificationPage;