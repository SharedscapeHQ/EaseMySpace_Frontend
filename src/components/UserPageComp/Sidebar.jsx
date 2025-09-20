import React from "react";
import {
  FiHome,
  FiMessageSquare,
  FiLogOut,
  FiPhoneCall,
  FiCreditCard,
  FiClock,
  FiUser,
  FiCalendar,
  FiGift ,
} from "react-icons/fi";
import { TfiWallet } from "react-icons/tfi";

import { Link } from "react-router-dom";

export default function Sidebar({ activeTab, setActiveTab, handleLogout, userPlan }) {
  // Define tabs
  const tabs = [
    { label: "My Properties", value: "MyProperties", icon: <FiHome /> },
    { label: "Refer & Earn", value: "ReferEarn", icon: <FiGift /> },
    { label: "My Wallet", value: "MyWallet", icon: <TfiWallet /> },
    { label: "My Plan", value: "MyPlan", icon: <FiCreditCard /> },
    { label: "Dedicated RM", value: "DedicatedRM", icon: <FiUser /> },
    { label: "Unlocked Contacts", value: "UnlockedContacts", icon: <FiPhoneCall /> },
    { label: "Recently Viewed", value: "RecentlyViewed", icon: <FiClock /> },
    { label: "My Queries", value: "MyQueries", icon: <FiMessageSquare /> },
    {label:"chat", value:"Chat", icon:<FiMessageSquare/>}
  ];

  
  

  // Add My Bookings after My Plan (or after Dedicated RM if ultimate)
  const bookingsIndex = userPlan === "ultimate" ? 4 : 3;
  tabs.splice(bookingsIndex, 0, { label: "My Bookings", value: "MyBookings", icon: <FiCalendar /> });

  const handleTabClick = (value) => setActiveTab(value);

  return (
    <>
    <div className="lg:hidden  fixed top-20 left-0 right-0 z-30 bg-zinc-100 border-b border-gray-200 shadow-md">
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



      {/* Desktop Sidebar - unchanged */}
     <aside className="hidden lg:flex fixed top-20 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-md border-r flex-col">
  {/* Header with Logout */}
  <div className="flex items-center justify-between p-6 border-b border-gray-200">
    <h2 className="text-xl font-bold text-indigo-700">User Panel</h2>
    <button onClick={handleLogout} className="text-red-600 hover:text-red-700 transition">
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
