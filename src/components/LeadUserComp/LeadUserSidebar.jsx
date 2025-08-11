import React, { useState } from "react";
import {
  FiUser,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";

export default function LeadUserSidebar({ activeTab, setActiveTab, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { label: "My Profile", value: "Profile", icon: <FiUser /> },
    // more tabs can be added here...
  ];

  const handleTabClick = (value) => {
    setActiveTab(value);
    setIsOpen(false);
  };

  const baseBtnClasses =
    "flex items-center gap-2 w-full text-left px-4 py-2 rounded transition";
  const activeClasses = "bg-indigo-100 text-indigo-700 font-semibold";
  const inactiveClasses = "hover:bg-gray-100 text-gray-700";
  const logoutClasses = "hover:bg-gray-100 text-red-600 font-medium";

  return (
    <>
      {/* Mobile Menu Button - Always at top */}
      <div className="lg:hidden flex items-center justify-between bg-white p-4 shadow-md sticky top-0 z-50">
        <h2 className="text-xl font-bold text-indigo-700">Guest User</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl text-gray-700"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed top-0 lg:top-20 left-0 z-50 w-64 bg-white shadow-md border-r h-full transform transition-transform duration-300 ease-in-out
        lg:h-[calc(100vh-5rem)]`}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-indigo-700">Guest Panel</h2>
        </div>

        <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
          {tabs.map(({ label, value, icon }) => (
            <button
              key={value}
              onClick={() => handleTabClick(value)}
              className={`${baseBtnClasses} ${
                activeTab === value ? activeClasses : inactiveClasses
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </button>
          ))}

          <button
            onClick={handleLogout}
            className={`${baseBtnClasses} ${logoutClasses}`}
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
        />
      )}
    </>
  );
}
