import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function LandingPopup({ onClose }) {
  return (
    <AnimatePresence>
      {onClose && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ fontFamily: "universal_font" }}
        >
          <motion.div
            className="bg-white rounded-2xl text-center shadow-2xl max-w-md w-[90%] p-6 relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={onClose} // use parent handler
            >
              <FiX size={24} />
            </button>

            <h2 style={{ fontFamily: "para_font" }} className="text-xl font-bold text-gray-900 mb-2">Welcome to EaseMySpace™</h2>
            <p className="text-gray-600 mb-5">
              Hi, you're just a few clicks away from finding/listing your home
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/demand-form"
                className="flex-1 text-center bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
              >
                Post Requirement
              </Link>
              <Link
                to="/add-properties"
                className="flex-1 text-center bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
              >
                Add Property
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
