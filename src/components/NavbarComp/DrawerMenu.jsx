import { Link } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaBuilding,
  FaPhone,
  FaRegCreditCard,
  FaBlog,
  FaUserTie,
  FaKey,
} from "react-icons/fa";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import playBadge from "/app_assets/GetItOnGooglePlay_Badge_Web_color_English.svg";
import AppleBadge from "/app_assets/AppleStoreButton.png";


export default function DrawerMenu({ open, setOpen }) {
  const [showSubmenu, setShowSubmenu] = useState(false);

  return (
    <div className="relative">
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-35 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[80vw] sm:w-[65vw] md:w-80 
        bg-white dark:bg-zinc-900 backdrop-blur-md shadow-2xl rounded-r-2xl px-6 py-6 
        flex flex-col transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: "para_font" }} className="text-blue-600 dark:text-blue-400 text-2xl  tracking-wide">
            Explore
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-zinc-700 dark:text-zinc-300 text-2xl hover:rotate-90 transition-transform duration-300"
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        {/* Menu List */}
        <ul className="space-y-3 text-zinc-800 dark:text-zinc-200 font-medium text-base">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-1 mt-2">
            Main
          </p>

          {[
            ["Home", <FaHome />, "/"],
            ["About Us", <FaInfoCircle />, "/about"],
            ["Listings", <FaBuilding />, "/view-properties"],
            ["Contact", <FaPhone />, "/contact"],
            ["Blog", <FaBlog />, "/blog"],
          ].map(([label, icon, href]) => (
            <li key={href}>
              <Link
                to={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all group hover:bg-blue-100 dark:hover:bg-zinc-800"
              >
                <span className="text-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200">
                  {icon}
                </span>
                <span className="truncate group-hover:translate-x-1 transition-transform duration-200">
                  {label}
                </span>
              </Link>
            </li>
          ))}

          {/* Premium Section */}
          <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mt-6 mb-1">
            Premium
          </p>

          {/* Subscription Main Button */}
          <li>
            <button
              onClick={() => setShowSubmenu((prev) => !prev)}
              className={`flex w-full items-center justify-between gap-3 px-4 py-2 rounded-lg
                bg-gradient-to-r from-yellow-300 to-yellow-100 
                dark:from-yellow-600 dark:to-yellow-700 
                text-yellow-900 dark:text-yellow-100 shadow border 
                border-yellow-400 dark:border-yellow-600 group transition-all duration-300
                ${showSubmenu ? "ring-2 ring-yellow-400 dark:ring-yellow-500" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg text-yellow-700 dark:text-yellow-200 group-hover:scale-110 transition-transform duration-200">
                  <FaRegCreditCard />
                </span>
                <span className="truncate ">
                  EMS Subscription Plans
                </span>
              </div>
              {showSubmenu ? (
                <FiChevronUp className="text-yellow-700 dark:text-yellow-200 transition-transform duration-300" />
              ) : (
                <FiChevronDown className="text-yellow-700 dark:text-yellow-200 transition-transform duration-300" />
              )}
            </button>

            {/* Animated Submenu */}
            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${
                showSubmenu ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="ml-6 space-y-2 text-sm">
                <li>
                  <Link
                    to="/subscription"
                    onClick={() => {
                      setOpen(false);
                      setShowSubmenu(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-yellow-100 dark:hover:bg-zinc-800 transition-all duration-200"
                  >
                    <FaUserTie className="text-yellow-600 dark:text-yellow-300 text-lg" />
                    <span>Seeker Subscription</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/lister-subscription"
                    onClick={() => {
                      setOpen(false);
                      setShowSubmenu(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-yellow-100 dark:hover:bg-zinc-800 transition-all duration-200"
                  >
                    <FaKey className="text-yellow-600 dark:text-yellow-300 text-lg" />
                    <span>Lister Subscription</span>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        {/* Footer */}
     <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-700">
  <div className="flex items-center justify-around gap-4">
    
    {/* Android */}
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-500 mb-1">Android</span>
      <a
        href="https://play.google.com/store/apps/details?id=com.easemyspace.app"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={playBadge}
          alt="Get it on Google Play"
          className="h-10 w-auto"
        />
      </a>
    </div>

    {/* iOS */}
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-500 mb-1">iOS (Apple)</span>
      <a
        href="https://apps.apple.com/in/app/easemyspace/id6758399361"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={AppleBadge}
          alt="Download on the App Store"
          className="h-10 w-auto"
        />
      </a>
    </div>

  </div>
</div>

      </aside>
    </div>
  );
}
