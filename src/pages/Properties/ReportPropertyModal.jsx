import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { FaFlag } from "react-icons/fa";
import { submitPropertyReport } from "../../api/userApi";
import { AuthContext } from "../../context/AuthContextV1";
import toast from "react-hot-toast";

export default function ReportPropertyModal({ propertyId, onClose }) {
  const { user } = useContext(AuthContext);

  const [reportType, setReportType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReport = async () => {
    if (!user) {
      toast.error("Login required");
      return;
    }

    if (!reportType) {
      toast.error("Please select a reason");
      return;
    }

    setLoading(true);
    try {
      await submitPropertyReport({
        propertyId,
        type: reportType,
        message,
      });

      toast.success("Report submitted");
      onClose();
    } catch {
      toast.error("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md w-80 max-w-full"
      >
        <div className="flex items-center mb-4 gap-2">
          <FaFlag className="text-gray-600 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Report this property
          </h2>
        </div>

        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 mb-3 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
        >
          <option value="">Select reason</option>
          <option value="fraud">Fraud</option>
          <option value="duplicate">Duplicate</option>
          <option value="other">Other</option>
        </select>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Additional details (optional)"
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 mb-4 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600 resize-none"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={submitReport}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
}