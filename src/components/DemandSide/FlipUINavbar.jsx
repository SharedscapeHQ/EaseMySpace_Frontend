import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import BrankLogo from "/navbar-assets/brand-logo.png";

function FlipUINavbar({ onPostRequirementClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{ fontFamily: "universal_font" }}
      className="bg-white fixed w-full border-b border-zinc-200 shadow-sm px-6 sm:px-16 flex items-center justify-between z-50 h-16"
    >
      {/* Brand Section */}
      <div className="flex items-center">
        <div className="brand-grad flex items-center justify-center">
          <img
            src={BrankLogo}
            alt="Brand Logo"
            className="w-28 sm:w-32 object-contain"
          />
        </div>
        <div className="flex flex-col justify-start  mb-2">
          <span className="text-sm text-gray-500">Flip UX</span>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden sm:flex items-center gap-4">
        <Link
          to="/"
          className="text-gray-700 font-medium text-sm hover:text-blue-600 transition"
        >
          Home Page
        </Link>
        <button
          onClick={onPostRequirementClick}
          className="px-4 py-2 rounded-lg border text-sm border-zinc-200 text-gray-700 hover:bg-blue-600 hover:text-white transition"
        >
          Post Requirement
        </button>
        <Link
          to="/requirement-dashboard"
          className="px-4 py-2 rounded-lg border text-sm border-zinc-200 text-gray-700 hover:bg-blue-600 hover:text-white transition"
        >
          Dashboard
        </Link>
      </nav>

      {/* Mobile Menu Toggle */}
      <button
        className="sm:hidden text-2xl text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t border-zinc-200 shadow-md flex flex-col items-center gap-4 py-4 sm:hidden">
          <Link
            to="/"
            className="text-gray-700 font-medium hover:text-blue-600 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home Page
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              onPostRequirementClick();
            }}
            className="px-4 py-2 rounded-lg border border-zinc-200 text-gray-700 hover:bg-blue-600 hover:text-white transition"
          >
            Post Requirement
          </button>
          <Link
            to="/requirement-dashboard"
            className="px-4 py-2 rounded-lg border border-zinc-200 text-gray-700 hover:bg-blue-600 hover:text-white transition"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}

export default FlipUINavbar;
