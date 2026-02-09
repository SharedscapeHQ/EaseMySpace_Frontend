import React from "react";
import { FiX } from "react-icons/fi";

export default function LoginPromptModal({ onClose, onAction, onSkip }) {
  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div className="relative w-80 sm:w-96 rounded-2xl bg-white p-6 shadow-xl animate-fadeIn">

    {/* Close Button */}
    <button
      className="absolute right-3 top-3 text-gray-400 transition-colors hover:text-gray-600"
      onClick={onClose}
    >
      <FiX size={22} />
    </button>

    {/* Header */}
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-10 w-12 items-center justify-center rounded-full bg-blue-100 leading-none">
  <span className="text-xl">🔒</span>
</div>


      <div>
        <h2 style={{ fontFamily: "para_font" }} className="text-lg font-bold text-gray-800">
          Unlock Your Dashboard
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Access full property details and personalized features
        </p>
      </div>
    </div>

    {/* Content */}
    <div className="mb-6 text-sm text-gray-700">
      <ul className="list-disc space-y-2 pl-5">
        <li>Recently viewed properties</li>
        <li>Manage and add your own properties</li>
        <li>Raise queries for any issues</li>
      </ul>
    </div>

    {/* Skip Text */}
    <p className="mb-6 text-xs text-gray-400">
      You can skip for now and browse anonymously.
    </p>

    {/* Actions */}
    <div className="flex gap-3">
      <button
        onClick={onAction}
        className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Login
      </button>

      <button
        onClick={onSkip || onClose}
        className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
      >
        Skip
      </button>
    </div>

  </div>
</div>



  );
}
