import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import TidioWidget from "./components/Chats/TidioWidget";
import DeletedPropertyDetails from "./pages/Owner/DeletedPropertyDetails";
// import Loader from "./components/Loader/Loader";
import SubscriptionPlans from "./components/Subscription/Subscription";
import UserPropertyDetails from "./components/UserPageComp/UserPropertyDetails";
import LeadUserDashboard from "./pages/LeadUser/LeadUserDashboard";
import ProtectedLeadUserRoute from "./components/ProtectedLeadUserRoute";
import Careers from "./components/AboutUsSectionComp/CareersPageComp/Careers"
import JobDetail from "./components/AboutUsSectionComp/CareersPageComp/JobDetail";
import WhatsAppButton from "./components/Chats/WhatsAppButton";
import RMDashboard from "./pages/RmUser/RmDashboard";
import HRMDashboard from "./pages/HrUser/HrDashboard";
import DemandForm from "./components/DemandSide/RequirementForm";
import RequirementPage from "./pages/Demand/RequirementPage";
import RequirementSummary from "./components/DemandSide/RequirementSummary";
import RequirementDashboard from "./components/DemandSide/RequirementDashboard";

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

  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => setLoading(false), 4000); // 4 seconds
  //   return () => clearTimeout(timer);
  // }, []);

  // if (loading) return <Loader />;

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? "" : "pt-20"}>{children}</main>
    </>
  );
}

const verifiedPhone = localStorage.getItem("user_verified_mobile") || "";

/* ───── App ───── */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* <ScrollToTopButton /> */}
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      {/* <TidioWidget/> */}
      <TidioWidget />
      <WhatsAppButton/>

      <Routes>
        {/* Routes with Layout (Navbar, padding, etc.) */}
        <Route path="/" element={<Layout><Landing /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/careers" element={<Layout><Careers /></Layout>} />
        <Route path="/jobs/:id" element={<Layout><JobDetail /></Layout>} />
        <Route path="/subscription" element={<Layout><SubscriptionPlans /></Layout>} />
        <Route path="/cancellation-refund" element={<Layout><CancellationRefundPolicy /></Layout>} />
        <Route path="/terms-conditions" element={<Layout><TermsAndConditions /></Layout>} />
        <Route path="/privacy-policy" element={<Layout><PolicyPrivacy /></Layout>} />
        <Route path="/view-properties" element={<Layout><ViewAllProperties /></Layout>} />
        <Route path="/properties/:id" element={<Layout><PropertyDetail /></Layout>} />

        <Route path="/dashboard" element={
          <Layout>
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          </Layout>
        } />
        <Route path="/demand-form" element={
          <ProtectedRoute allowedRoles={["user", "owner", "admin"]} showContentBehindPopup={true}>
            <RequirementPage />
          </ProtectedRoute>
        } />
        <Route path="/requirement-dashboard" element={
          <ProtectedRoute allowedRoles={["user"]}>
            <RequirementDashboard />
          </ProtectedRoute>
        } />
        <Route path="/rm-dashboard" element={
          <Layout>
            <ProtectedRoute allowedRoles={["rm"]}>
              <RMDashboard />
            </ProtectedRoute>
          </Layout>
        } />
        <Route path="/hr-dashboard" element={
          <Layout>
            <ProtectedRoute allowedRoles={["hr"]}>
              <HRMDashboard />
            </ProtectedRoute>
          </Layout>
        } />
        <Route path="/lead-dashboard" element={
          <Layout>
            <ProtectedLeadUserRoute>
              <LeadUserDashboard phone={verifiedPhone} />
            </ProtectedLeadUserRoute>
          </Layout>
        } />
        <Route path="/dashboard/my-properties/:id" element={
          <Layout>
            <ProtectedRoute allowedRoles={["user"]}>
              <UserPropertyDetails />
            </ProtectedRoute>
          </Layout>
        } />
        <Route path="/add-properties" element={
          <Layout>
            <ProtectedRoute allowedRoles={["user", "admin", "owner"]}>
              <AddProperty />
            </ProtectedRoute>
          </Layout>
        } />
        <Route path="/admin-dashboard" element={
          <Layout>
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          </Layout>
        } />
        <Route path="/admin/property/:id" element={
          <Layout>
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPropertyDetails />
            </ProtectedRoute>
          </Layout>
        } />
        <Route path="/owner-dashboard" element={
          <Layout>
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          </Layout>
        } />
        <Route path="/owner-dashboard/deleted-property-details/:id" element={
          <Layout>
            <ProtectedRoute allowedRoles={["owner"]}>
              <DeletedPropertyDetails />
            </ProtectedRoute>
          </Layout>
        } />

        {/* 404 page OUTSIDE Layout – no navbar */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
