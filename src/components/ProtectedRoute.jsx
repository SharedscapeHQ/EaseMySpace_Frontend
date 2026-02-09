import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({
  allowedRoles = [],
  children,
  showContentBehindPopup = false,
}) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
  const controller = new AbortController();

  const checkAuth = async () => {
    try {
      // ✅ FAST CHECK FIRST
      const { data } = await axios.get(
        "https://api.easemyspace.in/api/auth/check",
        { withCredentials: true, signal: controller.signal }
      );
      const normalizedAllowed = Array.isArray(allowedRoles)
        ? allowedRoles.map((r) => String(r).toLowerCase().trim())
        : [String(allowedRoles).toLowerCase().trim()];

      const userRole = String(data.role || "").toLowerCase().trim();

      if (!normalizedAllowed.includes(userRole)) {
        setShowModal(true);
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    } catch (err) {
      if (err.name === "CanceledError") return;

      console.error("ProtectedRoute: Auth check failed", err);
      setShowModal(true);
      setIsAuthorized(false);
    }
  };

  checkAuth();
  return () => controller.abort();
}, [allowedRoles]);


  const handleCancel = () => {
    setShowModal(false);
    navigate(-1);
  };

  const handleLogin = () => {
  navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`, { replace: true });
};

  if (isAuthorized === null) {
    return (
      <div className="pt-20 text-center text-indigo-600 font-semibold">
        Verifying access...
      </div>
    );
  }

  if (!isAuthorized && !showContentBehindPopup) {
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden">
    

    <h2 style={{ fontFamily: "para_font" }} className="text-2xl font-bold text-gray-800 mb-2 text-center">Oops! You're not logged in</h2>
    <p className="text-sm text-gray-600 mb-6 text-center">
      Sign in with your account to unlock this page.
    </p>

    <div className="flex justify-center gap-4">
      <button
        onClick={handleCancel}
        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
      >
        Cancel
      </button>
      <button
        onClick={handleLogin}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
      >
        Login
      </button>
    </div>

    {/* Optional subtle animation */}
    <div className="absolute inset-0 pointer-events-none animate-pulse rounded-2xl border-2 border-blue-200 opacity-30"></div>
  </div>
</div>

    );
  }

  return (
    <>
      {children &&
        (showContentBehindPopup && showModal ? (
          <div className="relative">
            <div className="opacity-50 pointer-events-none">{children}</div>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden">
    

    <h2 style={{ fontFamily: "para_font" }} className="text-2xl font-bold text-gray-800 mb-2 text-center">Oops! You're not logged in</h2>
    <p className="text-sm text-gray-600 mb-6 text-center">
      Sign in with your account to unlock this page.
    </p>

    <div className="flex justify-center gap-4">
      <button
        onClick={handleCancel}
        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
      >
        Cancel
      </button>
      <button
        onClick={handleLogin}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
      >
        Login
      </button>
    </div>

    {/* Optional subtle animation */}
    <div className="absolute inset-0 pointer-events-none animate-pulse rounded-2xl border-2 border-blue-200 opacity-30"></div>
  </div>
</div>

          </div>
        ) : (
          children
        ))}
    </>
  );
}
