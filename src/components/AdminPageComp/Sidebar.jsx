import React, { useState } from "react";
import {
  FiUsers,
  FiHome,
  FiStar,
  FiLogOut,
  FiMenu,
  FiX,
  FiMapPin,
  FiTrash2,
  FiMessageCircle,
  FiUserPlus,
  FiBriefcase,
  FiClock,
  FiClipboard,
  FiDownload,
  FiEye,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { LuCrown } from "react-icons/lu";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { FaCommentSms } from "react-icons/fa6";

export default function Sidebar({
  activeTab,
  setActiveTab,
  handleLogout,
  pendingCount,
  role,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({}); // track expanded/collapsed state

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const sections = [
    {
      title: "User Management",
      icon: <FiUsers className="text-gray-400" />,
      items: [
        { label: "Users", value: "Users", icon: <FiUsers /> },
        { label: "Leads", value: "Leads", icon: <FiUserPlus /> },
        {
          label: "CallBack Requests",
          value: "Requests",
          icon: <VscGitPullRequestGoToChanges />,
        },
        {
          label: "Subscribers",
          value: "UltimateSubscribers",
          icon: <LuCrown />,
        },
      ],
    },
    {
      title: "Property Management",
      icon: <FiHome className="text-gray-400" />,
      items: [
        { label: "Properties", value: "Properties", icon: <FiHome /> },
        { label: "Featured Property", value: "NewlyListed", icon: <FiStar /> },
        { label: "Top Locations", value: "ManageLocations", icon: <FiMapPin /> },
        { label: "Old Properties", value: "OldProperties", icon: <FiClock /> },
        {
          label: "Posted Requirement",
          value: "PostRequirement",
          icon: <FiClipboard />,
        },
        ...(role === "Owner"
          ? [
              {
                label: "Visit Track",
                value: "VisitTrack",
                icon: <FiEye />,
              },
              {
                label: "Deleted Properties",
                value: "DeletedProperties",
                icon: <FiTrash2 />,
              },
            ]
          : []),
      ],
    },
    {
      title: "Business & Careers",
      icon: <FiBriefcase className="text-gray-400" />,
      items: [
        ...(role === "Owner"
          ? [
              { label: "Careers", value: "Careers", icon: <FiBriefcase /> },
              {
                label: "RM Assignments",
                value: "RMAssignments",
                icon: <FiUsers />,
              },
              {
                label: "Withdrawal Requests",
                value: "Withdrawals",
                icon: <FiDownload />,
              },
            ]
          : []),
      ],
    },
    {
      title: "Communication",
      icon: <FaCommentSms className="text-gray-400" />,
      items: [
        {
          label: "Pending Queries",
          value: "PendingQueries",
          icon: <FiMessageCircle />,
          badge: pendingCount,
        },
        { label: "Send SMS", value: "SendSMS", icon: <FaCommentSms /> },
        { label: "Marketing", value: "Marketing", icon: <FiStar /> },
      ],
    },
  ];

  const handleTabClick = (value) => {
    setActiveTab(value);
    setIsOpen(false); // close on mobile
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between bg-white p-4 shadow-md sticky top-0 z-40">
        <h2 className="text-xl font-bold text-indigo-700">{role} Panel</h2>
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
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed top-0 lg:top-20 left-0 z-50 lg:z-30 w-64 bg-white shadow-lg border-r h-full transform transition-transform duration-300 ease-in-out
        lg:h-[calc(100vh-5rem)] flex flex-col`}
      >
        {/* Desktop Header */}
        <div className="p-6 border-b hidden lg:flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-indigo-700">{role} Panel</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition px-3 py-1 rounded-md border border-red-200"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-3 space-y-4 overflow-y-auto scrollbar-hide">
          {sections.map(({ title, icon, items }) =>
            items.length > 0 ? (
              <div key={title} className="border-b pb-2">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(title)}
                  className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:text-indigo-600 transition"
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                  </div>
                  {openSections[title] ? (
                    <FiChevronDown />
                  ) : (
                    <FiChevronRight />
                  )}
                </button>

                {/* Section Items with Smooth Animation */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openSections[title] ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  {items.map(({ label, value, icon, badge }) => (
                    <button
                      key={value}
                      onClick={() => handleTabClick(value)}
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
                      {badge > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
        />
      )}
    </>
  );
}
