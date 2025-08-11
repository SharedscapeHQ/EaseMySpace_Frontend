import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LeadUserSidebar from "../../components/LeadUserComp/LeadUserSidebar";
import LeadUserProfile from "../../components/LeadUserComp/LeadUserProfile";

export default function LeadUserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{fontFamily:"para_font"}} className="min-h-screen bg-gray-100 lg:flex">
      {/* Sidebar */}
      <LeadUserSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 lg:ml-64">
        {activeTab === "Profile" && <LeadUserProfile />}
        {activeTab === "MyPlan" && <p>My Plan content here...</p>}
        {activeTab === "UnlockedLeads" && <p>Unlocked Leads content here...</p>}
      </main>
    </div>
  );
}
