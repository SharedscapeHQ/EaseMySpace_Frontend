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
        const { data } = await axios.get(
          "https://api.easemyspace.in/api/auth/me",
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
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Access Restricted</h2>
          <p className="text-sm text-gray-600 mb-4">
            For security reasons, you need to log in with the correct account to use this page.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
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
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Access Restricted</h2>
                <p className="text-sm text-gray-600 mb-4">
                  For security reasons, you need to log in with the correct account to use this page.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          children
        ))}
    </>
  );
}
