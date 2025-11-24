import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LeadUserSidebar from "../../components/LeadUserComp/LeadUserSidebar";
import LeadUserProfile from "../../components/LeadUserComp/LeadUserProfile";
import SavedProperties from "../../components/LeadUserComp/SavedProperties";

const TABS = {
  PROFILE: "Profile",
  MY_PLAN: "MyPlan",
  UNLOCKED_LEADS: "UnlockedLeads",
  SAVED_PROPERTIES: "SavedProperties",
};

export default function LeadUserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS.PROFILE);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div style={{ fontFamily: "para_font" }} className="min-h-screen bg-gray-100 lg:flex">
      <LeadUserSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      <main className="flex-1 p-6 lg:ml-64  lg:pt-6 pt-16 max-w-7xl mx-auto">
        {activeTab === TABS.PROFILE && <LeadUserProfile />}
        {activeTab === TABS.MY_PLAN && <p>My Plan content here...</p>}
        {activeTab === TABS.UNLOCKED_LEADS && <p>Unlocked Leads content here...</p>}
        {activeTab === TABS.SAVED_PROPERTIES && <SavedProperties />}
      </main>
    </div>
  );
}
