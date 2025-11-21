import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiUsers,
  FiBookOpen,
  FiUserPlus,
  FiLogOut,
  FiPhoneCall,
  FiDollarSign,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { CiViewList } from "react-icons/ci";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";

export default function RMDashboardSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState("General");
  const [mobileGroupOpen, setMobileGroupOpen] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const generalItems = [
    { label: "All Booking", value: "BookingSchedule", icon: <FiCalendar /> },
    { label: "Assigned Users", value: "RMUsers", icon: <FiUsers /> },
    { label: "My Bookings", value: "AssignedUsersBooking", icon: <FiBookOpen /> },
    { label: "Leads", value: "Leads", icon: <FiUserPlus /> },
    { label: "CallBack Requests", value: "Requests", icon: <FiPhoneCall /> },
  ];

  const landlordItems = [
    { label: "All Accounts", value: "allAccounts", icon: <FiUsers /> },
    { label: "Rent Payments", value: "RentPayments", icon: <FiDollarSign /> },
    { label: "Contact Sales", value: "RequestsLandlord", icon: <VscGitPullRequestGoToChanges /> },
    { label: "Complaints", value: "ComplaintLandlord", icon: <CiViewList /> },
  ];

  const toggleSection = (title) => {
    setOpenSection(openSection === title ? null : title);
  };

  const renderItems = (items) =>
    items.map(({ label, value, icon }) => (
      <button
        key={value}
        onClick={() => setActiveTab(value)}
        className={`flex items-center justify-between w-full text-left px-4 py-2 rounded-md transition ${
          activeTab === value
            ? "bg-indigo-100 text-indigo-700 font-semibold"
            : "hover:bg-gray-100 text-gray-700"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="truncate">{label}</span>
        </div>
      </button>
    ));

  return (
    <>
      {/* MOBILE VIEW */}
      <div className="lg:hidden fixed top-20 left-0 right-0 z-30 bg-white shadow-md border-b">
        <div className="flex overflow-x-auto no-scrollbar">
          {["General", "Landlords"].map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileGroupOpen(mobileGroupOpen === tab ? null : tab)}
              className={`flex items-center gap-2 px-5 py-3 flex-shrink-0 font-medium ${
                mobileGroupOpen === tab ? "text-indigo-700" : "text-gray-700"
              }`}
            >
              {tab}
              {mobileGroupOpen === tab ? <FiChevronDown /> : <FiChevronRight />}
            </button>
          ))}
        </div>

        {mobileGroupOpen === "General" && (
          <div className="bg-white border-t animate-fadeIn">{renderItems(generalItems)}</div>
        )}

        {mobileGroupOpen === "Landlords" && (
          <div className="bg-white border-t animate-fadeIn">{renderItems(landlordItems)}</div>
        )}
      </div>

      {/* DESKTOP VIEW */}
      <aside className="hidden lg:flex fixed top-20 left-0 z-30 w-64 bg-white shadow-lg border-r h-[calc(100vh-5rem)] flex-col">
        {/* HEADER */}
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-indigo-700">RM Panel</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition px-3 py-1 rounded-md border border-red-200"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-3 space-y-4 overflow-y-auto scrollbar-hide">
          
          {/* GENERAL */}
          <div className="border-b pb-2">
            <button
              onClick={() => toggleSection("General")}
              className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:text-indigo-600"
            >
              <div className="flex items-center gap-2">
                <FiUsers className="text-gray-400" />
                General
              </div>
              {openSection === "General" ? <FiChevronDown /> : <FiChevronRight />}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === "General" ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
              }`}
            >
              {renderItems(generalItems)}
            </div>
          </div>

          {/* LANDLORD */}
          <div className="border-b pb-2">
            <button
              onClick={() => toggleSection("Landlords")}
              className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:text-indigo-600"
            >
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-gray-400" />
                Landlords & Agents
              </div>
              {openSection === "Landlords" ? <FiChevronDown /> : <FiChevronRight />}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === "Landlords" ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
              }`}
            >
              {renderItems(landlordItems)}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
