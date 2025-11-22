import React, { useState, useRef, useEffect } from "react";
import { FaShareAlt, FaWhatsapp, FaLink, FaFlag } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser } from "../../api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { submitPropertyReport } from "../../api/userApi";

export default function ShareReportActions({ propertyId }) {
  const [showShare, setShowShare] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [reportType, setReportType] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false); // <-- Loading state

  const dropdownRef = useRef(null);
  const reportRef = useRef(null);
  const navigate = useNavigate();

  // ---- CHECK LOGIN STATUS ----
  useEffect(() => {
    (async () => {
      try {
        const res = await getCurrentUser();
        if (res && res.id) setIsLoggedIn(true);
      } catch {}
      setAuthChecked(true);
    })();
  }, []);

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied");
    setShowShare(false);
  };

  const shareViaWhatsApp = () => {
    const msg = `Check out this property: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    setShowShare(false);
  };

  const handleReportClick = () => {
    if (!authChecked) return;
    if (!isLoggedIn) return setShowLoginPopup(true);

    setShowReport(true);
    setShowShare(false);
  };

  // ---- SUBMIT REPORT ----
  const submitReport = async () => {
    setLoading(true);
    try {
      await submitPropertyReport({
        propertyId,
        type: reportType,
        message,
      });
      toast.success("Property report submitted successfully!");
      setShowReport(false);
      setReportType("");
      setMessage("");
    } catch (err) {
      toast.error("Failed to submit report. Try again!");
    } finally {
      setLoading(false);
    }
  };

  // ---- DISABLE SUBMIT ----
  const isSubmitDisabled = () => {
    if (!reportType) return true;
    if (reportType === "other" && message.trim().length === 0) return true;
    return false;
  };

  // ---- CLOSE POPUPS ----
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowShare(false);
      if (reportRef.current && !reportRef.current.contains(e.target))
        setShowReport(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex items-center gap-2 relative" ref={dropdownRef}>
      {/* SHARE BUTTON */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setShowShare(!showShare);
          setShowReport(false);
        }}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-md transition"
      >
        <FaShareAlt />
      </motion.button>

      {/* REPORT BUTTON */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleReportClick}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-200 shadow-md transition"
      >
        <FaFlag />
      </motion.button>

      {/* SHARE DROPDOWN */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="absolute left-0 mt-12 w-52 bg-white rounded-xl shadow-lg border z-50 flex flex-col py-2"
          >
            <button
              onClick={copyUrlToClipboard}
              className="px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FaLink className="text-gray-600" /> Copy Link
            </button>

            <button
              onClick={shareViaWhatsApp}
              className="px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-green-600"
            >
              <FaWhatsapp /> WhatsApp
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REPORT POPUP */}
      <AnimatePresence>
        {showReport && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={reportRef}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25, type: "spring" }}
              className="bg-white w-80 rounded-2xl shadow-xl p-6 border"
            >
              <h2 className="text-lg font-semibold mb-2 text-gray-900">
                Report Property
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Our team will review your report.
              </p>

              <label className="text-xs font-medium text-gray-700">
                Reason *
              </label>
              <select
                className="w-full border rounded-lg p-2 text-sm mt-1 mb-3 focus:ring-2 focus:ring-red-400 outline-none"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="">Select reason</option>
                <option value="fraud">Fraud Listing</option>
                <option value="duplicate">Duplicate Listing</option>
                <option value="false_info">Incorrect Information</option>
                <option value="misleading">Misleading Photos</option>
                <option value="other">Other</option>
              </select>

              <textarea
                className="w-full border rounded-lg p-2 h-20 text-sm focus:ring-2 focus:ring-red-300 outline-none"
                placeholder={reportType === "other" ? "Please explain the issue *" : "Additional details (optional)"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required={reportType === "other"}
              />

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowReport(false)}
                  className="px-3 py-1 rounded-lg bg-gray-200 text-sm"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  disabled={isSubmitDisabled() || loading}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    !isSubmitDisabled() && !loading
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-red-300 text-white"
                  }`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN POPUP */}
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-xl w-72 text-center">
              <h3 className="text-lg font-semibold mb-2">Login Required</h3>
              <p className="text-sm text-gray-600 mb-4">
                You must be logged in to report.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200"
                  onClick={() => setShowLoginPopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                  onClick={() =>
                    navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
                  }
                >
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
