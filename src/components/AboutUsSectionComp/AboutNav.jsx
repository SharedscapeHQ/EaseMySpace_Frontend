import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaUserCircle, FaHome, FaInfoCircle, FaBuilding, FaPhone, FaRegCreditCard } from "react-icons/fa";
import brandLogo from "/navbar-assets/brand-logo.png";

import Hamburger from "../NavbarComp/Hamburger";
import ProfileDropdown from "../NavbarComp/ProfileDropdown";
import DrawerMenu from "../NavbarComp/DrawerMenu";
import NavbarRightActions from "../NavbarComp/NavbarRightActions";
import { logoutUser } from "../../api/authApi";

export default function AboutNav() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const cache = localStorage.getItem("user");
    return cache ? JSON.parse(cache) : null;
  });
  const [isVerified, setIsVerified] = useState(localStorage.getItem("otp_verified") === "true");

  const syncUser = useCallback(() => {
    const cache = localStorage.getItem("user");
    setUser(cache ? JSON.parse(cache) : null);

    const otpStatus = localStorage.getItem("otp_verified");
    setIsVerified(otpStatus === "true");
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
    if (!user && isVerified) return "/lead-dashboard";
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

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
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
      if (window.innerWidth < 640) setProfileOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [profileOpen]);

  return (
    <header style={{ fontFamily: "universal_font" }}>
      <nav className="fixed top-0 w-full h-[5rem] flex items-center justify-between px-3 md:px-8 bg-white dark:bg-zinc-200 shadow-sm z-50">
        {/* Logo & Hamburger */}
        <div className="flex items-center gap-3">
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
              className="w-24 sm:w-36 md:w-48 lg:h-24 mt-4 transition-opacity duration-500"
            />
          </Link>
        </div>

        {/* Main Links */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium ">
          <a href="#our-story" className="text-zinc-700  hover:text-blue-600 transition-colors duration-200">
            Our Story
          </a>
          <a href="#message-from-founder" className="text-zinc-700  hover:text-blue-600 transition-colors duration-200">
            Founder’s Message
          </a>
          <a href="#our-team" className="text-zinc-700  hover:text-blue-600 transition-colors duration-200">
            Our Team
          </a>
          <Link to="/life-at-ems" className="text-zinc-700  hover:text-blue-600 transition-colors duration-200">
            Life at EaseMySpace™
          </Link>
          <Link to="/careers" className="text-zinc-700  hover:text-blue-600 transition-colors duration-200">
            Careers
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 sm:gap-5 relative">
          <NavbarRightActions />

         

          {/* Profile Dropdown */}
          <ProfileDropdown
            user={user}
            isVerified={isVerified}
            profileOpen={profileOpen}
            setProfileOpen={setProfileOpen}
            dashRoute={dashRoute}
            handleLogout={handleLogout}
          />
        </div>
      </nav>

      {/* Drawer Menu for Mobile */}
      <DrawerMenu open={open} setOpen={setOpen}>
        {/* Keep your existing drawer content inside */}
        <div className="flex flex-col px-6 py-6">
          <h2 style={{ fontFamily: "para_font" }} className="text-blue-600 text-2xl font-bold tracking-wide mb-6">Explore</h2>
          <ul className="space-y-3 text-zinc-800 font-medium text-base">
            <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1 mt-2">Main</p>
            {[
              ["Home", <FaHome />, "/"],
              ["About Us", <FaInfoCircle />, "/about"],
              ["Listings", <FaBuilding />, "/view-properties"],
              ["Contact", <FaPhone />, "/contact"],
            ].map(([label, icon, href]) => (
              <li key={href}>
                <Link
                  to={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all group hover:bg-blue-100"
                >
                  <span className="text-lg text-blue-600 group-hover:scale-110 transition-transform duration-200">{icon}</span>
                  <span className="truncate group-hover:translate-x-1 transition-transform duration-200">{label}</span>
                </Link>
              </li>
            ))}
            <p className="text-xs text-zinc-400 uppercase tracking-wide mt-6 mb-1">Premium</p>
            <li>
              <Link
                to="/subscription"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-300 to-yellow-100 text-yellow-900 shadow border border-yellow-400 group"
              >
                <span className="text-lg text-yellow-700 group-hover:scale-110 transition-transform duration-200">
                  <FaRegCreditCard />
                </span>
                <span className="truncate group-hover:translate-x-1 transition-transform duration-200">
                  EMS Subscription Plans
                </span>
              </Link>
            </li>
          </ul>
          <div className="mt-auto text-xs lg:text-lg pt-6 border-t border-zinc-200" style={{ fontFamily: "universal_font" }}>
            Making Urban Living Easy
          </div>
        </div>
      </DrawerMenu>
    </header>
  );
}
