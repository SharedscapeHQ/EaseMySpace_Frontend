import React from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";

export default function LoginPopup({ isOpen, onClose, onLoginClick }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={{fontFamily:"para_font"}} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Login Required
        </h2>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Please login to continue with payment.
        </p>

        <button
          onClick={onLoginClick}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>,
    document.body
  );
}
