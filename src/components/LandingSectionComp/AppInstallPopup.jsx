import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import playBadge from "/app_assets/GetItOnGooglePlay_Badge_Web_color_English.svg";
import androidPhone from "/app_assets/android-phone/android_portrait.png";
import iphonePhone from "/app_assets/iphone/iphone-portrait.png";

export default function AppInstallPopup({ onClose }) {
  return (
    <AnimatePresence>
      {onClose && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ fontFamily: "para_font" }}
        >
          <motion.div
            className="bg-white rounded-3xl text-center shadow-2xl max-w-md w-[90%] p-6 relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
              onClick={onClose} // parent handler
            >
              <FiX size={24} />
            </button>

            <h2 className="text-2xl text-gray-900 mb-2">Get the EaseMySpace App</h2>
            <p className="text-gray-600 mb-5 text-sm">Enjoy a faster and smoother experience on your phone</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-5">
              <div className="flex flex-col items-center">
                <img src={androidPhone} alt="Android" className="h-20 w-auto mb-2 animate-bounce-slow" />
                <a href="https://play.google.com/store/apps/details?id=com.easemyspace.app" target="_blank" rel="noreferrer">
                  <img src={playBadge} alt="Get it on Google Play" className="h-12 w-auto" />
                </a>
              </div>

              <div className="flex flex-col items-center">
                <img src={iphonePhone} alt="iPhone" className="h-20 mb-2" />
                <span className="text-gray-400 text-sm">Coming Soon</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
