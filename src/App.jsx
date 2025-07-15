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
import NotFound from "./pages/NotFound";

/* ───── ScrollToTop – jump instantly to top on route change ───── */
function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* ───── Layout – shared UI & global effects ───── */
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

/* ───── App ───── */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* <ScrollToTopButton /> */}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <Routes>
        {/* Routes with Layout (Navbar, padding, etc.) */}
        <Route
          path="/"
          element={
            <Layout>
              <Landing />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <AboutUs />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <ContactPage />
            </Layout>
          }
        />
        <Route
          path="/cancellation-refund"
          element={
            <Layout>
              <CancellationRefundPolicy />
            </Layout>
          }
        />
        <Route
          path="/terms-conditions"
          element={
            <Layout>
              <TermsAndConditions />
            </Layout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <Layout>
              <PolicyPrivacy />
            </Layout>
          }
        />
        <Route
          path="/view-properties"
          element={
            <Layout>
              <ViewAllProperties />
            </Layout>
          }
        />
        <Route
          path="/properties/:id"
          element={
            <Layout>
              <PropertyDetail />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <ProtectedRoute allowedRoles={"user"}>
                <UserDashboard />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/add-properties"
          element={
            <Layout>
              <ProtectedRoute allowedRoles={["user", "admin", "owner"]}>
                <AddProperty />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <Layout>
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin/property/:id"
          element={
            <Layout>
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPropertyDetails />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/owner-dashboard"
          element={
            <Layout>
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* 404 page OUTSIDE Layout – no navbar */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
