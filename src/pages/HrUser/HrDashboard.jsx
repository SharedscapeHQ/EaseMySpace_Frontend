// HRMDashboard.jsx
import React, { useState } from "react";
import Sidebar from "../../components/HrUserComp/sidebar";
import CareersPage from "../../components/HrUserComp/CareersPage";

export default function HRMDashboard() {
  const [activeTab, setActiveTab] = useState("Careers");

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-64 bg-gray-50 min-h-screen p-6">
        {activeTab === "Careers" && <CareersPage />}
      </main>
    </div>
  );
}
