import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import brandLogo from "/navbar-assets/brand-logo.png";
import {
  FaHome,
  FaInfoCircle,
  FaListUl,
  FaPhone,
  FaRegCreditCard,
  FaCrown,
} from "react-icons/fa";

export default function Navbar() {
  const [user, setUser] = useState(() => {
    const cache = localStorage.getItem("user");
    return cache ? JSON.parse(cache) : null;
  });

  const syncUser = useCallback(() => {
    const cache = localStorage.getItem("user");
    setUser(cache ? JSON.parse(cache) : null);
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-change", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-change", syncUser);
    };
  }, [syncUser]);

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dashRoute = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/admin-dashboard";
      case "owner":
        return "/owner-dashboard";
      default:
        return "/dashboard";
    }
  };

  const drawerV = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileOpen &&
        window.innerWidth < 640 &&
        !event.target.closest(".profile-dropdown-wrapper")
      ) {
        setProfileOpen(false);
      }
    }

    function handleScroll() {
      if (window.innerWidth < 640) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [profileOpen]);

  return (
    <header>
      <nav
        style={{ fontFamily: "para_font" }}
        className="fixed top-0 w-full h-[5rem] flex items-center justify-between px-3 md:px-8 bg-white shadow-sm z-50"
      >
        <div className="flex items-center justify-center gap-3 ">
          {/* Hamburger Menu */}
          <button
            aria-label="Toggle menu"
            className="w-6 h-6 sm:w-10 sm:h-10 mt-3 lg:mt-0 relative text-zinc-700"
            onClick={() => setOpen((p) => !p)}
          >
            <Hamburger animatedOpen={open} />
          </button>

          <Link to="/" aria-label="Homepage" className="flex items-center">
            <img
              src={brandLogo}
              alt="brand logo"
              loading="eager"
              fetchPriority="high"
              className={`w-24 sm:w-36 md:w-48 lg:h-24 mt-4 transition-opacity duration-500 `}
            />
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 relative">
          <Link
            style={{ fontFamily: "para_font" }}
            to="/add-properties"
            className="px-3 py-1.5 text-[9px] sm:px-4 sm:py-2 sm:text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg  shadow transition"
          >
            Add&nbsp;Property{" "}
            <span className="text-green-500 lg:text-xs text-[9px]">Free</span>
          </Link>

          {/* Profile Dropdown */}
          <div
            className="relative group profile-dropdown-wrapper"
            onMouseEnter={() =>
              window.innerWidth >= 640 && setProfileOpen(true)
            }
            onMouseLeave={() =>
              window.innerWidth >= 640 && setProfileOpen(false)
            }
          >
            <button
              onClick={() => {
                if (window.innerWidth < 640) setProfileOpen((prev) => !prev);
              }}
              className="flex items-center gap-1 text-zinc-700"
            >
              {user && (
                <span className="hidden sm:inline capitalize text-sm font-medium">
                  Hello, {user.firstName}
                </span>
              )}
              <FaUserCircle className="text-2xl" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-50 border"
                >
                  <div className="px-4 py-2 text-blue-600 font-semibold text-sm border-b">
                    {user ? "My Account" : "LOGIN / REGISTER"}
                  </div>
                  <div className="flex flex-col px-4 py-2 text-sm text-zinc-800 font-medium space-y-2">
                    {user ? (
                      <Link
                        to={dashRoute()}
                        onClick={() => setProfileOpen(false)}
                        className="hover:text-blue-600"
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setProfileOpen(false)}
                        className="hover:text-blue-600"
                      >
                        Login
                      </Link>
                    )}
                    <Link
                      to="/view-properties"
                      onClick={() => setProfileOpen(false)}
                      className="hover:text-blue-600"
                    >
                      View Listings
                    </Link>
                    {user && (
                      <Link
                        to="/contact"
                        onClick={() => setProfileOpen(false)}
                        className="hover:text-blue-600"
                      >
                        Contact Support
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              variants={drawerV}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 z-50 h-full w-[80vw] sm:w-[65vw] md:w-80 bg-white backdrop-blur-md shadow-2xl rounded-r-2xl px-6 py-6 flex flex-col"
            >
              {/* Header: Explore + Close */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-blue-600 text-2xl font-bold tracking-wide">
                  Explore
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-zinc-700 text-2xl hover:rotate-90 transition-transform duration-300"
                  aria-label="Close drawer"
                >
                  ✕
                </button>
              </div>

              {/* Optional User Section */}

              {/* Navigation */}
              <motion.ul
                className="space-y-3 text-zinc-800 font-medium text-base"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Section 1: Main Links */}
                <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1 mt-2">
                  Main
                </p>
                {[
                  ["Home", <FaHome />, "/", false],
                  ["About", <FaInfoCircle />, "/about", false],
                  ["Listing", <FaListUl />, "/view-properties", false],
                  ["Contact", <FaPhone />, "/contact", false],
                ].map(([label, icon, href]) => (
                  <li key={href}>
                    <Link
                      to={href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all group hover:bg-blue-100"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                        {icon}
                      </span>
                      <span className="truncate group-hover:translate-x-1 transition-transform duration-200">
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}

                {/* Section 2: Premium */}
                <p className="text-xs text-zinc-400 uppercase tracking-wide mt-6 mb-1">
                  Premium
                </p>
                <li>
                  <Link
                    to="/subscription"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-300 to-yellow-100 text-yellow-900 shadow border border-yellow-400 group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                      <FaRegCreditCard />
                    </span>
                    <span className="truncate group-hover:translate-x-1 transition-transform duration-200">
                      EMS Subscription Plans
                    </span>
                  </Link>
                </li>
              </motion.ul>

              {/* Footer Actions */}
              <div
                style={{ fontFamily: "heading_font" }}
                className="mt-auto text-xs lg:text-lg pt-6 border-t border-zinc-200"
              >
                Making Urban Living Easy
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hamburger({ animatedOpen }) {
  const topV = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: 45, translateY: 8 },
  };
  const centerV = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  };
  const bottomV = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: -45, translateY: -8 },
  };

  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      strokeLinecap="round"
      className="absolute inset-0 m-auto"
    >
      <motion.line
        x1="3"
        x2="21"
        y1="6"
        y2="6"
        variants={topV}
        initial="closed"
        animate={animatedOpen ? "open" : "closed"}
      />
      <motion.line
        x1="3"
        x2="21"
        y1="12"
        y2="12"
        variants={centerV}
        initial="closed"
        animate={animatedOpen ? "open" : "closed"}
      />
      <motion.line
        x1="3"
        x2="21"
        y1="18"
        y2="18"
        variants={bottomV}
        initial="closed"
        animate={animatedOpen ? "open" : "closed"}
      />
    </motion.svg>
  );
}
