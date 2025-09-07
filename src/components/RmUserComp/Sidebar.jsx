import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiUsers,
  FiBookOpen,
  FiUserPlus,
  FiLogOut,
  FiPhoneCall,
} from "react-icons/fi";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { logoutUser } from "../../api/authApi";

export default function RMDashboardSidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { label: "All Booking", value: "BookingSchedule", icon: <FiCalendar /> }, // calendar = schedule
    { label: "Assigned Users", value: "RMUsers", icon: <FiUsers /> }, // people icon = users
    { label: "My Bookings", value: "AssignedUsersBooking", icon: <FiBookOpen /> }, // book icon = records
    { label: "Leads", value: "Leads", icon: <FiUserPlus /> }, // user-plus = new leads
    { label: "CallBack Requests", value: "Requests", icon: <FiPhoneCall /> }, // phone call = callbacks
  ];

  const navigate = useNavigate();

  const handleTabClick = (value) => setActiveTab(value);

  const handleLogout = async () => {
    try {
      await logoutUser({});
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile Tabs (Horizontal Scroll like User Dashboard) */}
      <div className="lg:hidden fixed top-20 left-0 right-0 z-30 bg-zinc-100 border-b border-gray-200 shadow-md">
        <div className="flex overflow-x-auto scrollbar-hide no-scrollbar">
          {tabs.map(({ label, value, icon }) => (
            <button
              key={value}
              onClick={() => handleTabClick(value)}
              className={`flex items-center gap-2 px-5 py-3 flex-shrink-0 border-b-2 transition-colors ${
                activeTab === value
                  ? "border-indigo-600 text-indigo-700 font-semibold"
                  : "border-transparent text-gray-700"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="whitespace-nowrap text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar (same style as User Dashboard) */}
      <aside className="hidden lg:flex fixed top-20 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-md border-r flex-col">
        {/* Header with Logout */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-indigo-700">RM Panel</h2>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 transition"
          >
            <FiLogOut className="text-xl" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
          {tabs.map(({ label, value, icon }) => (
            <button
              key={value}
              onClick={() => handleTabClick(value)}
              className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded transition ${
                activeTab === value
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
