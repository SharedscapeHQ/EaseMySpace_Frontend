import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiHome,
  FiStar,
  FiLogOut,
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
  FiDollarSign,
  FiPhone,
  FiFlag,
  FiImage,
} from "react-icons/fi";
import { LuCrown } from "react-icons/lu";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { CiViewList } from "react-icons/ci";
import { FaCommentSms } from "react-icons/fa6";

export default function Sidebar({
  activeTab,
  setActiveTab,
  handleLogout,
  pendingCount,
  role,
}) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
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
        {
          label: "User Posts",
          value: "UserPosts",
          icon: <FiImage />,
        },
      ],
    },
    {
      title: "Property Management",
      icon: <FiHome className="text-gray-400" />,
      items: [
        { label: "Properties", value: "Properties", icon: <FiHome /> },
        { label: "Featured Property", value: "NewlyListed", icon: <FiStar /> },
        {
          label: "Top Locations",
          value: "ManageLocations",
          icon: <FiMapPin />,
        },
        { label: "Old Properties", value: "OldProperties", icon: <FiClock /> },
        {
          label: "Posted Requirement",
          value: "PostRequirement",
          icon: <FiClipboard />,
        },
        {
          label: "Property Reports",
          value: "PropertyReports",
          icon: <FiFlag />,
        },
        ...(role === "Owner"
          ? [
              { label: "Visit Track", value: "VisitTrack", icon: <FiEye /> },
              {
                label: "Deleted Properties",
                value: "DeletedProperties",
                icon: <FiTrash2 />,
              },
            ]
          : []),
      ],
    },
    ...(role === "Owner"
      ? [
          {
            title: "Business & Careers",
            icon: <FiBriefcase className="text-gray-400" />,
            items: [
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
              {
                label: "Platform Revenue",
                value: "platformRevenue",
                icon: <FiDownload />,
              },
            ],
          },
          {
            title: "Landlords & Agents",
            icon: <FiDollarSign className="text-gray-400" />,
            items: [
              {
                label: "All Accounts",
                value: "allAccounts",
                icon: <FiUsers />,
              },
              {
                label: "Rent Payments",
                value: "RentPayments",
                icon: <FiDollarSign />,
              },
              {
                label: "Rent Withdrawals",
                value: "RentWithdrawals",
                icon: <FiDollarSign />,
              },
            ],
          },
        ]
      : [
          {
            title: "Landlords & Agents",
            icon: <FiDollarSign className="text-gray-400" />,
            items: [
              {
                label: "All Accounts",
                value: "allAccounts",
                icon: <FiUsers />,
              },
              {
                label: "Rent Payments",
                value: "RentPayments",
                icon: <FiDollarSign />,
              },
              {
                label: "Tally Reports",
                value: "TallyReports",
                icon: <FiClipboard />,
              },
              {
                label: "Contact Sales",
                value: "RequestsLandlord",
                icon: <VscGitPullRequestGoToChanges />,
              },
              {
                label: "Complaints",
                value: "ComplaintLandlord",
                icon: <CiViewList />,
              },
            ],
          },
        ]),
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
        // { label: "Marketing", value: "Marketing", icon: <FiStar /> },
      ],
    },
  ];

  const handleTabClick = (value) => {
    setActiveTab(value);
    if (window.innerWidth < 1024) setOpenSections({});
  };

  useEffect(() => {
    const handleScroll = () => setOpenSections({});
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Horizontal Menu */}
      <div className="lg:hidden sticky top-0 z-50 bg-white shadow-md">
        <div className="flex overflow-x-auto relative">
          {sections
            .filter(({ items }) => items.length > 0)
            .map(({ title, icon, items }) => (
              <div key={title} className="relative flex-shrink-0">
                <button
                  onClick={() => toggleSection(title)}
                  className={`flex flex-col items-center px-4 py-2 text-sm font-semibold whitespace-nowrap ${
                    openSections[title] ? "text-indigo-700" : "text-gray-600"
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{title}</span>
                </button>

                <div
                  className={`fixed top-32 left-0 w-full bg-white shadow-lg z-50 border-t transition-all duration-300 ease-in-out ${
                    openSections[title]
                      ? "min-h-70 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="overflow-y-auto">
                    {items.map(({ label, value, icon, badge }) => (
                      <button
                        key={value}
                        onClick={() => handleTabClick(value)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 w-full text-left border-b"
                      >
                        <span className="text-lg">{icon}</span>
                        <span>{label}</span>
                        {badge > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-20 left-0 z-30 w-64 bg-white shadow-lg border-r h-[calc(100vh-5rem)] flex-col">
        <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-indigo-700">{role} Panel</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition px-3 py-1 rounded-md border border-red-200"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-3 space-y-4 overflow-y-auto scrollbar-hide">
          {sections.map(({ title, icon, items }) =>
            items.length > 0 ? (
              <div key={title} className="border-b pb-2">
                <button
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      [title]: !prev[title],
                    }))
                  }
                  className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:text-indigo-600 transition"
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                  </div>
                  {openSections[title] ? <FiChevronDown /> : <FiChevronRight />}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openSections[title]
                      ? "max-h-96 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
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
    </>
  );
}
