import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

export default function ProfileDropdown({ user, isVerified, profileOpen, setProfileOpen, dashRoute, handleLogout }) {
  return (
    <div
      className="relative group profile-dropdown-wrapper"
      onMouseEnter={() => window.innerWidth >= 640 && setProfileOpen(true)}
      onMouseLeave={() => window.innerWidth >= 640 && setProfileOpen(false)}
    >
      <button
        onClick={() => window.innerWidth < 640 && setProfileOpen(prev => !prev)}
        className="flex items-center gap-1 text-zinc-700"
      >
        {user && (
          <span className="hidden sm:inline dark:text-white capitalize text-sm font-medium">
            Hello, {user.firstName}
          </span>
        )}

        {user ? (
         <div
         style={{ fontFamily: "heading_font" }}
  className="w-7 h-7 ml-1 sm:w-8 text-xl sm:h-8 rounded-full flex items-center justify-center font-bold text-white 
             bg-gradient-to-br from-blue-500 to-indigo-600 
             shadow-lg border-2 border-white 
             transition-transform duration-300 transform hover:scale-110" 
>
  {user.firstName[0].toUpperCase()}
</div>

        ) : (
          <FaUserCircle className="text-2xl" />
        )}
      </button>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl z-50 border"
          >
            <div className="px-4 py-2 text-blue-600 font-semibold text-sm border-b">
              {user ? "My Account" : "LOGIN / REGISTER"}
            </div>
            <div className="flex flex-col px-4 py-2 text-sm text-zinc-800 dark:text-white font-medium space-y-2">
              {(user || isVerified) ? (
                <Link to={dashRoute()} onClick={() => setProfileOpen(false)} className="hover:text-blue-600">
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" onClick={() => setProfileOpen(false)} className="hover:text-blue-600">
                  Login
                </Link>
              )}
              <Link to="/view-properties" onClick={() => setProfileOpen(false)} className="hover:text-blue-600">
                View Listings
              </Link>
              {(user || isVerified) && (
                <Link to="/contact" onClick={() => setProfileOpen(false)} className="hover:text-blue-600">
                  Contact Support
                </Link>
              )}
              {user && (
                <button
                  onClick={() => { handleLogout(); setProfileOpen(false); }}
                  className="text-red-600 hover:text-red-700 text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
