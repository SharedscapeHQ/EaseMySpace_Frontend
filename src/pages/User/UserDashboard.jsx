import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getUserProperties,
  submitQuery,
  getRecentlyViewedProperties,
  getUserSubscription,
  checkIfOccupant,
} from "../../api/userApi";
import { logoutUser } from "../../api/authApi";
import { toast } from "react-hot-toast";

import Sidebar from "../../components/UserPageComp/Sidebar";
import PropertyCard from "../../components/UserPageComp/PropertyCard";
import RaiseQueryModal from "../../components/UserPageComp/RaiseQueryModal";
import MyQueries from "../../components/UserPageComp/MyQueries";
import MyPlanDetails from "../../components/UserPageComp/MyPlanDetails";
import UnlockedCards from "../../components/UserPageComp/UnlockedCards";
import RecentlyViewed from "../../components/UserPageComp/RecentlyViewed";
import DedicatedRM from "../../components/UserPageComp/DedicatedRM";
import MyBookings from "../../components/UserPageComp/MyBookings";
import ReferAndEarn from "../../components/UserPageComp/ReferAndEarn";
import MyWallet from "../../components/UserPageComp/MyWallet";
import UserChat from "../../components/UserPageComp/UserChat";
import SavedProperties from "../../components/UserPageComp/SavedProperties";
import PayRent from "../../components/UserPageComp/RentPayments/PayRent";
import DownloadReceipt from "../../components/UserPageComp/RentPayments/DownloadReceipt";
import Agreement from "../../components/UserPageComp/RentPayments/Agreement";
import ListerPlanDetails from "../../components/UserPageComp/ListerPlanDetails";

import { FiClock } from "react-icons/fi";
import { AiOutlineWhatsApp } from "react-icons/ai";
import MyProfile from "../../components/UserPageComp/MyProfile";
import DeleteAccount from "../../components/UserPageComp/DeleteAccount";

const TAB_TITLES = {
  MyProperties: "Your Listed Properties",
  MyQueries: "Your Raised Queries",
  SeekerPlan: "Your Subscription Plan",
  ListerPlan: "Your Subscription Plan",
  DedicatedRM: "Your Dedicated RM",
  UnlockedContacts: "Unlocked Contacts",
  RecentlyViewed: "Recently Viewed",
  MyBookings: "Your Bookings",
  ReferEarn: "Invite Friends, Earn Rewards!",
  MyWallet: "Referral Wallet",
  SavedProperties: "Saved Properties",
  PayRent: "Pay Your Rent",
  DownloadReceipt: "Download Rent Receipts",
  Agreement: "Rental Agreement",
  MyProfile: "My Profile",
  DeleteAccount: "Delete Account",
};

function LoadingMessage({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-700">
      <FiClock className="animate-spin text-2xl mb-2" />
      <p className="font-medium">{message}</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="text-center py-10 text-red-500 font-medium">{message}</div>
  );
}

function EmptyMessage({ message }) {
  return <p className="text-center mt-20 text-gray-600">{message}</p>;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "MyProfile";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [properties, setProperties] = useState([]);
  const [recentlyViewedProperties, setRecentlyViewedProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [userPlan, setUserPlan] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOccupant, setIsOccupant] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && tab !== activeTab) setActiveTab(tab);
  }, [location]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("tab") !== activeTab) {
      params.set("tab", activeTab);
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    getUserSubscription()
      .then((data) => {
        if (data?.plan_name) setUserPlan(data.plan_name.toLowerCase());
      })
      .catch(() => console.error("Failed to fetch plan"));
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setError("");
    if (activeTab === "MyProperties") fetchProperties();
    if (activeTab === "RecentlyViewed") fetchRecentlyViewed();
  }, [activeTab]);

  useEffect(() => {
    async function fetchOccupantStatus() {
      try {
        const isOccupant = await checkIfOccupant();
        setIsOccupant(isOccupant);
      } catch (err) {
        console.error("Failed to check occupant status", err);
      }
    }
    fetchOccupantStatus();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await getUserProperties();
      setProperties(data);
    } catch {
      setError("Failed to load your properties.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentlyViewed = async () => {
    setLoading(true);
    try {
      const data = await getRecentlyViewedProperties();
      setRecentlyViewedProperties(data);
    } catch {
      setError("Failed to load recently viewed properties.");
    } finally {
      setLoading(false);
    }
  };

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
        userPlan={userPlan}
        isOccupant={isOccupant}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 pt-20 lg:ml-64 transition-all duration-300">
        <h2
          style={{ fontFamily: "para_font" }}
          className="text-2xl lg:text-3xl text-black mb-8 flex items-center gap-4"
        >
          {TAB_TITLES[activeTab] || ""}
          <a
            href="https://wa.me/919004463371?text=Hello!%20I%20have%20a%20suggestion%20for%20your%20website."
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800 transition flex items-center gap-1 text-lg"
          >
            <AiOutlineWhatsApp className="block lg:hidden" />
            <span className="hidden lg:inline-flex items-center gap-1">
              <AiOutlineWhatsApp /> Suggest Changes
            </span>
          </a>
        </h2>

        {loading && <LoadingMessage message="Loading content..." />}
        {!loading && error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            {activeTab === "MyProperties" &&
              (properties.length === 0 ? (
                <EmptyMessage message="You haven't added any properties yet." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      onRaiseQuery={() => setSelectedProperty(property)}
                      onAddressUpdated={(updated) => {
                        setProperties((prev) =>
                          prev.map((p) =>
                            p._id === property._id ? { ...p, ...updated } : p,
                          ),
                        );
                      }}
                    />
                  ))}
                </div>
              ))}

            {activeTab === "RecentlyViewed" &&
              (recentlyViewedProperties.length === 0 ? (
                <EmptyMessage message="You haven't viewed any properties recently." />
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
              ))}

            {activeTab === "MyQueries" && <MyQueries />}
            {activeTab === "ReferEarn" && <ReferAndEarn />}
            {activeTab === "MyWallet" && <MyWallet />}
            {activeTab === "SeekerPlan" && <MyPlanDetails />}
            {activeTab === "ListerPlan" && <ListerPlanDetails />}
            {activeTab === "UnlockedContacts" && <UnlockedCards />}
            {activeTab === "MyBookings" && <MyBookings />}
            {activeTab === "Chat" && <UserChat />}
            {activeTab === "DedicatedRM" && user && (
              <DedicatedRM userId={user.id} />
            )}
            {activeTab === "SavedProperties" && <SavedProperties />}
            {activeTab === "MyProfile" && <MyProfile />}
            {activeTab === "DeleteAccount" && <DeleteAccount />}

            {["PayRent", "DownloadReceipt", "Agreement"].includes(activeTab) &&
              !isOccupant && (
                <EmptyMessage message="You are not an occupant of any property. Rent & Payments are not accessible." />
              )}

            {activeTab === "PayRent" && isOccupant && <PayRent />}
            {activeTab === "DownloadReceipt" && isOccupant && (
              <DownloadReceipt />
            )}
            {activeTab === "Agreement" && isOccupant && <Agreement />}
          </>
        )}

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
