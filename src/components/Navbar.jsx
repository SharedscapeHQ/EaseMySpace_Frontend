//------------------------------------------------------------
// Navbar.jsx – right‑drawer + animated hamburger ↔ X icon
//------------------------------------------------------------
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import brandLogo from "/navbar-assets/brand-logo.png";

/**
 * When you log in / log out in the *same* tab, the browser’s native
 * `storage` event will NOT fire for that tab.  To keep Navbar in sync,
 * dispatch a custom “auth-change” event *immediately after* you update
 * localStorage in your auth logic:
 *
 *   localStorage.setItem("user", JSON.stringify(user));
 *   window.dispatchEvent(new Event("auth-change"));
 *
 *   localStorage.removeItem("user");
 *   window.dispatchEvent(new Event("auth-change"));
 */
export default function Navbar() {
  /* ───────── auth sync ───────── */
  const [user, setUser] = useState(() => {
    const cache = localStorage.getItem("user");
    return cache ? JSON.parse(cache) : null;
  });

  const syncUser = useCallback(() => {
    const cache = localStorage.getItem("user");
    setUser(cache ? JSON.parse(cache) : null);
  }, []);

  useEffect(() => {
    // Fires when another tab changes localStorage
    window.addEventListener("storage", syncUser);
    // Fires when *this* tab dispatches the custom event
    window.addEventListener("auth-change", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-change", syncUser);
    };
  }, [syncUser]);

  /* ───────── state ───────── */
  const [open, setOpen] = useState(false);

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

  /* ───────── motion variants ───────── */
  const drawerV = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 230, damping: 26 },
    },
    exit: { x: "100%", transition: { duration: 0.28 } },
  };

  /* ───────── JSX ───────── */
  return (
    <header>
      {/* Top bar */}
      <nav className="fixed top-0 w-full h-[5rem] flex items-center justify-between px-4 md:px-8 lg:pl-16 bg-white/40 backdrop-blur-md shadow-sm z-50">
        {/* Brand */}
        <Link to="/" aria-label="Homepage" className="flex items-center">
          <img
            src={brandLogo}
            alt="brand logo"
            className="w-32 sm:w-36 md:w-52 lg:h-24 mt-4"
          />
        </Link>

        {/* CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/add-properties"
            className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-base bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-semibold shadow transition"
          >
            Add&nbsp;Property
          </Link>

          {user ? (
            <Link
              to={dashRoute()}
              className="px-4 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-base bg-blue-400 hover:bg-blue-600 text-white rounded-lg font-semibold shadow transition"
            >
              Login
            </Link>
          )}

          {/* Hamburger / X */}
          <button
            aria-label="Toggle menu"
            className="w-8 h-8 sm:w-10 sm:h-10 relative text-zinc-700"
            onClick={() => setOpen((p) => !p)}
          >
            <Hamburger animatedOpen={open} />
          </button>
        </div>
      </nav>

      {/* Drawer + overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />

            {/* right drawer */}
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

      {/* Greeting badge */}
      {user && (
  <div
    className="fixed top-[5rem] right-0 md:flex hidden items-center justify-center bg-blue-700 text-white px-5 py-2 rounded-xl shadow-lg z-40 text-sm font-semibold text-center gap-2 select-none ring-2 ring-indigo-400 animate-pulse-slow"
    style={{ animationDuration: "3s" }}
  >
    <span className="text-2xl">👋</span>
    <span>
      Hello,&nbsp;<span className="font-bold">{user.firstName}</span>!
    </span>
  </div>
)}

    </header>
  );
}

/* ───────── animated hamburger ↔ X ───────── */
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
