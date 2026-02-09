import React from "react";
import { FiUser, FiLogOut } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function LeadUserSidebar({ activeTab, setActiveTab, handleLogout }) {
  const tabs = [
    { label: "My Profile", value: "Profile", icon: <FiUser /> },
    { label: "Saved Properties", value: "SavedProperties", icon: <FaHeart /> },
  ];

  const handleTabClick = (value) => setActiveTab(value);

  const baseBtnClasses = "flex items-center gap-2 px-4 py-2 rounded transition";
  const activeClasses = "bg-indigo-100 text-indigo-700 font-semibold";
  const inactiveClasses = "hover:bg-gray-100 text-gray-700";

  return (
    <>
      {/* Mobile Tabs - top bar */}
      <div className="lg:hidden fixed top-20 left-0 right-0 z-30 bg-zinc-100 border-b border-gray-200 shadow-md">
        <div className="flex overflow-x-auto">
          {tabs.map(({ label, value, icon }) => (
            <button
              key={value}
              onClick={() => handleTabClick(value)}
              className={`flex items-center gap-2 px-5 py-3 flex-shrink-0 border-b-2 transition-colors ${
                activeTab === value ? "border-indigo-600 text-indigo-700 font-semibold" : "border-transparent text-gray-700"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="whitespace-nowrap text-sm">{label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 flex-shrink-0 border-b-2 border-transparent text-red-600 hover:text-red-700 font-medium"
          >
            <FiLogOut className="text-lg" />
            <span className="whitespace-nowrap text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
     <aside className="hidden lg:flex fixed top-20 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-md border-r flex-col">
  <div className="flex items-center justify-between p-6 border-b border-gray-200">
    <h2 style={{ fontFamily: "para_font" }} className="text-xl font-bold text-indigo-700">User Panel</h2>
    <button onClick={handleLogout} className="text-red-600 hover:text-red-700 transition">
      <FiLogOut className="text-xl" />
    </button>
  </div>
  <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
    {tabs.map(({ label, value, icon }) => (
      <button
        key={value}
        onClick={() => handleTabClick(value)}
        className={`${baseBtnClasses} w-full text-left ${activeTab === value ? activeClasses : inactiveClasses}`}
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
