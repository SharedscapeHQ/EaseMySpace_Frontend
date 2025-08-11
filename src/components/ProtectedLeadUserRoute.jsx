import { Navigate } from "react-router-dom";

function ProtectedLeadUserRoute({ children }) {
  const isVerified = localStorage.getItem("otp_verified") === "true";
  const user = JSON.parse(localStorage.getItem("user"));

  if (!isVerified || user) {
    // Not a lead user or already registered, redirect to login or dashboard
    return <Navigate to={user ? dashRoute(user.role) : "/login"} replace />;
  }
  return children;
}

export default ProtectedLeadUserRoute;