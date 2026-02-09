import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

export default function InvoiceModal({ isOpen, onClose, invoiceUrl }) {
  const handleDownload = () => {
    if (!invoiceUrl) return;
    window.open(invoiceUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl p-8 w-11/12 max-w-md text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <IoClose size={26} />
            </button>

            <h2 style={{ fontFamily: "para_font" }} className="text-2xl font-extrabold mb-3 text-gray-900">
              Payment Successful
            </h2>
            <p className="mb-6 text-gray-600">
              Your subscription is activated. Download your invoice below.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={!invoiceUrl}
              className={`${
                invoiceUrl
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white px-8 py-3 rounded-xl shadow-lg transition `}
            >
              {invoiceUrl ? "Download Invoice" : "Invoice Not Ready"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
