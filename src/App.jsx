import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContextV1";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ViewAllProperties from "./pages/Properties/ViewAllProperties";
import Navbar from "./components/Navbar";
import AboutUs from "./pages/AboutUs";
import AddProperty from "./pages/Properties/AddProperty";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
// import AdminPropertyDetails from "./pages/Admin/AdminPropertyDetails";
import ContactPage from "./pages/ContactPage";
import PropertyDetail from "./pages/Properties/PropertyDetail";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import UserDashboard from "./pages/User/UserDashboard";
import CancellationRefundPolicy from "./components/FooterSectionComp/CancellationRefundPolicy";
import TermsAndConditions from "./components/FooterSectionComp/TermsAndConditions";
import NotFound from "./pages/NotFound";
import DeletedPropertyDetails from "./pages/Owner/DeletedPropertyDetails";
import SubscriptionPlans from "./components/Subscription/Subscription";
import UserPropertyDetails from "./components/UserPageComp/UserPropertyDetails";
import LeadUserDashboard from "./pages/LeadUser/LeadUserDashboard";
import ProtectedLeadUserRoute from "./components/ProtectedLeadUserRoute";
import Careers from "./components/AboutUsSectionComp/CareersPageComp/Careers";
import JobDetail from "./components/AboutUsSectionComp/CareersPageComp/JobDetail";
import WhatsAppButton from "./components/Chats/WhatsAppButton";
import RMDashboard from "./pages/RmUser/RmDashboard";
import HRMDashboard from "./pages/HrUser/HrDashboard";
import RequirementPage from "./pages/Demand/RequirementPage";
import RequirementDashboard from "./components/DemandSide/RequirementDashboard";
import PageWrapper from "./components/PageTranstion/PageWrapper";
import AnalyticsTracker from "./components/Seo/AnalyticsTracker";
import BlogPage from "./pages/BlogPage";
import VisitorTracker from "./components/Tracking/VisitorTracker";
import LifeAtEaseMySpace from "./components/AboutUsSectionComp/LifeAtEMS/LifeAtEaseMySpace";
import ListerSubscription from "./components/Lister-Subscription/ListerSubscription";
import PrivacyPolicy from "./components/FooterSectionComp/PolicyPrivacy";
import AccountDeletion from "./pages/AccountDeletion";
import OpenApp from "./pages/OpenApp";
import GlobalPopups from "./pages/GlobalPopups";
import AppRedirect from "./components/AppRedirect";

/* ───── ScrollToTop ───── */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* ───── Layout ───── */
function Layout({ children }) {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  useEffect(() => {
    document
      .querySelectorAll("img:not([loading])")
      .forEach((img) => img.setAttribute("loading", "lazy"));
  }, [location.pathname]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? "" : "pt-0"}>{children}</main>
    </>
  );
}

const verifiedPhone = localStorage.getItem("user_verified_mobile") || "";

/* ───── Animated Routes ───── */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}

        <Route
          path="/open-app"
          element={
            <PageWrapper>
              {/* <Layout> */}
              <OpenApp />
              {/* </Layout> */}
            </PageWrapper>
          }
        />
        <Route
          path="/app-redirect"
          element={
            <PageWrapper>
              <AppRedirect />
            </PageWrapper>
          }
        />
        <Route
          path="/"
          element={
            <PageWrapper>
              <Layout>
                <Landing />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PageWrapper>
              <Layout>
                <PrivacyPolicy />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/terms-conditions"
          element={
            <PageWrapper>
              <Layout>
                <TermsAndConditions />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/cancellation-refund"
          element={
            <PageWrapper>
              <Layout>
                <CancellationRefundPolicy />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/account-deletion"
          element={
            <PageWrapper>
              <Layout>
                <AccountDeletion />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <Layout>
                <Login />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Layout>
                <Register />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <PageWrapper>
              <Layout>
                <AboutUs />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/contact"
          element={
            <PageWrapper>
              <Layout>
                <ContactPage />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/careers"
          element={
            <PageWrapper>
              <Layout>
                <Careers />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/jobs/:titleAndId"
          element={
            <PageWrapper>
              <Layout>
                <JobDetail />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/life-at-ems"
          element={
            <PageWrapper>
              <Layout>
                <LifeAtEaseMySpace />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/subscription"
          element={
            <PageWrapper>
              <Layout>
                <SubscriptionPlans />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/lister-subscription"
          element={
            <PageWrapper>
              <Layout>
                <ListerSubscription />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/view-properties"
          element={
            <PageWrapper>
              <Layout>
                <ViewAllProperties />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/blog"
          element={
            <PageWrapper>
              <Layout>
                <BlogPage />
              </Layout>
            </PageWrapper>
          }
        />

        {/* Protected */}
        <Route
          path="/properties/:id"
          element={
            <PageWrapper>
              <Layout>
                <PropertyDetail />
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageWrapper>
              <Layout>
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserDashboard />
                </ProtectedRoute>
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/demand-form"
          element={
            <PageWrapper>
              <ProtectedRoute
                allowedRoles={["user", "owner", "admin"]}
                showContentBehindPopup={true}
              >
                <RequirementPage />
              </ProtectedRoute>
            </PageWrapper>
          }
        />
        <Route
          path="/requirement-dashboard"
          element={
            <PageWrapper>
              <ProtectedRoute allowedRoles={["user", "owner", "admin"]}>
                <RequirementDashboard />
              </ProtectedRoute>
            </PageWrapper>
          }
        />
        <Route
          path="/rm-dashboard"
          element={
            <PageWrapper>
              <Layout>
                <ProtectedRoute allowedRoles={["rm"]}>
                  <RMDashboard />
                </ProtectedRoute>
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/hr-dashboard"
          element={
            <PageWrapper>
              <Layout>
                <ProtectedRoute allowedRoles={["hr"]}>
                  <HRMDashboard />
                </ProtectedRoute>
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/lead-dashboard"
          element={
            <PageWrapper>
              <Layout>
                <ProtectedLeadUserRoute>
                  <LeadUserDashboard phone={verifiedPhone} />
                </ProtectedLeadUserRoute>
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/add-properties"
          element={
            <PageWrapper>
              <Layout>
                <ProtectedRoute
                  allowedRoles={["user", "admin", "owner"]}
                  showContentBehindPopup
                >
                  <AddProperty />
                </ProtectedRoute>
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PageWrapper>
              <Layout>
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              </Layout>
            </PageWrapper>
          }
        />

        <Route
          path="/owner-dashboard"
          element={
            <PageWrapper>
              <Layout>
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerDashboard />
                </ProtectedRoute>
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="/owner-dashboard/deleted-property-details/:id"
          element={
            <PageWrapper>
              <Layout>
                <ProtectedRoute allowedRoles={["owner"]}>
                  <DeletedPropertyDetails />
                </ProtectedRoute>
              </Layout>
            </PageWrapper>
          }
        />
        <Route
          path="*"
          element={
            <PageWrapper>
              <NotFound />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

/* ───── App ───── */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <VisitorTracker />
        <ScrollToTop />
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        <WhatsAppButton />
        <GlobalPopups />
        <AnimatedRoutes />
        <AnalyticsTracker />
      </BrowserRouter>
    </AuthProvider>
  );
}
