// RMDashboard.jsx
import React, { useState } from "react";
import RMDashboardSidebar from "../../components/RmUserComp/Sidebar";
import BookingSchedule from "../../components/RmUserComp/BookingSchedule";
import AssignedUserBooking from "../../components/RmUserComp/AssignedUserBooking";
import AssignedUsers from "../../components/RmUserComp/AssignedUsers";
import RequestsTable from "../../components/AdminPageComp/RequestsPage";
import LeadsTable from "../../components/RmUserComp/LeadsTable";
import LandlordAgents from "../../components/AdminPageComp/LandlordAgents"
import RentPaymentsDashboard from "../../components/OwnerPageComp/RentPaymentsDashboard";
import RequestsTableLandlord from "../../components/AdminPageComp/RequestPageLandlord";
import ContactSalesTable from "../../components/AdminPageComp/ContactSalesTable";
import MyProfile from "../../components/UserPageComp/MyProfile";

export default function RMDashboard() {
  const [activeTab, setActiveTab] = useState("MyProfile");

  return (
    <div className="flex">
      {/* Sidebar */}
      <RMDashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-64 mt-12 lg:mt-0 bg-gray-50 min-h-screen">
        {activeTab === "BookingSchedule" && <BookingSchedule />}
        {activeTab === "AssignedUsersBooking" && <AssignedUserBooking />}
        {activeTab === "RMUsers" && <AssignedUsers />}
        {activeTab === "Leads" && (
          <section>
            <LeadsTable />
          </section>
        )}
        {activeTab === "Requests" && (
          <section className="p-5">
            <RequestsTable />
          </section>
        )}
        {activeTab === "allAccounts" && <LandlordAgents />}
        {activeTab === "RentPayments" && <RentPaymentsDashboard />}
        {activeTab === "RequestsLandlord" && <ContactSalesTable />}
        {activeTab === "ComplaintLandlord" && <RequestsTableLandlord />}
        {activeTab === "MyProfile" && <MyProfile />}



      </main>
    </div>
  );
}
