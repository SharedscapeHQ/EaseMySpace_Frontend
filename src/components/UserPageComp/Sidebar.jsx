import React, { useState, useEffect, useRef } from "react";
import {
  FiHome,
  FiMessageSquare,
  FiLogOut,
  FiPhoneCall,
  FiCreditCard,
  FiClock,
  FiUser,
  FiCalendar,
  FiGift,
  FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiDollarSign,
  FiTrash2
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { TfiWallet } from "react-icons/tfi";

export default function Sidebar({ activeTab, setActiveTab, handleLogout, userPlan, isOccupant }) {
  
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [expandedSubGroup, setExpandedSubGroup] = useState(null);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState(null);
  const [mobileExpandedSubGroup, setMobileExpandedSubGroup] = useState(null);

  const mobileRef = useRef(null);

  // ==== AUTO CLOSE ON OUTSIDE CLICK ====
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileRef.current && !mobileRef.current.contains(event.target)) {
        setMobileExpandedGroup(null);
        setMobileExpandedSubGroup(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ==== AUTO CLOSE ON SCROLL ====
  useEffect(() => {
    const handleScroll = () => {
      setMobileExpandedGroup(null);
      setMobileExpandedSubGroup(null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleGroup = (group) => {
    setExpandedGroup(expandedGroup === group ? null : group);
  };

  const toggleMobileGroup = (group) => {
    setMobileExpandedGroup(mobileExpandedGroup === group ? null : group);
  };

  const groups = [
    {
      label: "Properties",
      icon: <FiHome />,
      items: [
        { label: "My Properties", value: "MyProperties", icon: <FiHome /> },
        { label: "My Bookings", value: "MyBookings", icon: <FiCalendar /> },
        { label: "Recently Viewed", value: "RecentlyViewed", icon: <FiClock /> },
        { label: "Saved Properties", value: "SavedProperties", icon: <FaHeart /> },
        { label: "Unlocked Contacts", value: "UnlockedContacts", icon: <FiPhoneCall /> },
        { label: "My Queries", value: "MyQueries", icon: <FiMessageSquare /> },
        // { label: "Chat", value: "Chat", icon: <FiMessageSquare /> },
      ],
    },
    ...(isOccupant
      ? [
          {
            label: "Rent & Payments",
            icon: <FiDollarSign />,
            items: [
              { label: "Pay Rent", value: "PayRent", icon: <FiCreditCard /> },
              { label: "Download Receipt", value: "DownloadReceipt", icon: <FiFileText /> },
              { label: "Agreement", value: "Agreement", icon: <FiFileText /> },
            ],
          },
        ]
      : []),
    {
      label: "Account & Services",
      icon: <FiUser />,
      items: [
        { label: "My Profile", value: "MyProfile", icon: <FiUser /> },
        // { label: "KYC Docs", value: "KycDocs", icon: <FiUser /> },
        // { label: "Refer & Earn", value: "ReferEarn", icon: <FiGift /> },
        // { label: "My Wallet", value: "MyWallet", icon: <TfiWallet /> },
        // {
        //   label: "My Plan",
        //   value: "MyPlan",
        //   icon: <FiCreditCard />,
        //   subItems: [
        //     { label: "Seeker Plan", value: "SeekerPlan", icon: <FiCreditCard /> },
        //     { label: "Lister Plan", value: "ListerPlan", icon: <FiCreditCard /> },
        //   ],
        // },
        // { label: "Dedicated RM", value: "DedicatedRM", icon: <FiUser /> },
        { label: "Delete Account", value: "DeleteAccount", icon: <FiTrash2 /> },
      ],
    },
  ];

  const handleTabClick = (value) => {
  setActiveTab(value);

  if (window.innerWidth < 1024) {
    setMobileExpandedGroup(null);
    setMobileExpandedSubGroup(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

  }
};

  return (
    <>
      {/* ===== Mobile Sidebar (Tabbed Style) ===== */}
      <div ref={mobileRef} className="lg:hidden fixed top-20 left-0 right-0 z-30 bg-white border-b shadow-md">

        {/* Tabs Row */}
        <div className="flex gap-3 overflow-x-auto whitespace-nowrap px-3 py-2">
          {groups.map((group) => (
            <button
              key={group.label}
              onClick={() => toggleMobileGroup(group.label)}
              className={`flex items-center gap-2 px-3 py-2 text-xs  rounded-md transition-all
              ${
                mobileExpandedGroup === group.label
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {group.icon} {group.label}
            </button>
          ))}
        </div>

        {/* Expanded Content */}
        {groups.map((group) => (
          <div
            key={group.label}
            className={`overflow-hidden transition-all duration-300 ease-in-out border-t ${
              mobileExpandedGroup === group.label ? "max-h-[350px] opacity-100 py-2" : "max-h-0 opacity-0"
            }`}
          >
            {group.items.map(({ label, value, icon, subItems }) => (
              <div key={value}>
                <button
                  onClick={() =>
                    subItems
                      ? setMobileExpandedSubGroup(
                          mobileExpandedSubGroup === value ? null : value
                        )
                      : handleTabClick(value)
                  }
                  className={`flex items-center justify-between w-full px-6 py-2 rounded-md transition-all duration-200
                  ${
                    activeTab === value
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {icon}
                    {label}
                  </div>
                  {subItems &&
                    (mobileExpandedSubGroup === value ? <FiChevronDown /> : <FiChevronRight />)}
                </button>

                {/* Sub Items */}
                {subItems && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out pl-10
                  ${
                    mobileExpandedSubGroup === value
                      ? "max-h-[150px] opacity-100 pt-1"
                      : "max-h-0 opacity-0 pt-0"
                  }`}
                  >
                    {subItems.map(({ label: sLabel, value: sValue, icon: sIcon }) => (
                      <button
                        key={sValue}
                        onClick={() => handleTabClick(sValue)}
                        className={`flex items-center w-full py-1.5 rounded-md text-sm transition-all duration-200
                      ${
                        activeTab === sValue
                          ? "bg-indigo-100 text-indigo-700"
                          : "hover:bg-gray-200 text-gray-700"
                      }`}
                      >
                        <span className="mr-2">{sIcon}</span>
                        {sLabel}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden lg:flex fixed top-20 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg border-r flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 style={{ fontFamily: "para_font" }} className="text-xl  text-indigo-700">User Panel</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition px-3 py-1 rounded-md border border-red-200"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto scrollbar-hide">
          {groups.map((group) => (
            <div key={group.label} className="border-b pb-2">
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center justify-between w-full px-2 py-2 text-xs  text-gray-600 uppercase tracking-wide hover:text-indigo-600 transition"
              >
                <div className="flex items-center gap-2">
                  {group.icon}
                  <span>{group.label}</span>
                </div>
                {expandedGroup === group.label ? <FiChevronDown /> : <FiChevronRight />}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedGroup === group.label ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                }`}
              >
                {group.items.map(({ label, value, icon, subItems }) => (
                  <div key={value}>
                    <button
                      onClick={() =>
                        subItems
                          ? setExpandedSubGroup(expandedSubGroup === value ? null : value)
                          : handleTabClick(value)
                      }
                      className={`flex items-center justify-between w-full text-left px-4 py-2 rounded-md transition ${
                        activeTab === value
                          ? "bg-indigo-100 text-indigo-700 "
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{icon}</span>
                        <span className="truncate">{label}</span>
                      </div>
                      {subItems &&
                        (expandedSubGroup === value ? <FiChevronDown /> : <FiChevronRight />)}
                    </button>

                    {subItems && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out pl-8 ${
                          expandedSubGroup === value
                            ? "max-h-40 opacity-100 mt-1"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {subItems.map(({ label: subLabel, value: subValue, icon: subIcon }) => (
                          <button
                            key={subValue}
                            onClick={() => handleTabClick(subValue)}
                            className={`flex items-center w-full text-left px-3 py-1.5 rounded-md text-sm transition ${
                              activeTab === subValue
                                ? "bg-indigo-100 text-indigo-700 "
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            <span className="text-base mr-2">{subIcon}</span>
                            {subLabel}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
