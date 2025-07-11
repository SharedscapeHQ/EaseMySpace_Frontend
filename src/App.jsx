import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

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
import PropertyDetail from "./pages/Properties/PropertyDetail";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import UserDashboard from "./pages/User/UserDashboard";
import CancellationRefundPolicy from "./components/FooterSectionComp/CancellationRefundPolicy";
import TermsAndConditions from "./components/FooterSectionComp/TermsAndConditions";
import PolicyPrivacy from "./components/FooterSectionComp/PolicyPrivacy";
import ScrollToTopButton from "./components/ScrollToTopButton";
import useLenis from "./hooks/useLenis";

/* ───────────── ScrollToTop – jump instantly to top on route change ───────────── */
function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* ───────────────────────── Layout – shared UI & global effects ───────────── */
function Layout({ children }) {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  React.useEffect(() => {
    const imgs = document.querySelectorAll("img:not([loading])");
    imgs.forEach((img) => img.setAttribute("loading", "lazy"));
  }, [location.pathname]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? "" : "pt-20"}>{children}</main>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
    <ScrollToTopButton/>


      <Layout>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cancellation-refund" element={<CancellationRefundPolicy />} />
          <Route path="/terms-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PolicyPrivacy />} />
          <Route path="/view-properties" element={<ViewAllProperties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />

          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={"user"}>
              <UserDashboard />
            </ProtectedRoute>
          }/>

          <Route path="/add-properties" element={
            <ProtectedRoute allowedRoles={["user", "admin", "owner"]}>
              <AddProperty />
            </ProtectedRoute>
          }/>

          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }/>

          <Route path="/admin/property/:id" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPropertyDetails />
            </ProtectedRoute>
          }/>

          <Route path="/owner-dashboard" element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }/>

          <Route path="*" element={
            <div className="p-10 text-center text-red-600 font-bold">
              404 – Page Not Found
            </div>
          }/>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
