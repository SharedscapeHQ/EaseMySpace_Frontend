import React, { useState } from "react";
import {
  FiUsers,
  FiHome,
  FiStar,
  FiLogOut,
  FiMenu,
  FiX,
  FiAlertCircle, FiMessageSquare, FiMail
} from "react-icons/fi";



export default function Sidebar({ activeTab, setActiveTab, handleLogout, pendingCount , role }) {
  const tabs = [
    { label: "Leads", value: "Leads", icon: <FiUsers /> },
    { label: "Properties", value: "Properties", icon: <FiHome /> },
    { label: "Newly Listed", value: "NewlyListed", icon: <FiStar /> },
    { label: "Pending Queries", value: "PendingQueries", icon: <FiMessageSquare />, badge: pendingCount },
  
  ];
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (value) => {
    setActiveTab(value);
    setIsOpen(false); // close sidebar on mobile
  };

  return (
    <>
      {/* 🟣 Mobile top bar with hamburger */}
      <div className="lg:hidden flex items-center justify-between bg-white p-4 shadow-md sticky top-0 z-50">
        <h2 className="text-xl font-bold text-indigo-700">{role} Panel</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-gray-700">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* 🟢 Sidebar: fixed on large screens, drawer on mobile */}
      <aside
        className={`${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        } fixed top-0 left-0 z-40 w-64 bg-white shadow-md border-r min-h-screen transform transition-transform duration-300 ease-in-out
       lg:fixed lg:top-20 lg:h-[calc(100vh-6rem)]`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b lg:border-none">
          <h2 className="text-xl font-bold text-indigo-700 hidden lg:block">{role} Panel</h2>
        </div>

        {/* Sidebar Tabs */}
        <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
         {tabs.map(({ label, value, icon, badge }) => (
  <button
    key={value}
    onClick={() => handleTabClick(value)}
    className={`flex items-center justify-between w-full text-left px-4 py-2 rounded transition ${
      activeTab === value
        ? "bg-indigo-100 text-indigo-700 font-semibold"
        : "hover:bg-gray-100 text-gray-700"
    }`}
  >
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </div>

    {/* Badge only if count > 0 */}
    {badge > 0 && (
      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
))}

        </nav>

        {/* Logout */}
        <div className="px-6 py-4 border-t lg:border-none mb-24">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-red-600 hover:bg-red-100 px-4 py-2 rounded transition"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 🔲 Mobile dark overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
        />
      )}
    </>
  );
}
