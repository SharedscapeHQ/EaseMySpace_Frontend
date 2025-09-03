import React from "react";
import { FiX } from "react-icons/fi";

export default function LoginPromptModal({ onClose, onAction, onSkip }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80 sm:w-96 relative animate-fadeIn">
        
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
        >
          <FiX size={22} />
        </button>

        {/* Icon or Graphic */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 rounded-full p-4">
            <span role="img" aria-label="lock" className="text-3xl">
              🔒
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Unlock Your Dashboard!
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-sm mb-6 text-center">
          Log in to explore full property details and enjoy your personalized dashboard:
          <ul className="list-disc list-inside mt-2 text-left text-gray-700">
            <li>Recently viewed properties</li>
            <li>Manage and add your own properties</li>
            <li>Raise queries for any issues</li>
          </ul>
          Or skip for now and browse anonymously.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onAction}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Login Now
          </button>
          <button
            onClick={onSkip || onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
