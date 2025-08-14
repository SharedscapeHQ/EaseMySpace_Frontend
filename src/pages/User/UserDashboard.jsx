import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProperties,
  submitQuery,
  getRecentlyViewedProperties,
  getUserSubscription,
} from "../../api/userApi";

import Sidebar from "../../components/UserPageComp/Sidebar";
import PropertyCard from "../../components/UserPageComp/PropertyCard";
import RaiseQueryModal from "../../components/UserPageComp/RaiseQueryModal";
import MyQueries from "../../components/UserPageComp/MyQueries";
import MyPlanDetails from "../../components/UserPageComp/MyPlanDetails";
import UnlockedCards from "../../components/UserPageComp/UnlockedCards";
import RecentlyViewed from "../../components/UserPageComp/RecentlyViewed";
import { logoutUser } from "../../api/authApi";
import { FiClock } from "react-icons/fi";
import DedicatedRM from "../../components/UserPageComp/DedicatedRM";

const TAB_TITLES = {
  MyProperties: "Your Listed Properties",
  MyQueries: "Your Raised Queries",
  MyPlan: "Your Subscription Plan",
  UnlockedContacts: "Unlocked Contacts",
  RecentlyViewed: "Recently Viewed Properties",
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
  const [activeTab, setActiveTab] = useState("MyProperties");

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
      alert("Query submitted successfully.");
      setSelectedProperty(null);
    } catch {
      alert("Failed to submit query.");
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
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        userPlan={userPlan} // Pass plan as prop
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 lg:ml-64">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          {TAB_TITLES[activeTab] || ""}
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
        {activeTab === "MyPlan" && <MyPlanDetails />}
        {activeTab === "UnlockedContacts" && <UnlockedCards />}
        {activeTab === "DedicatedRM" && <DedicatedRM userId={user.id} />}

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
