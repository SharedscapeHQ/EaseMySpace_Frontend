import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiUserCheck, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { logoutUser } from "../../api/authApi";

export default function RMDashboardSidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { label: "Booking Schedule", value: "BookingSchedule", icon: <FiCalendar /> },
    { label: "Assigned Users", value: "AssignedUsers", icon: <FiUserCheck /> },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabClick = (value) => {
    setActiveTab(value);
    setIsOpen(false);
  };

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
      {/* Mobile Header */}
      <div
        style={{ fontFamily: "para_font" }}
        className="lg:hidden flex items-center justify-between bg-white p-4 shadow-md sticky top-0 z-50"
      >
        <h2 className="text-xl font-bold text-indigo-700">RM Panel</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 transition"
          >
            <FiLogOut className="text-xl" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl text-gray-700"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        style={{ fontFamily: "para_font" }}
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed top-0 left-0 z-40 w-64 bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-lg border-r min-h-screen transform transition-transform duration-300 ease-in-out
        lg:fixed lg:top-20 lg:h-[calc(100vh-5rem)] flex flex-col`}
      >
        {/* Desktop Header */}
        <div className="p-6 border-b hidden lg:flex items-center justify-between">
          <h2 style={{ fontFamily: "heading_font" }} className="text-xl text-indigo-700 ">
            RM Panel
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition px-3 py-1 rounded-md border border-red-200"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {tabs.map(({ label, value, icon }) => (
            <button
              key={value}
              onClick={() => handleTabClick(value)}
              className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === value
                  ? "bg-indigo-100 text-indigo-700 shadow-inner"
                  : "hover:bg-indigo-50 hover:text-indigo-700 text-gray-700"
              }`}
              style={activeTab === value ? { fontFamily: "heading_font" } : {}}
            >
              <span className="text-lg">{icon}</span>
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
        />
      )}
    </>
  );
}
