import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import brandLogo from "/navbar-assets/brand-logo.png";
import { logoutUser, getCurrentUser } from "../api/authApi";

import Hamburger from "./NavbarComp/Hamburger";
import ProfileDropdown from "./NavbarComp/ProfileDropdown";
import DrawerMenu from "./NavbarComp/DrawerMenu";
import NavbarRightActions from "./NavbarComp/NavbarRightActions";
import InstallAppBanner from "./NavbarComp/InstallAppBanner";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(
    localStorage.getItem("otp_verified") === "true"
  );

  const syncUser = useCallback(() => {
    const cache = localStorage.getItem("user");
    setUser(cache ? JSON.parse(cache) : null);

    const otpStatus = localStorage.getItem("otp_verified");
    setIsVerified(otpStatus === "true");
  }, []);

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) setUser(JSON.parse(cachedUser));

    (async () => {
      try {
        const me = await getCurrentUser();
        setUser(me);
        localStorage.setItem("user", JSON.stringify(me));
      } catch {
      }
    })();
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
  const [bannerHeight, setBannerHeight] = useState(0);

  const dashRoute = () => {
    if (!user && isVerified) return "/lead-dashboard";
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/admin-dashboard";
      case "owner":
        return "/owner-dashboard";
      case "RM":
        return "/rm-dashboard";
      case "HR":
        return "/hr-dashboard";
      default:
        return "/dashboard";
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    setUser(null);
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
      <nav
        className="fixed top-0 w-full flex flex-col z-40"
        style={{ height: `calc(5rem + ${bannerHeight}px)` }} 
      >
        <InstallAppBanner onHeightChange={setBannerHeight} />

        <div className="w-full h-[5rem] bg-white dark:bg-zinc-200 flex items-center justify-between px-3 md:px-8 lg:shadow-sm">
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
                className="w-24 sm:w-36 md:w-48 lg:h-24 mt-4 transition-opacity duration-500"
              />
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 sm:gap-5 relative">
            <NavbarRightActions />

            <ProfileDropdown
              user={user}
              isVerified={isVerified}
              profileOpen={profileOpen}
              setProfileOpen={setProfileOpen}
              dashRoute={dashRoute}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      </nav>

      <div style={{ height: `calc(5rem + ${bannerHeight}px)` }}></div>

      <DrawerMenu open={open} setOpen={setOpen} />
    </header>
  );
}
