import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const checkAuth = async () => {
      try {
  const { data } = await axios.get("https://api.easemyspace.in/api/auth/me", { withCredentials: true });
  if (!allowedRoles.includes(data.role)) {
    toast.error("Access denied");
    navigate("/", { replace: true });
  } else {
    setIsAuthorized(true);
  }
} catch (err) {
  console.error("Auth check error:", err.response?.data || err.message);
  toast.error("Please log in first.");
  navigate("/login", { replace: true });
}
    };

    checkAuth();

    return () => {
      controller.abort();
    };
  }, [allowedRoles, navigate]);

  if (isAuthorized === null) {
    return (
      <div className="pt-20 text-center text-indigo-600 font-semibold">
        Verifying access...
      </div>
    );
  }

  return <>{children}</>;
}
