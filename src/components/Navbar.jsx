import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import brandLogo from "/navbar-assets/brand-logo.png";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shouldRenderDropdown, setShouldRenderDropdown] = useState(false);
  const [dropdownAnimation, setDropdownAnimation] = useState("animate-fade-in-down");
  const menuRef = useRef();

  const syncUser = useCallback(() => {
    const saved = localStorage.getItem("user");
    setUser(saved ? JSON.parse(saved) : null);
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [syncUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (shouldRenderDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shouldRenderDropdown]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setDropdownAnimation("animate-fade-in-down");
      setShouldRenderDropdown(true);
    } else {
      setDropdownAnimation("animate-fade-out-up");
      const timeout = setTimeout(() => setShouldRenderDropdown(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isMobileMenuOpen]);

  const getDashboardRoute = () => {
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

  return (
    <header>
      <nav className="lg:pl-20 lg:pr-10 px-4 fixed top-0 w-full h-[5rem] flex items-center justify-between bg-white/40 backdrop-blur-md z-50 shadow-sm">
        <Link to="/" className="lg:text-3xl mt-4 text-xl font-bold text-shadow-lg" aria-label="Homepage">
          <img src={brandLogo} alt="Brand Logo" className="md:w-48 lg:h-24 w-32" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-7 text-zinc-700 font-semibold" role="navigation" aria-label="Main Navigation">
          <li><Link className="hover:text-zinc-900" to="/">Home</Link></li>
          <li><Link className="hover:text-zinc-900" to="/about">About</Link></li>
          <li><Link className="hover:text-zinc-900" to="/view-properties">Listing</Link></li>
          <li><Link className="hover:text-zinc-900" to="/contact">Contact</Link></li>
          {user && (
            <li>
              <Link className="hover:text-zinc-900" to={getDashboardRoute()}>
                Dashboard
              </Link>
            </li>
          )}
          {!user && (
            <Link
              to="/login"
              className="px-6 py-2 bg-blue-400 hover:bg-zinc-800 text-zinc-800 hover:text-blue-200 rounded-lg font-semibold shadow-lg transition duration-200"
            >
              Login
            </Link>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-3xl text-zinc-700 z-[999]"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {shouldRenderDropdown && (
        <div
          ref={menuRef}
          className={`fixed top-[4rem] left-0 w-full bg-white/40 backdrop-blur-md z-50 shadow-sm px-6 py-4 flex flex-col items-center gap-4 lg:hidden rounded-b-2xl ${dropdownAnimation}`}
        >
          <ul className="flex flex-col gap-4 text-zinc-800 text-lg font-semibold text-center w-full">
            <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link></li>
            <li><Link to="/view-properties" onClick={() => setIsMobileMenuOpen(false)}>Listing</Link></li>
            <li><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link></li>
            {user && (
              <li><Link to={getDashboardRoute()} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link></li>
            )}
          </ul>

          {!user && (
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
            >
              Login
            </Link>
          )}
        </div>
      )}

      {/* Greeting Badge */}
      {user && (
        <div
          className="fixed top-[5rem] right-5 mr-12 bg-indigo-900 text-white px-5 py-2 rounded-xl shadow-lg z-40 text-sm font-semibold flex items-center gap-2 select-none ring-2 ring-indigo-400 animate-pulse-slow"
          style={{ animationDuration: "3s" }}
        >
          <span className="text-2xl">👋</span>
          Hello, <span className="font-bold">{user.firstName}</span>!
        </div>
      )}
    </header>
  );
}

export default Navbar;
