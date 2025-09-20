import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getUserProperties,
  submitQuery,
  getRecentlyViewedProperties,
  getUserSubscription,
} from "../../api/userApi";

import { toast } from "react-hot-toast";

import Sidebar from "../../components/UserPageComp/Sidebar";
import PropertyCard from "../../components/UserPageComp/PropertyCard";
import RaiseQueryModal from "../../components/UserPageComp/RaiseQueryModal";
import MyQueries from "../../components/UserPageComp/MyQueries";
import MyPlanDetails from "../../components/UserPageComp/MyPlanDetails";
import UnlockedCards from "../../components/UserPageComp/UnlockedCards";
import RecentlyViewed from "../../components/UserPageComp/RecentlyViewed";
import { logoutUser } from "../../api/authApi";
import { FiClock } from "react-icons/fi";
import { AiOutlineWhatsApp } from "react-icons/ai";
import DedicatedRM from "../../components/UserPageComp/DedicatedRM";
import MyBookings from "../../components/UserPageComp/MyBookings";
import ReferAndEarn from "../../components/UserPageComp/ReferAndEarn";
import MyWallet from "../../components/UserPageComp/MyWallet";
import UserChat from "../../components/UserPageComp/UserChat";

const TAB_TITLES = {
  MyProperties: "Your Listed Properties",
  MyQueries: "Your Raised Queries",
  MyPlan: "Your Subscription Plan",
  DedicatedRM: "Your Dedicated RM",
  UnlockedContacts: "Unlocked Contacts",
  RecentlyViewed: "Recently Viewed",
  MyBookings: "Your Bookings",
  ReferEarn: "Invite Friends, Earn Rewards!",
  MyWallet: "Referral Wallet",
};

function LoadingMessage({ message }) {
  return (
    <div className="text-center text-gray-700 font-medium py-6">
      <FiClock className="inline mr-2 animate-spin" /> {message}
    </div>
  );
}

function ErrorMessage({ message }) {
  return <p className="text-red-500">{message}</p>;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "MyProperties";
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);

  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState("");

  const [recentlyViewedProperties, setRecentlyViewedProperties] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState("");

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [userPlan, setUserPlan] = useState(""); // Track user plan

  const [user, setUser] = useState(null);

  // Fetch subscription and store plan
  useEffect(() => {
    getUserSubscription()
      .then((data) => {
        if (data?.plan_name) setUserPlan(data.plan_name.toLowerCase());
      })
      .catch((err) => console.error("❌ Failed to fetch plan:", err));
  }, []);

  // Keep activeTab in sync with URL param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location]);

  // Fetch properties or recently viewed based on active tab
  useEffect(() => {
    window.scrollTo(0, 0);
    if (activeTab === "MyProperties") fetchProperties();
    else if (activeTab === "RecentlyViewed") fetchRecentlyViewed();
  }, [activeTab]);

  const fetchProperties = async () => {
    try {
      setPropertiesLoading(true);
      setPropertiesError("");
      const data = await getUserProperties();
      setProperties(data);
    } catch {
      setPropertiesError("Failed to load properties.");
    } finally {
      setPropertiesLoading(false);
    }
  };

  const fetchRecentlyViewed = async () => {
    try {
      setRecentLoading(true);
      setRecentError("");
      const data = await getRecentlyViewedProperties();
      setRecentlyViewedProperties(data);
    } catch {
      setRecentError("Failed to load recently viewed properties.");
    } finally {
      setRecentLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleQuerySubmit = async (propertyId, message) => {
   try {
  await submitQuery(propertyId, message);
  toast.success("Query submitted successfully.");
  setSelectedProperty(null);
} catch {
  toast.error("Failed to submit query.");
}

  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#dbeafe,#e0f2fe)] flex flex-col lg:flex-row">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        userPlan={userPlan} // Pass plan as prop
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 pt-20 lg:ml-64">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-2xl lg:text-3xl text-black mb-8 flex items-center gap-4"
        >
          {TAB_TITLES[activeTab] || ""}

          <a
            href="https://wa.me/919004463371?text=Hello!%20I%20have%20a%20suggestion%20for%20your%20website."
            target="_blank"
            rel="noopener noreferrer"
            title="Suggest Changes"
            className="text-green-600 hover:text-green-800 transition flex items-center gap-1 text-lg"
          >
            <AiOutlineWhatsApp className="block lg:hidden" />
            <span className="hidden lg:inline-flex items-center gap-1">
              <AiOutlineWhatsApp /> Suggest Changes
            </span>
          </a>
        </h2>

        {activeTab === "MyProperties" && (
          <>
            {propertiesLoading ? (
              <LoadingMessage message="Loading Property details..." />
            ) : propertiesError ? (
              <ErrorMessage message={propertiesError} />
            ) : properties.length === 0 ? (
              <p className="text-center mt-20 text-gray-600">
                You haven't added any properties yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    onRaiseQuery={() => setSelectedProperty(property)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "RecentlyViewed" && (
          <>
            {recentLoading ? (
              <LoadingMessage message="Loading Recently Viewed Properties" />
            ) : recentError ? (
              <ErrorMessage message={recentError} />
            ) : recentlyViewedProperties.length === 0 ? (
              <p className="text-center mt-20 text-gray-600">
                You haven't viewed any properties recently.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentlyViewedProperties.map((property) => (
                  <RecentlyViewed
                    key={property._id}
                    property={property}
                    onRaiseQuery={() => setSelectedProperty(property)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "MyQueries" && <MyQueries />}
        {activeTab === "ReferEarn" && <ReferAndEarn />}
        {activeTab === "MyWallet" && <MyWallet />}
        {activeTab === "MyPlan" && <MyPlanDetails />}
        {activeTab === "UnlockedContacts" && <UnlockedCards />}
        {activeTab === "MyBookings" && <MyBookings />}
        {activeTab === "Chat" && <UserChat />}
        {activeTab === "DedicatedRM" && user && <DedicatedRM userId={user.id} />}

        <RaiseQueryModal
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
          property={selectedProperty}
          onSubmit={handleQuerySubmit}
        />
      </main>
    </div>
  );
}
