import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data } = await axios.get("https://api.easemyspace.in/api/auth/me", {
          withCredentials: true,
        });

        if (!allowedRoles.includes(data.role)) {
          toast.error("Access denied: You are not authorized to view this page.");
          navigate("/", { replace: true });
        } else if (isMounted) {
          setIsAuthorized(true);
        }
      } catch (err) {
        toast.error("Please log in first.");
        navigate("/login", { replace: true });
      }
    };

    checkAuth();

    return () => {
      isMounted = false; // cleanup
    };
  }, [allowedRoles, navigate]);

  if (isAuthorized === null) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="pt-20 text-center text-indigo-600 font-semibold">
          Verifying access...
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  );
}
