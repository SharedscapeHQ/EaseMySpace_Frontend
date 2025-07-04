import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ViewAllProperties from "./pages/Properties/ViewAllProperties";
import Navbar from "./components/Navbar";
import AboutUs from "./pages/AboutUs";
import AddProperty from "./pages/Properties/AddProperty";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPropertyDetails from "./pages/Admin/AdminPropertyDetails";
import ContactPage from "./pages/ContactPage";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import UserDashboard from "./pages/User/UserDashboard";
import CancellationRefundPolicy from "./components/FooterSectionComp/CancellationRefundPolicy";
import TermsAndConditions from "./components/FooterSectionComp/TermsAndConditions";
import PolicyPrivacy from "./components/FooterSectionComp/PolicyPrivacy";
import useLenis from "./hooks/useLenis";


function Layout({ children }) {
  useLenis(); 
  const location = useLocation();
  // Hide Navbar on login and register pages
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className={!hideNavbar ? "pt-20" : ""}>{children}</main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cancellation-refund" element={<CancellationRefundPolicy />} />
          <Route path="/terms-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PolicyPrivacy />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route
            path="/view-properties"
            element={<ViewAllProperties />}
          />
          <Route
            path="/add-properties"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "owner"]}>
                <AddProperty />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/property/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPropertyDetails />
              </ProtectedRoute>
            }
          />

          {/* Owner-only routes */}
<Route
  path="/owner-dashboard"
  element={
    <ProtectedRoute allowedRoles={["owner"]}>
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>

          {/* Fallback for unknown routes */}
          <Route
            path="*"
            element={
              <div className="p-10 text-center text-red-600 font-bold">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
