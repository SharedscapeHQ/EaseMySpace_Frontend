// RMDashboard.jsx
import React, { useState } from "react";
import RMDashboardSidebar from "../../components/RmUserComp/Sidebar";
import BookingSchedule from "../../components/RmUserComp/BookingSchedule";
import AssignedUsers from "../../components/RmUserComp/AssignedUsers";

export default function RMDashboard() {
  const [activeTab, setActiveTab] = useState("BookingSchedule");

  return (
    <div className="flex">
      {/* Sidebar */}
      <RMDashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-64 bg-gray-50 min-h-screen">
        {activeTab === "BookingSchedule" && <BookingSchedule />}
        {activeTab === "AssignedUsers" && <AssignedUsers />}
      </main>
    </div>
  );
}
