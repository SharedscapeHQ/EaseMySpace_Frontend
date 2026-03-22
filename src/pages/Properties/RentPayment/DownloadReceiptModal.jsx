import React from "react";
import { AiOutlineClose, AiOutlineDownload } from "react-icons/ai";

export default function DownloadReceiptModal({ isOpen, onClose, receiptUrl }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
          onClick={onClose}
        >
          <AiOutlineClose size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
          Payment Successful!
        </h2>

        <p className="text-gray-700 text-center mb-6">
          Your payment has been completed. You can download your receipt below.
        </p>

        <div className="flex justify-center">
          <a
            href={receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            <AiOutlineDownload />
            Download Receipt
          </a>
        </div>
      </div>
    </div>
  );
}