import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true,
        });

        if (!allowedRoles.includes(data.role)) {
          alert("Access denied: You are not authorized to view this page.");
          navigate("/", { replace: true });
        } else if (isMounted) {
          setIsAuthorized(true);
        }
      } catch (err) {
        alert("Please log in first.");
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
      <div className="pt-20 text-center text-indigo-600 font-semibold">
        Verifying access...
      </div>
    );
  }

  return children;
}
