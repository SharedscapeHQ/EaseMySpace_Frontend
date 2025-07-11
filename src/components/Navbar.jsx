import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import brandLogo from "/navbar-assets/brand-logo.png";

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
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 230, damping: 26 },
    },
    exit: { x: "100%", transition: { duration: 0.28 } },
  };

  return (
    <header>
      <nav className="fixed top-0 w-full h-[5rem] flex items-center justify-between px-4 md:px-8 lg:pl-16 bg-white/40 backdrop-blur-md shadow-sm z-50">
        <Link to="/" aria-label="Homepage" className="flex items-center">
          <img
            src={brandLogo}
            alt="brand logo"
            className="w-32 sm:w-36 md:w-52 lg:h-24 mt-4"
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5 relative">
          <Link
            to="/add-properties"
            className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-base bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-semibold shadow transition"
          >
            Add&nbsp;Property <span className="text-green-500 text-sm">Free</span>
          </Link>

          {/* Profile Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => window.innerWidth >= 640 && setProfileOpen(true)}
            onMouseLeave={() => window.innerWidth >= 640 && setProfileOpen(false)}
          >
            <button
              onClick={() => {
                if (window.innerWidth < 640) setProfileOpen((prev) => !prev);
              }}
              className="flex items-center gap-1 text-zinc-700"
            >
              {user && (
                <span className="hidden sm:inline text-sm font-medium">
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

          {/* Hamburger Menu */}
          <button
            aria-label="Toggle menu"
            className="w-8 h-8 sm:w-10 sm:h-10 relative text-zinc-700"
            onClick={() => setOpen((p) => !p)}
          >
            <Hamburger animatedOpen={open} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              key="drawer"
              variants={drawerV}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-[5rem] right-0 h-[calc(100vh-5rem)] 
                         w-[80vw] sm:w-[65vw] md:w-80 
                         bg-white/95 backdrop-blur-lg shadow-xl z-50 
                         rounded-l-2xl px-6 py-8 flex flex-col"
            >
              <ul className="flex flex-col gap-6 font-semibold text-zinc-800 text-lg">
                {[
                  ["Home", "/"],
                  ["About", "/about"],
                  ["Listing", "/view-properties"],
                  ["Contact", "/contact"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link to={href} onClick={() => setOpen(false)}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
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
